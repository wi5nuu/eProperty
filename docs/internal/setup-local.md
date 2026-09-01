# Setup Lokal — Panduan Lengkap

Panduan menjalankan eProperty ERP di localhost untuk development.

## Prasyarat

Pastikan sudah terinstall:

| Software | Versi Minimum | Cek Instalasi |
| --- | --- | --- |
| **Docker Desktop** | 4.x | `docker --version` |
| **Docker Compose** | V2 | `docker compose version` |
| **Node.js** | 20+ | `node --version` |
| **npm** | 10+ | `npm --version` |
| **Git** | 2.x | `git --version` |

### Windows Specific
- Install **Docker Desktop for Windows** (bukan WSL-only)
- Enable **WSL 2** backend di Docker Desktop Settings
- Gunakan **PowerShell** atau **Windows Terminal**

### macOS Specific
- Install Docker Desktop for Mac (Apple Silicon atau Intel sesuai chip)

### Linux Specific
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Logout lalu login ulang

# Install Docker Compose plugin (biasanya sudah included)
docker compose version
```

## Step 1: Clone Repository

```bash
git clone <repository-url> eproperty
cd eproperty
```

## Step 2: Setup Environment Variables

```bash
# Copy .env.example ke .env di root project
cp .env.example .env
```

Isi file `.env` dengan konfigurasi default development:

```env
POSTGRES_USER=eproperty
POSTGRES_PASSWORD=change-me-before-deployment
IDENTITY_DB=identity_db
EMPLOYEE_DB=employee_db
CONTRACTOR_DB=contractor_db
CUSTOMER_DB=customer_db
SUPPLIER_DB=supplier_db
METER_READING_DB=meter_reading_db
JWT_SECRET=development-only-secret-please-change-1234567890
RABBITMQ_USER=eproperty
RABBITMQ_PASSWORD=eproperty-dev-pass
```

> Untuk development, nilai default di atas sudah bisa langsung digunakan.

## Step 3: Jalankan Backend (Docker)

```bash
docker compose up --build
```

Tunggu sampai semua container berjalan. Output yang menunjukkan sukses:

```
postgres-16         ... healthy
rabbitmq-4          ... healthy
identity-service    ... healthy
employee-service    ... healthy
contractor-service  ... healthy
customer-service    ... healthy
supplier-service    ... healthy
meter-reading-svc   ... healthy
realtime-gateway    ... healthy
gateway-nginx       ... started
```

**Yang terjadi saat pertama kali run:**

1. PostgreSQL membuat 6 database (`identity_db`, `employee_db`, `contractor_db`, `customer_db`, `supplier_db`, `meter_reading_db`)
2. Identity-service menjalankan migrasi + seed admin user (`admin@eproperty.local` / `ChangeMe123!`)
3. Setiap service menjalankan migrasi otomatis
4. Outbox workers mulai listen perubahan database
5. Realtime-gateway connect ke RabbitMQ
6. Nginx gateway mulai routing di port 8081

## Step 4: Jalankan Frontend

Buka terminal baru (jangan dihentikan terminal Docker):

```bash
cd web
npm install
npm run dev
```

Frontend React berjalan di `http://localhost:5173` dengan hot-reload.

### Proxy Configuration

Vite dev server sudah dikonfigurasi otomatis proxy ke backend:

| Path | Target |
| --- | --- |
| `/api/*` | `http://localhost:8081` |
| `/storage/*` | `http://localhost:8081` |
| `/ws` | `ws://localhost:8081` |

Jadi frontend langsung bisa akses API tanpa CORS issue.

## Step 5: Login

1. Buka `http://localhost:5173`
2. Login dengan:
   - Email: `admin@eproperty.local`
   - Password: `ChangeMe123!`

## Verifikasi Sistem Berjalan

### Cek API Gateway

```bash
# Health check gateway
curl http://localhost:8081/health

# Cek identity service
curl http://localhost:8081/api/v1/identity/health
```

### Cek RabbitMQ Management

Buka `http://localhost:15672` di browser:
- Username: `eproperty`
- Password: `eproperty-dev-pass`

### Cek Database

```bash
# Masuk ke container PostgreSQL
docker compose exec postgres psql -U eproperty -d identity_db

# Lihat tabel
\dt

# Keluar
\q
```

### Cek WebSocket

WebSocket endpoint tersedia di `ws://localhost:8081/ws` (butuh JWT token untuk autentikasi).

## Menjalankan Service Individual (Tanpa Docker)

Jika ingin menjalankan satu service saja untuk development:

### Identity Service

```bash
cd services/identity-service

# Setup (hanya pertama kali)
composer setup

# Jalankan
php artisan serve --port=8000
```

### Employee Service

```bash
cd services/employee-service
composer setup
php artisan serve --port=8001
```

### Frontend Saja

```bash
cd web
npm install
npm run dev
```

> **Catatan:** Menjalankan individual butuh PostgreSQL dan RabbitMQ berjalan sendiri. Lebih praktis pakai Docker Compose untuk full stack.

## Useful Commands

```bash
# Lihat semua container yang berjalan
docker compose ps

# Lihat log semua service
docker compose logs -f

# Lihat log service tertentu
docker compose logs -f identity-service

# Stop semua container (data tersimpan di volume)
docker compose down

# Stop + hapus semua data (fresh start)
docker compose down -v

# Rebuild satu service
docker compose up --build identity-service

# Masuk ke container tertentu
docker compose exec identity-service sh

# Jalankan artisan command di container
docker compose exec identity-service php artisan migrate:status

# Jalankan artisan command di identity-service
docker compose exec identity-service php artisan db:seed --force
```

## Struktur Project

```
eproperty/
├── .env                          # Environment variables (jangan commit)
├── docker-compose.yml            # Local development compose
├── docker-compose.production.yml # Production compose
├── services/
│   ├── identity-service/         # Auth, JWT, roles
│   ├── employee-service/         # Data pegawai
│   ├── contractor-service/       # Data kontraktor
│   ├── customer-service/         # Data customer
│   ├── supplier-service/         # Data supplier
│   ├── meter-reading-service/    # Pembacaan meter air
│   └── realtime-gateway/         # WebSocket + RabbitMQ consumer
├── web/                          # React SPA frontend
├── infrastructure/
│   ├── gateway/nginx.conf        # Nginx API gateway config
│   └── postgres/init-databases.sh
├── deploy/
│   ├── .env.production.example
│   ├── caddy/Caddyfile
│   └── scripts/backup-postgres.sh
└── docs/
    ├── architecture.md
    ├── api.md
    └── internal/                 # Dokumen internal tim (anda di sini)
```
