# Deploy ke Production — Panduan Lengkap

Panduan deploy eProperty ERP ke VPS/Server produksi.

## Prasyarat Server

| Komponen | Minimum |
| --- | --- |
| **OS** | Ubuntu 24.04 LTS |
| **RAM** | 4 GB (recommended 8 GB) |
| **Disk** | 40 GB SSD |
| **CPU** | 2 vCPU |
| **Docker** | Engine 24+ + Compose plugin |
| **Domain** | DNS A/AAAA record sudah mengarah ke IP server |

## Prasyarat Tambahan

- Akses SSH ke server (SSH key, bukan password)
- Firewall hanya buka port **22** (SSH), **80** (HTTP), **443** (HTTPS)
- Volume backup terpisah dari disk aplikasi

## Step 1: Install Docker di Server

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Pastikan Docker jalan
sudo systemctl enable docker
sudo systemctl start docker

# Verifikasi
docker --version
docker compose version
```

## Step 2: Clone Repository

```bash
cd /opt
sudo git clone <repository-url> eproperty
cd eproperty
```

## Step 3: Setup Environment Production

```bash
# Copy template production
cp deploy/.env.production.example .env
```

**WAJIB edit `.env` dan isi semua nilai:**

```env
# Domain (harus sudah DNS resolve ke IP server)
DOMAIN=erp.yourdomain.com
ACME_EMAIL=infra@yourdomain.com

# Database — gunakan password ACAK minimal 32 karakter
POSTGRES_USER=eproperty
POSTGRES_PASSWORD=<Buat password acak yang kuat>

# JWT Secret — gunakan string acak panjang
JWT_SECRET=<Buat random string minimal 64 karakter>

# App Keys — generate dari dalam container nanti
IDENTITY_APP_KEY=base64:<generate dengan artisan>
EMPLOYEE_APP_KEY=base64:<generate dengan artisan>
CONTRACTOR_APP_KEY=base64:<generate dengan artisan>
CUSTOMER_APP_KEY=base64:<generate dengan artisan>
SUPPLIER_APP_KEY=base64:<generate dengan artisan>
METER_READING_APP_KEY=base64:<generate dengan artisan>

# Database names
IDENTITY_DB=identity_db
EMPLOYEE_DB=employee_db
CONTRACTOR_DB=contractor_db
CUSTOMER_DB=customer_db
SUPPLIER_DB=supplier_db
METER_READING_DB=meter_reading_db

# JWT settings
JWT_TTL_MINUTES=15

# RabbitMQ
RABBITMQ_USER=eproperty
RABBITMQ_PASSWORD=<Buat password acak yang kuat>

# Admin initial (hapus setelah setup pertama)
INITIAL_ADMIN_EMAIL=admin@yourdomain.com
INITIAL_ADMIN_PASSWORD=<Buat password admin yang kuat>
```

### Cara Generate App Keys

Setelah `.env` terisi, jalankan sekali untuk generate APP_KEY setiap service:

```bash
# Build dulu
docker compose -f docker-compose.production.yml build

# Generate key untuk masing-masing service
docker compose -f docker-compose.production.yml run --rm identity-service php artisan key:generate --show
docker compose -f docker-compose.production.yml run --rm employee-service php artisan key:generate --show
docker compose -f docker-compose.production.yml run --rm contractor-service php artisan key:generate --show
docker compose -f docker-compose.production.yml run --rm customer-service php artisan key:generate --show
docker compose -f docker-compose.production.yml run --rm supplier-service php artisan key:generate --show
docker compose -f docker-compose.production.yml run --rm meter-reading-service php artisan key:generate --show
```

Copy hasil output `base64:...` ke variabel `*_APP_KEY` yang sesuai di `.env`.

## Step 4: Deploy

```bash
# Build dan jalankan semua service
docker compose -f docker-compose.production.yml up --build -d
```

Tunggu sampai semua sehat:

```bash
docker compose -f docker-compose.production.yml ps
```

## Step 5: Setup Admin User (Pertama Kali)

```bash
# Masuk ke container identity-service
docker compose -f docker-compose.production.yml exec identity-service sh

# Jalankan seeder
php artisan db:seed --force

# Keluar dari container
exit
```

> **HAPUS** `INITIAL_ADMIN_EMAIL` dan `INITIAL_ADMIN_PASSWORD` dari `.env` setelah admin berhasil dibuat.

## Step 6: Verifikasi

```bash
# Cek health endpoint
curl -k https://erp.yourdomain.com/health

# Cek API
curl -k https://erp.yourdomain.com/api/v1/identity/health
```

Buka `https://erp.yourdomain.com` di browser. Login dengan credential admin yang sudah dibuat.

## Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

**JANGAN buka port lain** (5432 PostgreSQL, 15672 RabbitMQ, 8081 Nginx internal). Semua sudah di-restrict ke Docker network internal.

## Backup Database

```bash
# Manual backup
bash deploy/scripts/backup-postgres.sh

# Jadwalkan backup otomatis via cron
sudo crontab -e
```

Tambahkan baris berikut untuk backup harian jam 2 pagi:

```
0 2 * * * /opt/eproperty/deploy/scripts/backup-postgres.sh >> /var/log/eproperty-backup.log 2>&1
```

### Restore Backup

```bash
# Cari file backup terbaru
ls -la /var/backups/eproperty/

# Restore
docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U eproperty < /var/backups/eproperty/eproperty_YYYYMMDD_HHMMSS.sql.gz
```

## Operasi Rutin

### Lihat Status

```bash
docker compose -f docker-compose.production.yml ps
```

### Lihat Log

```bash
# Semua service
docker compose -f docker-compose.production.yml logs -f

# Service tertentu
docker compose -f docker-compose.production.yml logs -f identity-service

# Terakhir 100 baris
docker compose -f docker-compose.production.yml logs --tail=100 identity-service
```

### Update / Upgrade

```bash
# 1. Backup database dulu!
bash deploy/scripts/backup-postgres.sh

# 2. Pull code terbaru
git pull origin main

# 3. Rebuild dan deploy
docker compose -f docker-compose.production.yml up --build -d

# 4. Cek health
curl -k https://erp.yourdomain.com/health

# 5. Cek migration log
docker compose -f docker-compose.production.yml logs identity-service | grep migrate
```

### Restart Service

```bash
# Restart semua
docker compose -f docker-compose.production.yml restart

# Restart service tertentu
docker compose -f docker-compose.production.yml restart identity-service
```

### Stop Semua

```bash
docker compose -f docker-compose.production.yml down
```

> Data PostgreSQL tersimpan di Docker volume `postgres-data`, tidak hilang saat `down`.

## Monitoring Checklist

| Item | Cara Cek | Frekuensi |
| --- | --- | --- |
| Container sehat | `docker compose ps` | Harian |
| Disk usage | `df -h` | Mingguan |
| Log error | `docker compose logs --tail=50` | Harian |
| Backup berhasil | Cek `/var/backups/eproperty/` | Harian |
| SSL certificate | Browser atau `curl -vI https://domain` | Bulanan |
| Database size | `SELECT pg_size_pretty(pg_database_size('identity_db'));` | Bulanan |

## Keamanan Production

1. **SSH Key Only** — Nonaktifkan `PasswordAuthentication` di `/etc/ssh/sshd_config`
2. **.env Permission** — `chmod 600 .env`
3. **No Root Login** — Disable `PermitRootLogin` di sshd
4. **Regular Updates** — `apt update && apt upgrade` minimal bulanan
5. **Docker Updates** — Update Docker image secara berkala
6. **Log Rotation** — Pastikan Docker log driver terkonfigurasi
7. **Secret Manager** — Untuk enterprise, pindahkan secret dari `.env` ke Vault/AWS Secrets Manager
