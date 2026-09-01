# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@eproperty.local with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and provide a timeline for fixes.

## Security Best Practices

### Authentication
- All passwords must be hashed using bcrypt
- JWT tokens expire after configured TTL
- Refresh tokens are rotated on use

### API Security
- All endpoints require authentication except login
- Rate limiting is applied to prevent abuse
- CORS is configured for allowed origins only

### Database
- All queries use parameterized statements
- Database credentials are stored in environment variables
- Regular backups are performed

### Infrastructure
- All services run in isolated containers
- Secrets are managed via environment variables
- Production uses HTTPS only
