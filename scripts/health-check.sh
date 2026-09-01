#!/bin/bash
set -e

echo "Testing all microservices..."

# Test Identity Service
echo "→ Testing Identity Service"
curl -f http://localhost:8001/api/v1/health || echo "Identity service failed"

# Test Customer Service
echo "→ Testing Customer Service"
curl -f http://localhost:8002/api/v1/health || echo "Customer service failed"

# Test Employee Service
echo "→ Testing Employee Service"
curl -f http://localhost:8003/api/v1/health || echo "Employee service failed"

# Test Contractor Service
echo "→ Testing Contractor Service"
curl -f http://localhost:8004/api/v1/health || echo "Contractor service failed"

# Test Supplier Service
echo "→ Testing Supplier Service"
curl -f http://localhost:8005/api/v1/health || echo "Supplier service failed"

# Test Meter Reading Service
echo "→ Testing Meter Reading Service"
curl -f http://localhost:8006/api/v1/health || echo "Meter reading service failed"

# Test Realtime Gateway
echo "→ Testing Realtime Gateway"
curl -f http://localhost:8080/health || echo "Realtime gateway failed"

# Test Frontend
echo "→ Testing Frontend"
curl -f http://localhost:5173 || echo "Frontend failed"

echo "✓ Health check completed!"
