#!/bin/bash
set -e

echo "Setting up development environment..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting."; exit 1; }
docker compose version >/dev/null 2>&1 || docker-compose version >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting."; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "Composer is required but not installed. Aborting."; exit 1; }

echo "✓ All prerequisites found"

# Copy environment files
echo "→ Setting up environment files"
[ ! -f .env ] && cp .env.example .env && echo "Created .env"
[ ! -f web/.env ] && cp web/.env.example web/.env && echo "Created web/.env"

# Install backend dependencies
echo "→ Installing backend dependencies"
for service in services/*/; do
  echo "  - $(basename $service)"
  cd "$service"
  composer install --no-interaction --prefer-dist --optimize-autoloader
  cd ../..
done

# Install frontend dependencies
echo "→ Installing frontend dependencies"
cd web
npm install
cd ..

# Start Docker containers
echo "→ Starting Docker containers"
if docker compose version >/dev/null 2>&1; then
  docker compose up -d
else
  docker-compose up -d
fi

# Wait for databases to be ready
echo "→ Waiting for databases to be ready..."
sleep 15

# Run migrations and seeders
echo "→ Running migrations and seeders"
./scripts/migrate-all.sh

echo "✓ Development environment ready!"
echo ""
echo "Frontend: http://localhost:5173"
echo "Identity Service: http://localhost:8001"
echo "Default credentials: admin@eproperty.local / ChangeMe123!"
