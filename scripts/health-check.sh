#!/bin/bash
set -e

echo "Testing all microservices via gateway..."

# Track failures
FAILURES=0

check() {
    local name=$1
    local url=$2
    if curl -sf "$url" > /dev/null 2>&1; then
        echo "✓ $name"
    else
        echo "✗ $name ($url)"
        FAILURES=$((FAILURES + 1))
    fi
}

# Test Gateway
check "Gateway" "http://localhost:8081/health"

# Test Identity Service via gateway
check "Identity Service" "http://localhost:8081/api/v1/identity/health"

# Test Customer Service via gateway
check "Customer Service" "http://localhost:8081/api/v1/customers/health"

# Test Employee Service via gateway
check "Employee Service" "http://localhost:8081/api/v1/employees/health"

# Test Contractor Service via gateway
check "Contractor Service" "http://localhost:8081/api/v1/contractors/health"

# Test Supplier Service via gateway
check "Supplier Service" "http://localhost:8081/api/v1/suppliers/health"

# Test Meter Reading Service via gateway
check "Meter Reading Service" "http://localhost:8081/api/v1/meter/health"

# Test Realtime Gateway
check "Realtime Gateway" "http://localhost:8081/realtime/health"

if [ $FAILURES -gt 0 ]; then
    echo "Health check completed with $FAILURES failure(s)"
    exit 1
else
    echo "All services healthy!"
fi
