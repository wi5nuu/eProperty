#!/bin/bash
set -e

echo "Testing all microservices via gateway..."

# Test Gateway
echo "→ Testing Gateway"
curl -f http://localhost:8081/health || echo "Gateway failed"

# Test Identity Service via gateway
echo "→ Testing Identity Service"
curl -f http://localhost:8081/api/v1/identity/health || echo "Identity service failed"

# Test Customer Service via gateway
echo "→ Testing Customer Service"
curl -f http://localhost:8081/api/v1/customers/health || echo "Customer service failed"

# Test Employee Service via gateway
echo "→ Testing Employee Service"
curl -f http://localhost:8081/api/v1/employees/health || echo "Employee service failed"

# Test Contractor Service via gateway
echo "→ Testing Contractor Service"
curl -f http://localhost:8081/api/v1/contractors/health || echo "Contractor service failed"

# Test Supplier Service via gateway
echo "→ Testing Supplier Service"
curl -f http://localhost:8081/api/v1/suppliers/health || echo "Supplier service failed"

# Test Meter Reading Service via gateway
echo "→ Testing Meter Reading Service"
curl -f http://localhost:8081/api/v1/meter/health || echo "Meter reading service failed"

# Test Realtime Gateway
echo "→ Testing Realtime Gateway"
curl -f http://localhost:8081/ws/health || echo "Realtime gateway failed"

# Test Frontend
echo "→ Testing Frontend"
curl -f http://localhost:5173 || echo "Frontend failed"

echo "✓ Health check completed!"
