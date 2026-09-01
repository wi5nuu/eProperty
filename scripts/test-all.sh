#!/bin/bash
set -e

echo "Running tests on all services..."

# Frontend tests
echo "→ Running frontend tests"
cd web
npm test -- --run
cd ..

# Backend tests
for service in services/*/; do
  if [ -f "$service/composer.json" ]; then
    echo "→ Running tests for $(basename $service)"
    cd "$service"
    php artisan test
    cd ../..
  fi
done

echo "✓ All tests passed!"
