#!/bin/bash
set -e

echo "Running linters on all services..."

# Frontend
echo "→ Linting frontend"
cd web
npm run lint
cd ..

# Backend services
for service in services/*/; do
  if [ -f "$service/composer.json" ]; then
    echo "→ Linting $(basename $service)"
    cd "$service"
    if [ -f "./vendor/bin/phpstan" ]; then
      ./vendor/bin/phpstan analyse
    fi
    cd ../..
  fi
done

echo "✓ All linting completed!"
