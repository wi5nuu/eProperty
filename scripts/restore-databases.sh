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

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# Identity Service
echo "→ Restoring Identity Service database"
$COMPOSE exec -T postgres psql -U postgres identity_db < "$BACKUP_DIR/identity_db.sql"

# Customer Service
echo "→ Restoring Customer Service database"
$COMPOSE exec -T postgres psql -U postgres customer_db < "$BACKUP_DIR/customer_db.sql"

# Employee Service
echo "→ Restoring Employee Service database"
$COMPOSE exec -T postgres psql -U postgres employee_db < "$BACKUP_DIR/employee_db.sql"

# Contractor Service
echo "→ Restoring Contractor Service database"
$COMPOSE exec -T postgres psql -U postgres contractor_db < "$BACKUP_DIR/contractor_db.sql"

# Supplier Service
echo "→ Restoring Supplier Service database"
$COMPOSE exec -T postgres psql -U postgres supplier_db < "$BACKUP_DIR/supplier_db.sql"

# Meter Reading Service
echo "→ Restoring Meter Reading Service database"
$COMPOSE exec -T postgres psql -U postgres meter_reading_db < "$BACKUP_DIR/meter_reading_db.sql"

echo "✓ All databases restored successfully from $BACKUP_DIR"
