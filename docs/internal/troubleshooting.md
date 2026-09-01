# Troubleshooting — Error Umum & Solusi

## Table of Contents

- [Docker](#docker)
- [Database](#database)
- [Backend Services](#backend-services)
- [Frontend](#frontend)
- [WebSocket](#websocket)
- [Production](#production)

---

## Docker

### Container tidak mau start / exit immediately

```bash
# Cek log container yang gagal
docker compose logs <nama-container>

# Common fix: rebuild dari awal
docker compose down -v
docker compose up --build
```

### Port sudah digunakan (port 8081, 15672, dll)

```
Error: Bind for 0.0.0.0:8081 failed: port is already allocated
```

**Solusi:**
```bash
# Cari proses yang pakai port
netstat -tlnp | grep 8081
# atau
lsof -i :8081

# Kill proses tersebut, atau ganti port di docker-compose.yml
```

### Docker Compose version error

```
docker-compose.yml uses an invalid format
```

**Solusi:** Pastikan pakai Docker Compose V2:
```bash
docker compose version
# Harus "Docker Compose version v2.x.x"

# Jika masih pakai docker-compose (pakai dash), update Docker Desktop
```

### "Cannot connect to Docker daemon"

```bash
# Windows: restart Docker Desktop
# Linux:
sudo systemctl start docker
sudo systemctl status docker
```

### Container unhealthy

```bash
# Cek healthcheck log
docker inspect --format='{{json .State.Health}}' <container-name> | jq

# Common fix: restart container
docker compose restart <nama-container>
```

---

## Database

### Migrasi gagal / already exists

```
SQLSTATE[42P07]: Duplicate table
```

**Solusi:**
```bash
# Reset database (HAPUS SEMUA DATA)
docker compose down -v
docker compose up --build

# Atau jalankan manual
docker compose exec identity-service php artisan migrate:fresh --force
```

### PostgreSQL refuses connection

```
SQLSTATE[HY000] [1045] Access denied for user 'eproperty'@'172.x.x.x'
```

**Solusi:**
```bash
# Cek PostgreSQL sudah sehat
docker compose ps postgres

# Cek password di .env cocok dengan yang dijalankan
# Restart PostgreSQL
docker compose restart postgres
```

### Database tidak ada (database "xxx_db" does not exist)

```bash
# Cek init script sudah mount
docker compose exec postgres ls /docker-entrypoint-initdb.d/

# Manual create database
docker compose exec postgres psql -U eproperty -c "CREATE DATABASE employee_db;"
```

### Cek semua database

```bash
docker compose exec postgres psql -U eproperty -l
```

---

## Backend Services

### "No application encryption key has been specified"

```bash
# Generate key untuk service yang bermasalah
docker compose exec identity-service php artisan key:generate

# Restart service
docker compose restart identity-service
```

### JWT verification failed

```
Token Signature could not be verified
```

**Penyebab:** `JWT_SECRET` berbeda antara identity-service dan service lain.

**Solusi:** Pastikan `JWT_SECRET` di `.env` sama untuk semua service.

### "Connection refused" ke RabbitMQ

```
PHP Fatal error: Connection to rabbitmq:5672 refused
```

**Solusi:**
```bash
# Cek RabbitMQ sehat
docker compose ps rabbitmq

# Restart RabbitMQ
docker compose restart rabbitmq

# Tunggu beberapa detik, lalu restart service yang bermasalah
docker compose restart identity-service
```

### Outbox worker tidak publish event

```bash
# Cek outbox worker log
docker compose logs identity-outbox

# Cek tabel outbox ada data
docker compose exec identity-service php artisan tinker --execute="echo App\Models\EventOutbox::count();"
```

### HTTP 502 Bad Gateway dari Nginx

```bash
# Service target belum siap, cek:
docker compose ps

# Jika service "unhealthy", cek log:
docker compose logs employee-service

# Restart yang bermasalah
docker compose restart employee-service
```

---

## Frontend

### Vite dev server tidak bisa connect ke backend

```
Failed to fetch resource at /api/v1/...
```

**Solusi:**
1. Pastikan Docker backend sudah jalan: `docker compose ps`
2. Pastikan port 8081 aktif: `curl http://localhost:8081/health`
3. Cek proxy config di `web/vite.config.ts`:
   ```ts
   proxy: {
     '/api': { target: 'http://localhost:8081', changeOrigin: true }
   }
   ```
4. Restart Vite: `Ctrl+C` lalu `npm run dev`

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solusi:** Vite proxy harus handle request. Pastikan:
- Frontend akses `/api/...` bukan full URL
- Vite config proxy sudah benar
- Tidak ada overlay CORS blocker di browser

### Module not found / dependency error

```bash
cd web
rm -rf node_modules
npm install
npm run dev
```

### Build error (production)

```bash
cd web
npm run build
# Cek error di terminal, biasanya TypeScript error
```

---

## WebSocket

### WebSocket tidak connect

```bash
# Cek realtime-gateway jalan
docker compose ps realtime-gateway

# Cek log
docker compose logs realtime-gateway

# Test WebSocket manually (install wscat terlebih dahulu)
npx wscat -c ws://localhost:8081/ws
```

### WebSocket connect tapi tidak dapat event

**Penyebab:** Token JWT tidak valid atau RabbitMQ tidak mengirim event.

```bash
# Cek outbox workers jalan
docker compose ps | grep outbox

# Cek RabbitMQ ada message
# Buka http://localhost:15672 > Queues
```

---

## Production

### SSL/TLS tidak bisa init (Let's Encrypt gagal)

```
certificate issuance failed
```

**Solusi:**
1. Pastikan domain sudah resolve ke IP server: `dig erp.yourdomain.com`
2. Pastikan port 80 dan 443 terbuka di firewall
3. Cek Caddy logs: `docker compose -f docker-compose.production.yml logs caddy`
4. Hapus data Caddy lalu redeploy:
   ```bash
   docker volume rm eproperty_caddy-data
   docker compose -f docker-compose.production.yml up --build -d
   ```

### Disk space habis

```bash
# Cek disk usage
df -h

# Cleanup Docker
docker system prune -a -v

# Cek volume backup, pindahkan yang lama
du -sh /var/backups/eproperty/*
```

### Service restart loop

```bash
# Cek log service yang restart terus
docker compose -f docker-compose.production.yml logs --tail=20 <service-name>

# Biasanya karena:
# 1. Database belum siap (tunggu health check)
# 2. Missing env variable
# 3. Migration error
```

### Database penuh

```bash
# Cek ukuran database
docker compose -f docker-compose.production.yml exec postgres \
  psql -U eproperty -c "SELECT pg_size_pretty(pg_database_size('identity_db'));"

# Cleanup log/table yang tidak perlu
# Atau tambah disk space
```

---

## Reset Development Environment (Fresh Start)

Jika semua cara gagal, mulai dari nol:

```bash
# 1. Hentikan semua container + hapus data
docker compose down -v

# 2. Hapus Docker images lama
docker image prune -a

# 3. Rebuild dari awal
docker compose up --build

# 4. Setup frontend
cd web && rm -rf node_modules && npm install && npm run dev
```

> **PERINGATAN:** Command di atas menghapus SEMUA data di database. Hanya untuk development.
