'use strict';

const http = require('node:http');
const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT || 3000);
const RABBITMQ_URL = process.env.RABBITMQ_URL || '';
const EXCHANGE = process.env.EVENT_EXCHANGE || 'eproperty.events';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_ISSUER = process.env.JWT_ISSUER || 'eproperty-identity';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'eproperty-services';
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const MAX_CLIENTS = 1000;

const clients = new Set();
let amqpConnection = null;
let amqpChannel = null;
let shouldRun = true;

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'realtime-gateway',
      amqp: Boolean(amqpConnection),
      clients: clients.size,
    }));
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

httpServer.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }

  if (!JWT_SECRET) {
    socket.write('HTTP/1.1 503 Service Unavailable\r\n\r\n');
    socket.destroy();
    return;
  }

  let payload;
  try {
    const token = url.searchParams.get('token') || bearerToken(request.headers.authorization);
    payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE, algorithms: ['HS256'] });
  } catch {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    if (clients.size >= MAX_CLIENTS) {
      ws.close(1013, 'Server is full');
      return;
    }
    ws.context = { email: payload.email || null, connectedAt: new Date().toISOString() };
    ws.isAlive = true;
    clients.add(ws);
    ws.send(JSON.stringify({
      event_type: 'realtime.connected',
      occurred_at: ws.context.connectedAt,
      payload: { message: 'Terhubung ke event stream eProperty.' },
    }));
    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));
    ws.on('pong', () => { ws.isAlive = true; });
  });
});

function bearerToken(header) {
  if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim();
}

function broadcast(rawMessage) {
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(rawMessage);
    }
  }
}

function heartbeat() {
  for (const client of clients) {
    if (client.isAlive === false) {
      client.terminate();
      clients.delete(client);
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}

const heartbeatTimer = setInterval(heartbeat, 30000);
heartbeatTimer.unref();

let reconnectAttempts = 0;

function scheduleReconnect() {
  if (!shouldRun) return;
  amqpConnection = null;
  amqpChannel = null;
  const delay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * (2 ** reconnectAttempts++));
  console.error(`[realtime-gateway] mencoba ulang koneksi RabbitMQ dalam ${delay}ms`);
  setTimeout(connectAmqp, delay);
}

async function connectAmqp() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL, { heartbeat: 10 });
    connection.on('error', (err) => console.error('[realtime-gateway] koneksi AMQP error:', err.message));
    connection.on('close', () => scheduleReconnect());

    const channel = await connection.createChannel();
    channel.on('error', (err) => console.error('[realtime-gateway] channel AMQP error:', err.message));
    channel.on('close', () => {
      if (shouldRun && amqpChannel === channel) scheduleReconnect();
    });

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    const queue = await channel.assertQueue('', { exclusive: true, autoDelete: true });
    await channel.bindQueue(queue.queue, EXCHANGE, '#');

    await channel.consume(queue.queue, (message) => {
      if (message === null) return;
      try {
        const envelope = JSON.parse(message.content.toString('utf8'));
        envelope.event_id = envelope.event_id || message.properties.messageId;
        broadcast(JSON.stringify(envelope));
        channel.ack(message);
      } catch (err) {
        console.error('[realtime-gateway] pesan tidak valid:', err.message);
        channel.nack(message, false, false);
      }
    }, { noLocal: false });

    amqpConnection = connection;
    amqpChannel = channel;
    reconnectAttempts = 0;
    console.log(`[realtime-gateway] terhubung ke RabbitMQ, exchange "${EXCHANGE}", ${clients.size} client WebSocket`);
  } catch (err) {
    console.error('[realtime-gateway] gagal terhubung ke RabbitMQ:', err.message);
    scheduleReconnect();
  }
}

process.on('SIGTERM', () => {
  shouldRun = false;
  for (const client of clients) client.close(1001, 'server shutting down');
  amqpConnection?.close().catch(() => {});
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
});

process.on('SIGINT', () => {
  shouldRun = false;
  for (const client of clients) client.close(1001, 'server shutting down');
  amqpConnection?.close().catch(() => {});
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
});

httpServer.listen(PORT, () => {
  console.log(`[realtime-gateway] HTTP/WS listen di port ${PORT}`);
  connectAmqp();
});
