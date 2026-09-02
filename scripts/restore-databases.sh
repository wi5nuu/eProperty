#!/bin/bash
set -e

echo "Restoring databases from backup..."

if [ -z "$1" ]; then
  echo "Usage: ./restore-databases.sh <backup_directory>"
  echo "Example: ./restore-databases.sh backups/20240101_120000"
  exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup directory $BACKUP_DIR not found"
  exit 1
fi

echo "→ Restoring from: $BACKUP_DIR"

# Confirmation prompt
read -p "⚠ This will overwrite all databases. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"

# Helper function to restore (supports .sql and .sql.gz)
restore_db() {
    local db=$1
    local sql_file="$BACKUP_DIR/${db}.sql"
    local gz_file="$BACKUP_DIR/${db}.sql.gz"

    if [ -f "$gz_file" ]; then
        echo "→ Restoring $db (compressed)"
        gunzip -c "$gz_file" | $COMPOSE exec -T postgres psql -U "$POSTGRES_USER" "$db"
    elif [ -f "$sql_file" ]; then
        echo "→ Restoring $db"
        $COMPOSE exec -T postgres psql -U "$POSTGRES_USER" "$db" < "$sql_file"
    else
        echo "⚠ Skipping $db (no backup found)"
    fi
}

# Restore each database
restore_db "identity_db"
restore_db "customer_db"
restore_db "employee_db"
restore_db "contractor_db"
restore_db "supplier_db"
restore_db "meter_reading_db"

echo "✓ All databases restored successfully from $BACKUP_DIR"
