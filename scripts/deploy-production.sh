#!/bin/bash
set -e

echo "Deploying to production..."

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# Pre-deploy backup
echo "→ Creating pre-deploy backup"
./scripts/backup-databases.sh 2>/dev/null || echo "Warning: Backup skipped or failed"

# Pull latest changes
echo "→ Pulling latest changes"
git pull origin main

# Build and start containers
echo "→ Building and starting containers"
$COMPOSE -f docker-compose.production.yml build --no-cache
$COMPOSE -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "→ Waiting for services to be ready..."
MAX_WAIT=60
WAITED=0
until curl -sf http://localhost:8081/health > /dev/null 2>&1; do
    if [ $WAITED -ge $MAX_WAIT ]; then
        echo "✗ Services did not become ready within ${MAX_WAIT}s"
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
    echo "  Waiting... (${WAITED}s)"
done
echo "✓ Services are ready"

# Run migrations
echo "→ Running migrations"
./scripts/migrate-all.sh

# Health check
echo "→ Running health check"
./scripts/health-check.sh

echo "✓ Deployment completed successfully!"
