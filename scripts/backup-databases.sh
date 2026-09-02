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

# Identity Service
echo "→ Backing up Identity Service database"
$COMPOSE exec -T postgres pg_dump -U postgres identity_db > "$BACKUP_DIR/identity_db.sql"

# Customer Service
echo "→ Backing up Customer Service database"
$COMPOSE exec -T postgres pg_dump -U postgres customer_db > "$BACKUP_DIR/customer_db.sql"

# Employee Service
echo "→ Backing up Employee Service database"
$COMPOSE exec -T postgres pg_dump -U postgres employee_db > "$BACKUP_DIR/employee_db.sql"

# Contractor Service
echo "→ Backing up Contractor Service database"
$COMPOSE exec -T postgres pg_dump -U postgres contractor_db > "$BACKUP_DIR/contractor_db.sql"

# Supplier Service
echo "→ Backing up Supplier Service database"
$COMPOSE exec -T postgres pg_dump -U postgres supplier_db > "$BACKUP_DIR/supplier_db.sql"

# Meter Reading Service
echo "→ Backing up Meter Reading Service database"
$COMPOSE exec -T postgres pg_dump -U postgres meter_reading_db > "$BACKUP_DIR/meter_reading_db.sql"

echo "✓ All databases backed up successfully to $BACKUP_DIR"
