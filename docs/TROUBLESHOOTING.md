# Troubleshooting Guide

## Common Issues

### Frontend Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### API Connection Issues
- Check if backend services are running
- Verify API_URL in .env file
- Check CORS configuration
- Verify JWT token is valid

#### Hot Reload Not Working
- Restart Vite dev server
- Clear browser cache
- Check for TypeScript errors

### Backend Issues

#### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DB_HOST $DB_PORT $DB_DATABASE
```

#### Migration Errors
```bash
# Reset database
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

#### Permission Denied
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Docker Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs service-name

# Rebuild container
docker-compose build --no-cache service-name
docker-compose up -d
```

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8001

# Kill process or change port in docker-compose.yml
```

### Performance Issues

#### Slow API Response
- Check database indexes
- Enable query caching
- Use eager loading
- Optimize N+1 queries

#### High Memory Usage
- Check for memory leaks
- Increase PHP memory_limit
- Optimize database queries
- Use pagination

## Debugging

### Enable Debug Mode
```bash
# Backend
APP_DEBUG=true

# Frontend
VITE_DEBUG=true
```

### Check Logs
```bash
# Backend logs
tail -f storage/logs/laravel.log

# Docker logs
docker-compose logs -f service-name

# Nginx logs
docker-compose logs nginx
```

## Getting Help

1. Check documentation in `docs/` directory
2. Review error logs
3. Search GitHub issues
4. Contact development team
