#!/bin/bash
set -e

echo "Cleaning up Docker containers, volumes, and images..."

# Determine docker compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# Stop all containers
echo "→ Stopping all containers"
$COMPOSE down

# Remove volumes
echo "→ Removing volumes"
$COMPOSE down -v

# Remove project-specific unused images
echo "→ Pruning project images"
$COMPOSE down --rmi local 2>/dev/null || true

# Remove node_modules
echo "→ Removing node_modules"
rm -rf web/node_modules

# Remove vendor directories
echo "→ Removing vendor directories"
find services -type d -name vendor -exec rm -rf {} + 2>/dev/null || true

echo "✓ Cleanup completed!"
