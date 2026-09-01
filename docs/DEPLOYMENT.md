# Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Git
- Access to production server
- Environment variables configured

## Development Deployment

```bash
# Clone repository
git clone <repository-url>
cd eProperty

# Setup environment
cp .env.example .env
cp web/.env.example web/.env

# Start services
docker-compose up -d

# Run migrations
./scripts/migrate-all.sh

# Access application
# Frontend: http://localhost:5173
# API Gateway: http://localhost:8001
```

## Production Deployment

### Initial Setup

```bash
# 1. Clone on production server
git clone <repository-url>
cd eProperty

# 2. Configure environment
cp deploy/.env.production.example .env
# Edit .env with production values

# 3. Build images
./scripts/build-images.sh

# 4. Deploy
./scripts/deploy-production.sh
```

### Updating Production

```bash
# 1. Pull latest changes
git pull origin main

# 2. Rebuild and restart
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# 3. Run migrations
./scripts/migrate-all.sh

# 4. Health check
./scripts/health-check.sh
```

## Rollback

```bash
# 1. Find previous commit
git log --oneline -10

# 2. Checkout previous version
git checkout <commit-hash>

# 3. Rebuild and deploy
./scripts/deploy-production.sh
```

## Monitoring

### Check Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f identity-service

# Last 100 lines
docker-compose logs --tail=100
```

### Check Status
```bash
# Service status
docker-compose ps

# Resource usage
docker stats
```

## Backup & Restore

### Backup
```bash
./scripts/backup-databases.sh
```

### Restore
```bash
./scripts/restore-databases.sh backups/20240101_120000
```

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.
