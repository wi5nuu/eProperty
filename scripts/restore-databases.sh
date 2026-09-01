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

# Identity Service
echo "→ Restoring Identity Service database"
docker exec -i eproperty-identity-db-1 psql -U postgres identity_db < "$BACKUP_DIR/identity_db.sql"

# Customer Service
echo "→ Restoring Customer Service database"
docker exec -i eproperty-customer-db-1 psql -U postgres customer_db < "$BACKUP_DIR/customer_db.sql"

# Employee Service
echo "→ Restoring Employee Service database"
docker exec -i eproperty-employee-db-1 psql -U postgres employee_db < "$BACKUP_DIR/employee_db.sql"

# Contractor Service
echo "→ Restoring Contractor Service database"
docker exec -i eproperty-contractor-db-1 psql -U postgres contractor_db < "$BACKUP_DIR/contractor_db.sql"

# Supplier Service
echo "→ Restoring Supplier Service database"
docker exec -i eproperty-supplier-db-1 psql -U postgres supplier_db < "$BACKUP_DIR/supplier_db.sql"

# Meter Reading Service
echo "→ Restoring Meter Reading Service database"
docker exec -i eproperty-meter-db-1 psql -U postgres meter_db < "$BACKUP_DIR/meter_db.sql"

echo "✓ All databases restored successfully from $BACKUP_DIR"
