# Arsitektur — Referensi Singkat untuk Tim

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                   React SPA (Vite :5173)                      │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP / WebSocket
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                   NGINX GATEWAY (:8081)                      │
│         Routing / Timeout / Circuit Breaking                 │
├──────────────────────────────────────────────────────────────┤
│  /api/v1/identity/*    │  /api/v1/meter/*                    │
│  /api/v1/employees/*   │  /ws (WebSocket)                    │
│  /api/v1/contractors/* │                                     │
│  /api/v1/customers/*   │                                     │
│  /api/v1/suppliers/*   │                                     │
└───────┬──────┬──────┬──┴──┬──────┬──────┬───────────────────┘
        │      │      │     │      │      │
        ▼      ▼      ▼     ▼      ▼      ▼
┌────┐┌────┐┌────┐┌────┐┌────┐┌──────────┐
│ID  ││Emp ││Cust││Cont││Supp││Meter     │
│Svc ││Svc ││Svc ││Svc ││Svc ││Reading   │
│:8k ││:8k ││:8k ││:8k ││:8k ││Svc :8k   │
└──┬─┘└──┬─┘└──┬─┘└──┬─┘└──┬─┘└────┬─────┘
   │     │     │     │     │       │
   ▼     ▼     ▼     ▼     ▼       ▼
┌──────────────────────────────────────────────────────────────┐
│                     POSTGRESQL 16                             │
│  identity_db │ employee_db │ contractor_db │ customer_db ... │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│                       RABBITMQ 4                             │
│            Exchange: eproperty.events (topic)                 │
└──────────────────┬───────────────────────────────────────────┘
                   │ Consumer
                   ▼
┌──────────────────────────────────────────────────────────────┐
│              REALTIME GATEWAY (Node.js :3000)                │
│        RabbitMQ consumer → WebSocket broadcast               │
└──────────────────────────────────────────────────────────────┘
```

## Microservices

| Service | Port | Database | Tech | Responsibility |
| --- | --- | --- | --- | --- |
| **identity-service** | 8000 | identity_db | Laravel 12 | Auth, JWT, roles, permissions |
| **employee-service** | 8000 | employee_db | Laravel 12 | Data pegawai |
| **contractor-service** | 8000 | contractor_db | Laravel 12 | Data kontraktor |
| **customer-service** | 8000 | customer_db | Laravel 12 | Data customer |
| **supplier-service** | 8000 | supplier_db | Laravel 12 | Data supplier |
| **meter-reading-service** | 8000 | meter_reading_db | Laravel 12 | Meter air, rumah, peta |
| **realtime-gateway** | 3000 | - | Node.js | WebSocket + RabbitMQ consumer |

## Key Patterns

### 1. Database-per-Service
Setiap microservice punya database sendiri. **Tidak ada** foreign key lintas database atau query langsung ke database service lain.

### 2. Transactional Outbox Pattern
```
Business Transaction:
  1. Tulis perubahan bisnis ke tabel bisnis
  2. Tulis event ke tabel `event_outbox`
  → SATU transaksi database yang sama

Outbox Worker:
  1. Baca event dari `event_outbox` (status: pending)
  2. Publish ke RabbitMQ
  3. Tandai event sebagai published
```

**Mengapa?** Memastikan event pasti terkirim tanpa distributed transaction. Idempotent consumer menangani double-delivery.

### 3. Event-Driven Async
- **Exchange:** `eproperty.events` (topic)
- **Routing key format:** `{domain}.{event}` (contoh: `employee.created`, `customer.updated`)
- **Consumer:** realtime-gateway → broadcast ke browser via WebSocket

### 4. JWT Stateless Auth
- Identity-service **menerbitkan** JWT (TTL 15 menit default)
- Semua service lain **verifikasi** JWT lokal menggunakan shared secret (`JWT_SECRET`)
- Tidak ada runtime dependency ke identity-service saat request

### 5. Edge Gateway
- **Nginx:** Internal routing, timeout, circuit breaking, WebSocket proxy
- **Caddy (production):** TLS termination, automatic HTTPS via Let's Encrypt, security headers

## API Routing

| External Path | Internal Path | Service |
| --- | --- | --- |
| `/api/v1/identity/*` | `/api/*` | identity-service |
| `/api/v1/employees/*` | `/api/employees/*` | employee-service |
| `/api/v1/contractors/*` | `/api/contractors/*` | contractor-service |
| `/api/v1/customers/*` | `/api/customers/*` | customer-service |
| `/api/v1/suppliers/*` | `/api/suppliers/*` | supplier-service |
| `/api/v1/meter/*` | `/api/*` | meter-reading-service |
| `/ws` | `/` | realtime-gateway (WebSocket) |

## Data Flow: Membuat Data Baru

```
1. Browser POST /api/v1/customers
        │
        ▼
2. Nginx → customer-service
        │
        ▼
3. Customer-service:
   a. Verifikasi JWT (signature check)
   b. Validasi input
   c. Tulis ke customer_db.customers
   d. Tulis event ke customer_db.event_outbox
   → COMMIT (satu transaksi)
        │
        ▼
4. Outbox worker (customer-outbox):
   a. Baca event dari outbox (status=pending)
   b. Publish ke RabbitMQ (exchange: eproperty.events)
   c. Update status outbox → published
        │
        ▼
5. Realtime-gateway:
   a. Consume event dari RabbitMQ
   b. Broadcast ke semua browser yang connect via WebSocket
        │
        ▼
6. Browser menerima event real-time
```

## Ports Reference

| Port | Service | Exposed |
| --- | --- | --- |
| 8081 | Nginx Gateway | Ya (local) |
| 80 | Caddy HTTP | Ya (production) |
| 443 | Caddy HTTPS | Ya (production) |
| 5173 | Vite Dev Server | Ya (local only) |
| 15672 | RabbitMQ Management | Ya (local only) |
| 5432 | PostgreSQL | Tidak |
| 5672 | RabbitMQ AMQP | Tidak |
| 8000 | Laravel (internal) | Tidak |
| 3000 | Realtime Gateway (internal) | Tidak |

## Dokumentasi Tambahan

- [Arsitektur lengkap](../architecture.md) — Decision record, bounded context
- [API Contract](../api.md) — Endpoint, request/response format
- [Migration Plan](../migration-plan.md) — 10-phase domain implementation roadmap
