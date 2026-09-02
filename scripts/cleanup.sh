#!/bin/bash
set -e

echo "Cleaning up Docker containers, volumes, and images..."

# Confirmation prompt
read -p "⚠ This will remove containers, volumes, node_modules, and vendor dirs. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

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

echo "✓ Cleanup completed!"
