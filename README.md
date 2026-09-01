# eProperty ERP

Sistem ERP berbasis microservices Laravel untuk manajemen properti.

## Arsitektur

```
Browser ──▶ Gateway (nginx :8081) ──▶ Service ──▶ PostgreSQL
                         │                    └──▶ RabbitMQ ──▶ Realtime Gateway ──▶ WebSocket
```

## Service

| Service | Fungsi |
|---|---|
| identity-service | Autentikasi, otorisasi, JWT |
| employee-service | Data pegawai |
| contractor-service | Data kontraktor |
| customer-service | Master customer |
| supplier-service | Master supplier |
| meter-reading-service | Pembacaan meter air |
| realtime-gateway | Event streaming via WebSocket |
| gateway | Reverse proxy, rate limiting |

## Event System

Service menulis event ke `event_outbox` → worker menerbitkan ke RabbitMQ `eproperty.events` → browser menerima via `ws://<host>/ws`.

## Dokumentasi

- [Arsitektur](docs/architecture.md)
- [Roadmap Domain](docs/migration-plan.md)
- [API](docs/api.md)
