#!/bin/bash
set -e

echo "Deploying to production..."

# Pull latest changes
echo "→ Pulling latest changes"
git pull origin main

# Build and start containers
echo "→ Building and starting containers"
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Run migrations
echo "→ Running migrations"
./scripts/migrate-all.sh

# Health check
echo "→ Running health check"
sleep 10
./scripts/health-check.sh

echo "✓ Deployment completed successfully!"
