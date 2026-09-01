# API Testing with cURL

## Authentication

### Login
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eproperty.local","password":"ChangeMe123!"}'
```

### Get Current User
```bash
curl http://localhost:8001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:8001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Properties

### Get All Properties
```bash
curl http://localhost:8002/api/v1/properties \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Property
```bash
curl -X POST http://localhost:8002/api/v1/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Property","address":"123 Main St","type":"apartment","status":"active"}'
```

## Tenants

### Get All Tenants
```bash
curl http://localhost:8003/api/v1/tenants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Tenant
```bash
curl -X POST http://localhost:8003/api/v1/tenants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890","property_id":1,"unit_number":"A101"}'
```

## Invoices

### Get All Invoices
```bash
curl http://localhost:8004/api/v1/invoices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Pay Invoice
```bash
curl -X POST http://localhost:8004/api/v1/invoices/1/pay \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Meter Readings

### Get All Meter Readings
```bash
curl http://localhost:8006/api/v1/readings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Meter Reading
```bash
curl -X POST http://localhost:8006/api/v1/readings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "house_id=1" \
  -F "reading_date=2024-01-01" \
  -F "previous_reading=100" \
  -F "current_reading=150" \
  -F "reader_name=John Doe" \
  -F "photo_before=@/path/to/before.jpg" \
  -F "photo_after=@/path/to/after.jpg"
```
