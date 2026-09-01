#!/bin/bash
set -e

echo "Backing up all service databases..."

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "→ Creating backup directory: $BACKUP_DIR"

# Identity Service
echo "→ Backing up Identity Service database"
docker exec eproperty-identity-db-1 pg_dump -U postgres identity_db > "$BACKUP_DIR/identity_db.sql"

# Customer Service
echo "→ Backing up Customer Service database"
docker exec eproperty-customer-db-1 pg_dump -U postgres customer_db > "$BACKUP_DIR/customer_db.sql"

# Employee Service
echo "→ Backing up Employee Service database"
docker exec eproperty-employee-db-1 pg_dump -U postgres employee_db > "$BACKUP_DIR/employee_db.sql"

# Contractor Service
echo "→ Backing up Contractor Service database"
docker exec eproperty-contractor-db-1 pg_dump -U postgres contractor_db > "$BACKUP_DIR/contractor_db.sql"

# Supplier Service
echo "→ Backing up Supplier Service database"
docker exec eproperty-supplier-db-1 pg_dump -U postgres supplier_db > "$BACKUP_DIR/supplier_db.sql"

# Meter Reading Service
echo "→ Backing up Meter Reading Service database"
docker exec eproperty-meter-db-1 pg_dump -U postgres meter_db > "$BACKUP_DIR/meter_db.sql"

echo "✓ All databases backed up successfully to $BACKUP_DIR"
