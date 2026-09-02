#!/usr/bin/env sh
set -eu

# Jalankan dari root repository di VPS. Simpan BACKUP_DIR di disk/volume terpisah.
backup_dir="${BACKUP_DIR:-/var/backups/eproperty}"
retention_days="${RETENTION_DAYS:-30}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

mkdir -p "$backup_dir"

# Backup each service database
for db in identity_db customer_db employee_db contractor_db supplier_db meter_reading_db; do
  echo "Backing up $db..."
  $COMPOSE -f docker-compose.production.yml exec -T postgres \
    pg_dump --username="$POSTGRES_USER" "$db" | gzip > "$backup_dir/$db-$stamp.sql.gz"
done

find "$backup_dir" -type f -name '*.sql.gz' -mtime "+$retention_days" -delete
echo "Backup selesai di: $backup_dir"
