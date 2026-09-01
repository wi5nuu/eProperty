#!/bin/bash
set -e

echo "Cleaning up Docker containers, volumes, and images..."

# Stop all containers
echo "→ Stopping all containers"
docker-compose down

# Remove volumes
echo "→ Removing volumes"
docker-compose down -v

# Remove all unused containers, networks, images
echo "→ Pruning Docker system"
docker system prune -af

# Remove node_modules
echo "→ Removing node_modules"
rm -rf web/node_modules

# Remove vendor directories
echo "→ Removing vendor directories"
find services -type d -name vendor -exec rm -rf {} +

echo "✓ Cleanup completed!"
