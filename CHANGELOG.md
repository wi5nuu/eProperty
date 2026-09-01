# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Comprehensive TypeScript type definitions for all entities
- API services for properties, tenants, invoices, and meter readings
- Authentication service with login/logout functionality
- Custom React hooks (useDebounce, useLocalStorage, useMediaQuery)
- Reusable UI components (Button, Modal, Alert, Badge, Card, Input, etc.)
- ErrorBoundary component for React error handling
- JWT parser utility with token validation
- Zod validation schemas for all forms
- Custom error classes and error handler
- Formatting utilities for currency and dates
- Helper utilities (debounce, throttle, retry)
- Logger utility for development and production
- Theme store with localStorage persistence
- Comprehensive testing infrastructure with Vitest
- Unit tests for utilities and validation schemas
- Feature tests for authentication
- Database migration scripts for all services
- Backup and restore scripts for databases
- Health check script for all services
- Development environment setup script
- Production deployment script
- Nginx configurations for reverse proxy and frontend
- Production Docker Compose configuration
- Multi-stage Dockerfile for frontend
- CORS middleware for identity service
- Logout endpoint with domain event logging
- Comprehensive permissions in database seeder
- API testing guide with cURL examples
- Development guide with quick start instructions
- Security policy and best practices
- Contributing guidelines and code style guide

### Fixed
- Axios version from 1.20.0 to 1.7.9
- TypeScript version from 6.0.2 to 5.7.2
- User data fetching from /me endpoint instead of hardcoding
- Validation for current_reading >= previous_reading in meter reading update

### Changed
- Updated gitignore with comprehensive exclusions
- Improved Login component to fetch real user data from API
- Enhanced API interceptors with request/response logging

## [1.0.0] - 2024-01-15

### Added
- Initial release of eProperty ERP System
- Microservices architecture with 7 services
- React 19 frontend with TypeScript
- PostgreSQL databases for each service
- Redis for caching and sessions
- Docker Compose setup for development
- JWT-based authentication
- Real-time gateway with WebSocket support
