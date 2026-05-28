# FinWise - Architecture Design Document

## 1. System Overview

FinWise is an AI-powered financial management platform built as a monorepo with three main layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│              React + TypeScript (Vite)                       │
│         State: Zustand | Data: React Query                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTPS)
                           │ JWT Bearer Token
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│              Spring Boot 3.2 (Java 17)                      │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │ Expense  │ │  Budget  │ │   Goals      │  │
│  │ Service  │ │ Service  │ │ Service  │ │   Service    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────────────────────────────────────┐ │
│  │Analytics │ │         AI Advisor Service                │ │
│  │ Service  │ │  (Spending Pattern Analysis + Insights)   │ │
│  └──────────┘ └──────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ JPA / Hibernate
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                  PostgreSQL 15+                              │
│                                                             │
│  users | expenses | budgets | savings_goals | ai_insights   │
└─────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing |
| Zustand | Global state management |
| React Query | Server state & caching |
| Recharts | Data visualization |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 17 | Language |
| Spring Boot 3.2 | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Data access |
| Hibernate | ORM |
| JJWT | JWT token handling |
| Lombok | Boilerplate reduction |
| MapStruct | DTO mapping |

### Database
| Technology | Purpose |
|-----------|---------|
| PostgreSQL 15 | Production database |
| H2 | Development/testing database |
| Flyway/manual migrations | Schema versioning |

## 3. Authentication Flow

```
┌────────┐          ┌─────────┐          ┌──────────┐
│ Client │          │ Backend │          │    DB    │
└───┬────┘          └────┬────┘          └────┬─────┘
    │  POST /auth/login  │                    │
    │───────────────────>│                    │
    │                    │  Find user by email│
    │                    │───────────────────>│
    │                    │    User record     │
    │                    │<───────────────────│
    │                    │                    │
    │                    │ Verify password    │
    │                    │ (BCrypt)           │
    │                    │                    │
    │  { token, user }   │                    │
    │<───────────────────│                    │
    │                    │                    │
    │  GET /api/expenses │                    │
    │  Authorization:    │                    │
    │  Bearer <token>    │                    │
    │───────────────────>│                    │
    │                    │ Validate JWT       │
    │                    │ Extract userId     │
    │                    │───────────────────>│
    │   Expense data     │                    │
    │<───────────────────│                    │
```

## 4. Key Design Decisions

### 4.1 Monorepo Structure
Single repository for frontend, backend, and database to simplify:
- Version control and code reviews
- Shared documentation
- Coordinated deployments

### 4.2 Stateless Authentication (JWT)
- Access tokens (24h expiry) for API requests
- Refresh tokens (7 days) stored in DB for rotation
- No server-side session storage needed

### 4.3 AI Advisor Architecture
The AI module analyzes spending patterns using:
- Category-based spending aggregation
- Month-over-month trend detection
- Budget utilization alerts
- Goal progress tracking
- Rule-based insights (expandable to ML models later)

### 4.4 API Design
- RESTful endpoints with consistent naming
- Request validation via Jakarta Bean Validation
- Standardized error responses
- Pagination for list endpoints

## 5. Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| Auth | Registration, login, JWT management, password reset |
| Expenses | CRUD operations, categorization, recurring expense tracking |
| Budgets | Budget creation, category allocation, spending tracking against budget |
| Goals | Savings goal management, contribution tracking, progress calculation |
| Analytics | Spending summaries, category breakdowns, trend analysis |
| AI Advisor | Pattern detection, personalized suggestions, achievement recognition |

## 6. Security Measures

- Password hashing with BCrypt (strength 10)
- JWT-based stateless authentication
- CORS restricted to frontend origin
- Input validation on all endpoints
- SQL injection prevention via parameterized queries (JPA)
- Rate limiting (to be added)
- HTTPS enforcement in production

## 7. Future Considerations

- **Notifications**: Email/push notifications for budget alerts
- **Multi-currency**: Support for multiple currencies with exchange rates
- **Bank Integration**: Plaid/Open Banking API for automatic transaction import
- **ML Models**: Upgrade AI advisor from rule-based to ML-based predictions
- **Mobile App**: React Native companion app
- **Export**: PDF/CSV report generation
