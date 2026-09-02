#!/bin/bash
set -e

echo "Generating static documentation..."

# Generate API documentation for all services
echo "→ Generating API documentation"
for service in services/*/; do
  if [ -f "$service/composer.json" ]; then
    echo "  - $(basename $service)"
    cd "$service"
    if [ -f "./vendor/bin/artisan" ]; then
      php artisan route:list --json > ../../docs/api-$(basename $service).json
    fi
    cd ../..
  fi
done

# Generate TypeScript documentation
echo "→ Generating frontend documentation"
cd web
if command -v typedoc &> /dev/null; then
  npx typedoc --out ../docs/frontend src
fi
cd ..

echo "✓ Documentation generated in docs/"
