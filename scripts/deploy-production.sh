#!/bin/bash
set -e

echo "Deploying to production..."

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# Pull latest changes
echo "→ Pulling latest changes"
git pull origin main

# Build and start containers
echo "→ Building and starting containers"
$COMPOSE -f docker-compose.production.yml build --no-cache
$COMPOSE -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "→ Waiting for services to be ready..."
sleep 15

# Run migrations
echo "→ Running migrations"
./scripts/migrate-all.sh

# Health check
echo "→ Running health check"
./scripts/health-check.sh

echo "✓ Deployment completed successfully!"
