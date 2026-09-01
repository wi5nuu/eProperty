#!/bin/bash
set -e

echo "Building production images..."

# Build frontend
echo "→ Building frontend"
cd web
docker build -f Dockerfile.prod -t eproperty-frontend:latest .
cd ..

# Build services
for service in identity customer employee contractor supplier meter-reading; do
  echo "→ Building $service-service"
  cd services/${service}-service
  docker build -t eproperty-${service}-service:latest .
  cd ../..
done

# Build realtime gateway
echo "→ Building realtime-gateway"
cd services/realtime-gateway
docker build -t eproperty-realtime-gateway:latest .
cd ../..

echo "✓ All images built successfully!"
