# Deploy ke VPS Ubuntu

## Prasyarat

- Ubuntu 24.04 LTS, Docker Engine + Docker Compose plugin;
- domain DNS A/AAAA sudah mengarah ke IP VPS;
- firewall hanya membuka TCP 22, 80, dan 443;
- volume backup terpisah dari disk aplikasi.

## Deploy pertama

1. Clone repository ke VPS lalu salin `deploy/.env.production.example` menjadi `.env` di root repository.
2. Isi semua secret dengan nilai acak. Buat `APP_KEY` masing-masing service memakai `php artisan key:generate --show` dari folder service terkait.
3. Jalankan `docker compose -f docker-compose.production.yml up --build -d`.
4. Buat administrator satu kali dengan environment `INITIAL_ADMIN_EMAIL` dan `INITIAL_ADMIN_PASSWORD`, lalu jalankan `php artisan db:seed --force` dalam container identity. Hapus kedua environment tersebut sesudahnya.
5. Periksa `https://DOMAIN/health`, kemudian login melalui portal.

## Operasi rutin

- Lihat status: `docker compose -f docker-compose.production.yml ps`
- Lihat log: `docker compose -f docker-compose.production.yml logs -f identity-service`
- Backup: jadwalkan `deploy/scripts/backup-postgres.sh` dengan cron harian dan uji restore secara berkala.
- Upgrade: backup tervalidasi, `git pull`, `docker compose -f docker-compose.production.yml up --build -d`, lalu cek health endpoint dan migration log.

## Batas keamanan

Database dan RabbitMQ tidak dipublikasikan. Akses administrasi VPS harus menggunakan SSH key, nonaktifkan login password/root, dan kelola `.env` dengan izin file `600`. Untuk enterprise, pindahkan secret dari `.env` ke secret manager dan lakukan rotasi berkala.
