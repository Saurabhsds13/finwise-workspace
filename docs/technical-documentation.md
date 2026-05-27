# FinWise — Technical Documentation

**Version:** 0.1.0  
**Last Updated:** May 2026  
**Status:** In Development

---

## 1. Executive Summary

FinWise is an AI-powered financial management platform designed to help users take control of their finances through intelligent expense tracking, budget planning, savings goal management, and personalized AI-driven insights.

### Key Deliverables

| Module | Status | Description |
|--------|--------|-------------|
| User Authentication | ✅ Complete | JWT-based auth with refresh tokens |
| Expense Tracking | ✅ Complete | Full CRUD with categorization and filtering |
| Budget Planning | ✅ Complete | Period-based budgets with category allocations |
| Savings Goals | ✅ Complete | Goal management with contribution tracking |
| Dashboard & Analytics | ✅ Complete | Visual summaries, trends, category breakdowns |
| AI Advisor | ✅ Complete | Rule-based spending pattern analysis and insights |

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | Component-based UI framework |
| TypeScript | 5.3 | Type safety and developer experience |
| Vite | 5.0 | Build tool with HMR |
| React Router | 6.20 | Client-side routing |
| Zustand | 4.4 | Lightweight state management |
| React Query | 5.0 | Server state caching and synchronization |
| Recharts | 2.10 | Data visualization |
| Axios | 1.6 | HTTP client with interceptors |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 (LTS) | Language runtime |
| Spring Boot | 3.2 | Application framework |
| Spring Security | 6.2 | Authentication and authorization |
| Spring Data JPA | 3.2 | Data access abstraction |
| Hibernate | 6.4 | ORM and query generation |
| JJWT | 0.12.3 | JWT token creation and validation |
| Lombok | Latest | Boilerplate reduction |
| PostgreSQL Driver | Latest | Production database connectivity |
| H2 | Latest | In-memory development database |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| Database | PostgreSQL 15+ (all environments) |
| Build Tool | Maven 3.8+ |
| Package Manager | npm |
| Version Control | Git |

---

## 3. Architecture

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│   React 18 + TypeScript + Vite                                  │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│   │  Pages   │ │Components│ │  Hooks   │ │  Services (API)  │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│   State: Zustand                    Data Fetching: React Query   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST API
                           │ Authorization: Bearer JWT
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│                                                                  │
│   Spring Boot 3.2 + Spring Security                             │
│   ┌────────────────────────────────────────────────────────┐    │
│   │                  Security Filter Chain                   │    │
│   │  CORS → JWT Filter → Authentication → Authorization     │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                  │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│   │Controller│→│ Service  │→│  Mapper  │→│   Repository     │  │
│   │  (REST)  │ │(Business)│ │(DTO↔Ent) │ │  (Data Access)   │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐    │
│   │            Global Exception Handler                     │    │
│   │  Consistent ErrorResponse + TraceId + Logging           │    │
│   └────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ JPA / Hibernate / HikariCP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│   PostgreSQL 15 (all environments)                              │
│                                                                  │
│   Tables: users, expenses, budgets, budget_categories,          │
│           savings_goals, goal_contributions, ai_insights,       │
│           refresh_tokens, expense_categories                    │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Package Structure (Backend)

```
com.finwise
├── FinWiseApplication.java          # Entry point
├── config/                          # Configuration classes
│   └── SecurityConfig.java          # Security filter chain, CORS, BCrypt
├── controller/                      # REST API endpoints (HTTP layer)
│   ├── AuthController.java
│   ├── ExpenseController.java
│   ├── BudgetController.java
│   ├── GoalController.java
│   └── AnalyticsController.java
├── service/                         # Business logic interfaces
│   ├── AuthService.java
│   ├── ExpenseService.java
│   ├── BudgetService.java
│   ├── GoalService.java
│   ├── AnalyticsService.java
│   ├── AiAdvisorService.java
│   └── impl/                        # Implementations
│       ├── AuthServiceImpl.java
│       ├── ExpenseServiceImpl.java
│       ├── BudgetServiceImpl.java
│       └── GoalServiceImpl.java
├── repository/                      # Spring Data JPA repositories
├── entity/                          # JPA entities (database models)
├── dto/                             # Data Transfer Objects
│   ├── auth/
│   ├── expense/
│   ├── budget/
│   ├── goal/
│   └── analytics/
├── mapper/                          # Entity ↔ DTO converters
├── security/                        # JWT, filters, user details
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtAuthenticationEntryPoint.java
│   ├── CustomUserDetails.java
│   ├── CustomUserDetailsService.java
│   └── SecurityUtils.java
└── exception/                       # Exception hierarchy
    ├── BaseException.java           # Abstract base
    ├── ResourceNotFoundException.java
    ├── AuthException.java
    ├── BusinessException.java
    ├── AccessDeniedException.java
    ├── ErrorCodes.java              # Centralized error codes
    ├── ErrorResponse.java           # Standardized response
    └── GlobalExceptionHandler.java  # Centralized handler
```

---

## 4. Design Principles & Patterns

### 4.1 SOLID Principles

| Principle | Implementation |
|-----------|---------------|
| **Single Responsibility** | Each class has one reason to change. Controllers handle HTTP, Services handle business logic, Mappers handle transformation, Repositories handle data access. |
| **Open/Closed** | New exception types extend `BaseException` without modifying `GlobalExceptionHandler`. New features add new service interfaces. |
| **Liskov Substitution** | All service implementations faithfully fulfill their interface contracts. |
| **Interface Segregation** | Focused interfaces per domain (ExpenseService, BudgetService) — no monolithic service. |
| **Dependency Inversion** | Services depend on repository interfaces and mapper abstractions, not concrete implementations. |

### 4.2 Design Patterns Used

| Pattern | Where | Purpose |
|---------|-------|---------|
| **Repository** | Data layer | Abstracts database operations behind interfaces |
| **Service Layer** | Business logic | Encapsulates business rules separate from HTTP |
| **DTO (Data Transfer Object)** | API boundary | Decouples internal entities from API contracts |
| **Mapper** | Between layers | Converts entities to DTOs and vice versa |
| **Builder** | DTOs, Entities | Clean object construction (via Lombok) |
| **Template Method** | Exception hierarchy | Base class defines structure, subclasses define specifics |
| **Filter Chain** | Security | JWT validation as a servlet filter |
| **Strategy (ready)** | Services | Interface-based design allows swapping implementations |
| **Observer (ready)** | Events | Spring events for cross-cutting concerns |

---

## 5. Security Architecture

### 5.1 Authentication Flow

```
1. User submits credentials (POST /api/auth/login)
2. Server validates email + BCrypt password hash
3. Server generates:
   - Access Token (JWT, 24h expiry, contains userId + email)
   - Refresh Token (JWT, 7 days, stored in DB)
4. Client stores tokens in localStorage
5. Every API request includes: Authorization: Bearer <accessToken>
6. JwtAuthenticationFilter validates token on each request
7. SecurityContext populated with user details
8. Controllers extract userId via SecurityUtils
```

### 5.2 Security Measures

| Measure | Implementation |
|---------|---------------|
| Password Hashing | BCrypt with strength 12 |
| Token Security | HS256 signed JWTs with 32+ byte secret |
| Session Management | Stateless (no server-side sessions) |
| CORS | Restricted to frontend origin only |
| Input Validation | Jakarta Bean Validation on all request DTOs |
| SQL Injection | Prevented via JPA parameterized queries |
| Error Masking | Internal errors never expose stack traces |
| Token Rotation | Old refresh tokens deleted on new login |

---

## 6. API Reference

### 6.1 Error Response Format

Every error follows this consistent structure:

```json
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Expense not found with id: abc-123",
  "traceId": "a1b2c3d4e5f6g7h8",
  "path": "/api/expenses/abc-123",
  "timestamp": "2026-05-27T10:30:00",
  "errors": null
}
```

Validation errors include field details:

```json
{
  "status": 400,
  "errorCode": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "traceId": "x9y8z7w6v5u4t3s2",
  "path": "/api/expenses",
  "timestamp": "2026-05-27T10:30:00",
  "errors": [
    { "field": "amount", "message": "must be positive", "rejectedValue": -5 },
    { "field": "category", "message": "must not be blank", "rejectedValue": "" }
  ]
}
```

### 6.2 Endpoints

#### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/login` | No | Authenticate user |
| POST | `/api/auth/logout` | Yes | Invalidate tokens |

#### Expenses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | Yes | List all user expenses |
| GET | `/api/expenses/{id}` | Yes | Get expense by ID |
| POST | `/api/expenses` | Yes | Create new expense |
| PUT | `/api/expenses/{id}` | Yes | Update expense |
| DELETE | `/api/expenses/{id}` | Yes | Delete expense |
| GET | `/api/expenses/category/{name}` | Yes | Filter by category |
| GET | `/api/expenses/monthly/{year}/{month}` | Yes | Filter by month |

#### Budgets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/budgets` | Yes | List all user budgets |
| GET | `/api/budgets/{id}` | Yes | Get budget with spending |
| POST | `/api/budgets` | Yes | Create budget |
| PUT | `/api/budgets/{id}` | Yes | Update budget |
| DELETE | `/api/budgets/{id}` | Yes | Delete budget |
| GET | `/api/budgets/active` | Yes | Get currently active budgets |

#### Savings Goals
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/goals` | Yes | List all user goals |
| GET | `/api/goals/{id}` | Yes | Get goal by ID |
| POST | `/api/goals` | Yes | Create goal |
| PUT | `/api/goals/{id}` | Yes | Update goal |
| DELETE | `/api/goals/{id}` | Yes | Delete goal |
| POST | `/api/goals/{id}/contribute` | Yes | Add contribution |

#### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/spending?period=` | Yes | Spending overview |
| GET | `/api/analytics/categories?period=` | Yes | Category breakdown |
| GET | `/api/analytics/trends?months=` | Yes | Monthly trends |
| GET | `/api/analytics/ai-insights` | Yes | AI-generated insights |

---

## 7. Database Schema

### 7.1 Entity Relationship Summary

| Table | Records | Relationships |
|-------|---------|---------------|
| `users` | User accounts | Parent of all user-owned data |
| `expenses` | Individual transactions | Belongs to user, categorized |
| `budgets` | Spending plans | Belongs to user, has categories |
| `budget_categories` | Budget allocations | Belongs to budget |
| `savings_goals` | Financial targets | Belongs to user, has contributions |
| `goal_contributions` | Savings deposits | Belongs to goal |
| `ai_insights` | AI recommendations | Belongs to user |
| `refresh_tokens` | Auth tokens | Belongs to user |
| `expense_categories` | Reference data | Standalone lookup table |

### 7.2 Key Constraints

- All monetary fields use `DECIMAL(12, 2)` for precision
- UUIDs as primary keys (no sequential IDs exposed)
- Cascade deletes from parent to child entities
- Check constraints on amounts (must be positive)
- Unique constraint on user email
- Indexed columns for query performance

---

## 8. Development Setup

### Prerequisites
- Java 17+ (JDK)
- Maven 3.8+
- Node.js 18+
- PostgreSQL 15+
- Git

### Database Setup
```bash
# Create databases
createdb finwise
createdb finwise_test

# Run migration
psql -d finwise -f database/migrations/V1__initial_schema.sql
psql -d finwise_test -f database/migrations/V1__initial_schema.sql
```

### Backend (runs on port 8080)
```bash
cd backend
mvn spring-boot:run
# Defaults to 'dev' profile
# Connects to PostgreSQL localhost:5432/finwise
# Dev profile uses ddl-auto=update (auto-creates/updates tables)
```

### Frontend (runs on port 5173)
```bash
cd frontend
npm install
npm run dev
```

### Environment Profiles

| Profile | DB | DDL Auto | Logging | Use Case |
|---------|-----|----------|---------|----------|
| `dev` | finwise | update | DEBUG | Local development |
| `test` | finwise_test | create-drop | INFO | Running tests |
| `prod` | finwise | validate | INFO | Production deployment |

### Running with a specific profile
```bash
# Dev (default)
mvn spring-boot:run

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Tests
mvn test
```

---

## 9. Quality Attributes

| Attribute | Approach |
|-----------|----------|
| **Maintainability** | Clean architecture, SOLID principles, consistent patterns |
| **Testability** | Interface-based design, dependency injection, isolated layers |
| **Scalability** | Stateless auth, connection pooling, indexed queries |
| **Security** | BCrypt, JWT, input validation, error masking |
| **Observability** | Structured logging with trace IDs, consistent error responses |
| **Performance** | Read-only transactions, batch operations, lazy loading |

---

## 10. Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| Phase 1 ✅ | Auth, Expenses, Budgets, Goals | Complete |
| Phase 2 ✅ | Dashboard, Analytics, AI Advisor | Complete |
| Phase 3 | Notifications, Reports (PDF/CSV) | Planned |
| Phase 4 | Bank Integration (Plaid/Open Banking) | Future |
| Phase 5 | Mobile App (React Native) | Future |
