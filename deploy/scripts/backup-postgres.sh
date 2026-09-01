#!/usr/bin/env sh
set -eu

# Jalankan dari root repository di VPS. Simpan BACKUP_DIR di disk/volume terpisah.
backup_dir="${BACKUP_DIR:-/var/backups/eproperty}"
retention_days="${RETENTION_DAYS:-30}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$backup_dir"
docker compose -f docker-compose.production.yml exec -T postgres \
  pg_dumpall --username="$POSTGRES_USER" | gzip > "$backup_dir/eproperty-$stamp.sql.gz"
find "$backup_dir" -type f -name 'eproperty-*.sql.gz' -mtime "+$retention_days" -delete
echo "Backup dibuat: $backup_dir/eproperty-$stamp.sql.gz"
