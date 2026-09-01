# eProperty ERP System - Development Guide

## Prerequisites

- Docker & Docker Compose
- PHP 8.2+
- Node.js 20+
- Composer
- npm/yarn

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd eProperty

# Copy environment files
cp .env.example .env
cp web/.env.example web/.env

# Start all services
docker-compose up -d

# Install frontend dependencies
cd web
npm install
npm run dev

# Run migrations and seeders
./scripts/migrate-all.sh
```

## Architecture

### Microservices

1. **Identity Service** (Port 8001) - Authentication & Authorization
2. **Customer Service** (Port 8002) - Customer Management
3. **Employee Service** (Port 8003) - Employee Management
4. **Contractor Service** (Port 8004) - Contractor Management
5. **Supplier Service** (Port 8005) - Supplier Management
6. **Meter Reading Service** (Port 8006) - Meter Reading Management
7. **Realtime Gateway** (Port 8080) - WebSocket Gateway

### Frontend

- React 19 + TypeScript
- Vite build tool
- TailwindCSS 4
- Zustand state management
- React Router 7

## Development

### Running Tests

```bash
# Frontend tests
cd web
npm test

# Backend tests (per service)
cd services/identity-service
php artisan test
```

### Database Management

```bash
# Backup all databases
./scripts/backup-databases.sh

# Restore from backup
./scripts/restore-databases.sh backups/20240101_120000

# Fresh migration
./scripts/migrate-all.sh
```

### Health Check

```bash
./scripts/health-check.sh
```

## Default Credentials

- Email: `admin@eproperty.local`
- Password: `ChangeMe123!`

## Tech Stack

### Backend
- Laravel 11
- PostgreSQL 16
- Redis
- JWT Authentication

### Frontend
- React 19
- TypeScript 5.7
- Vite 8
- TailwindCSS 4
- Axios
- Zustand

## API Documentation

Each service exposes OpenAPI documentation at `/api/documentation`

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## License

Proprietary
