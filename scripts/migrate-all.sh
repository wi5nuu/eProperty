#!/bin/bash
set -e

echo "Starting database migrations and seeding for services..."

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# Identity Service
echo "→ Identity Service"
$COMPOSE exec -T identity-service php artisan migrate --force
$COMPOSE exec -T identity-service php artisan db:seed --force

# Customer Service
echo "→ Customer Service"
$COMPOSE exec -T customer-service php artisan migrate --force

# Employee Service
echo "→ Employee Service"
$COMPOSE exec -T employee-service php artisan migrate --force

# Contractor Service
echo "→ Contractor Service"
$COMPOSE exec -T contractor-service php artisan migrate --force

# Supplier Service
echo "→ Supplier Service"
$COMPOSE exec -T supplier-service php artisan migrate --force

# Meter Reading Service
echo "→ Meter Reading Service"
$COMPOSE exec -T meter-reading-service php artisan migrate --force

echo "✓ All services migrated successfully!"
