# eProperty ERP — Panduan Internal Tim

Dokumen ini khusus untuk tim developer eProperty ERP. Berisi panduan lengkap mulai dari setup lokal hingga deploy ke production.

## Dokumen

| Dokumen | Isi |
| --- | --- |
| [Setup Lokal](setup-local.md) | Cara menjalankan seluruh sistem di localhost (step-by-step) |
| [Deploy Production](setup-production.md) | Cara deploy ke VPS/Server produksi |
| [Troubleshooting](troubleshooting.md) | Error umum dan cara mengatasinya |
| [Arsitektur](architecture-overview.md) | Referensi singkat arsitektur microservices |

## Arsitektur Singkat

```
Browser (React SPA :5173)
        |
        v
  Nginx Gateway (:8081)
   /api/v1/identity/*    --> identity-service
   /api/v1/employees/*   --> employee-service
   /api/v1/contractors/* --> contractor-service
   /api/v1/customers/*   --> customer-service
   /api/v1/suppliers/*   --> supplier-service
   /api/v1/meter/*       --> meter-reading-service
   /ws                   --> realtime-gateway (WebSocket)
        |
        v
  PostgreSQL 16 (6 databases) + RabbitMQ 4 (event bus)
```

## Default Credentials (Development)

| Item | Value |
| --- | --- |
| Admin email | `admin@eproperty.local` |
| Admin password | `ChangeMe123!` |
| PostgreSQL user | `eproperty` |
| PostgreSQL password | `change-me-before-deployment` |
| RabbitMQ user | `eproperty` |
| RabbitMQ password | `eproperty-dev-pass` |
| RabbitMQ Management | `http://localhost:15672` |

> **PENTING:** Credentials di atas HANYA untuk development. Jangan pernah digunakan di production.

## Port Mapping

| Service | Port (Local) | Keterangan |
| --- | --- | --- |
| Nginx Gateway | 8081 | API gateway, akses utama |
| React Dev Server | 5173 | Frontend (hot reload) |
| RabbitMQ Management | 15672 | Web UI monitoring RabbitMQ |
| PostgreSQL | 5432 | Database (tidak di-expose ke host di production) |

## Quick Start (3 langkah)

```bash
# 1. Jalankan backend + infra
docker compose up --build

# 2. Jalankan frontend (terminal baru)
cd web && npm install && npm run dev

# 3. Buka browser
#    Frontend: http://localhost:5173
#    API:      http://localhost:8081/api/v1/identity/health
```
