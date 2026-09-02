#!/bin/bash
set -e

echo "Backing up all service databases..."

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "→ Creating backup directory: $BACKUP_DIR"

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"

# Identity Service
echo "→ Backing up Identity Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" identity_db | gzip > "$BACKUP_DIR/identity_db.sql.gz"

# Customer Service
echo "→ Backing up Customer Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" customer_db | gzip > "$BACKUP_DIR/customer_db.sql.gz"

# Employee Service
echo "→ Backing up Employee Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" employee_db | gzip > "$BACKUP_DIR/employee_db.sql.gz"

# Contractor Service
echo "→ Backing up Contractor Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" contractor_db | gzip > "$BACKUP_DIR/contractor_db.sql.gz"

# Supplier Service
echo "→ Backing up Supplier Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" supplier_db | gzip > "$BACKUP_DIR/supplier_db.sql.gz"

# Meter Reading Service
echo "→ Backing up Meter Reading Service database"
$COMPOSE exec -T postgres pg_dump -U "$POSTGRES_USER" meter_reading_db | gzip > "$BACKUP_DIR/meter_reading_db.sql.gz"

# Retention: keep only last 7 backups
echo "→ Cleaning old backups (keeping last 7)"
ls -dt backups/*/ 2>/dev/null | tail -n +8 | xargs -r rm -rf

echo "✓ All databases backed up successfully to $BACKUP_DIR"
