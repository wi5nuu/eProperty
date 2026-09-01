<?php

namespace App\Support;

use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Throwable;

class AmqpEventPublisher
{
    private ?AMQPStreamConnection $connection = null;

    private ?AMQPChannel $channel = null;

    public function publish(OutboxMessage $message): void
    {
        $envelope = json_encode([
            'event_id' => $message->id,
            'event_type' => $message->event_type,
            'occurred_at' => $message->occurred_at->toIso8601String(),
            'producer' => (string) config('messaging.producer'),
            'payload' => $message->payload,
        ], JSON_THROW_ON_ERROR);

        $amqpMessage = new AMQPMessage($envelope, [
            'message_id' => $message->id,
            'type' => $message->event_type,
            'content_type' => 'application/json',
            'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT,
            'timestamp' => $message->occurred_at->getTimestamp(),
        ]);

        $this->channel()->basic_publish($amqpMessage, (string) config('messaging.exchange'), $message->event_type);
    }

    public function close(): void
    {
        foreach ([$this->channel, $this->connection] as $resource) {
            try {
                $resource?->close();
            } catch (Throwable) {
                // Koneksi atau channel sudah ditutup di sisi broker.
            }
        }

        $this->channel = null;
        $this->connection = null;
    }

    private function channel(): AMQPChannel
    {
        if ($this->channel !== null && $this->connection?->isConnected()) {
            return $this->channel;
        }

        $this->close();

        $this->connection = new AMQPStreamConnection(
            host: (string) config('messaging.host'),
            port: (int) config('messaging.port'),
            user: (string) config('messaging.user'),
            password: (string) config('messaging.password'),
            vhost: (string) config('messaging.vhost'),
        );
        $this->channel = $this->connection->channel();
        $this->channel->exchange_declare((string) config('messaging.exchange'), 'topic', passive: false, durable: true, auto_delete: false);

        return $this->channel;
    }
}
