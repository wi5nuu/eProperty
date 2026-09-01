#!/bin/bash
set -e

echo "Starting database migrations and seeding for all services..."

# Identity Service
echo "→ Identity Service"
cd services/identity-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

# Customer Service
echo "→ Customer Service"
cd services/customer-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

# Employee Service
echo "→ Employee Service"
cd services/employee-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

# Contractor Service
echo "→ Contractor Service"
cd services/contractor-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

# Supplier Service
echo "→ Supplier Service"
cd services/supplier-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

# Meter Reading Service
echo "→ Meter Reading Service"
cd services/meter-reading-service
php artisan migrate --force
php artisan db:seed --force
cd ../..

echo "✓ All services migrated and seeded successfully!"
