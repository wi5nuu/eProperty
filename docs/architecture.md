# eProperty ERP System - Architecture Overview

## System Architecture

### Microservices Architecture
```
┌─────────────┐
│   Nginx     │ (Reverse Proxy & Load Balancer)
└──────┬──────┘
       │
       ├──────────┬──────────┬──────────┬──────────┬──────────┐
       ↓          ↓          ↓          ↓          ↓          ↓
   Identity  Customer  Employee Contractor Supplier  Meter
   Service   Service   Service   Service   Service  Reading
   :8001     :8002     :8003     :8004     :8005    :8006
       │          │          │          │          │          │
       └──────────┴──────────┴──────────┴──────────┴──────────┘
                              ↓
                    ┌──────────────────┐
                    │   PostgreSQL     │ (Separate DB per service)
                    └──────────────────┘
                              ↓
                    ┌──────────────────┐
                    │      Redis       │ (Caching & Sessions)
                    └──────────────────┘
```

### Frontend Architecture
```
React 19 + TypeScript
├── Components (Reusable UI)
├── Pages (Route Components)
├── Services (API Clients)
├── Store (Zustand State Management)
├── Hooks (Custom React Hooks)
└── Utils (Helper Functions)
```

## Technology Stack

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Authentication**: JWT
- **Testing**: PHPUnit

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 8
- **Styling**: TailwindCSS 4
- **State**: Zustand 5
- **Routing**: React Router 7
- **HTTP Client**: Axios 1.7
- **Testing**: Vitest 2

### Infrastructure
- **Containers**: Docker + Docker Compose
- **Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Laravel Telescope

## Service Responsibilities

### Identity Service (Port 8001)
- User authentication
- Authorization & permissions
- Role management
- JWT token issuance

### Customer Service (Port 8002)
- Customer CRUD operations
- Customer relationships
- Customer history

### Employee Service (Port 8003)
- Employee management
- Attendance tracking
- Payroll data

### Contractor Service (Port 8004)
- Contractor management
- Contract tracking
- Payment records

### Supplier Service (Port 8005)
- Supplier management
- Purchase orders
- Supplier invoices

### Meter Reading Service (Port 8006)
- Meter readings CRUD
- Consumption calculation
- Photo evidence storage
- Reading history

### Realtime Gateway (Port 8080)
- WebSocket connections
- Real-time notifications
- Live updates

## Data Flow

### Authentication Flow
1. User submits credentials to Identity Service
2. Identity Service validates and issues JWT
3. Frontend stores JWT in localStorage
4. Subsequent requests include JWT in Authorization header
5. Each service validates JWT independently

### API Request Flow
1. Frontend makes request through Axios
2. Nginx routes to appropriate service
3. Service validates JWT
4. Service processes request
5. Response returned to frontend

## Security

- JWT-based authentication
- CORS configuration
- Rate limiting per endpoint
- Input validation with Zod
- SQL injection prevention (Eloquent ORM)
- XSS prevention (React escaping)
- CSRF tokens for forms

## Scalability

- Horizontal scaling per service
- Database per service (no shared database)
- Redis for distributed caching
- Stateless services
- Load balancing via Nginx

## Deployment

- Development: docker-compose.yml
- Production: docker-compose.production.yml
- Orchestration: Kubernetes ready
- CI/CD: GitHub Actions
