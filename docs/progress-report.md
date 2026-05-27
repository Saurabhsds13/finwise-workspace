# FinWise — Project Progress Report

**Prepared for:** Client Review  
**Date:** May 27, 2026  
**Sprint:** 1 (Foundation & Core Features)

---

## Project Overview

FinWise is an AI-powered financial management platform that enables users to track expenses, plan budgets, set savings goals, and receive personalized financial advice. The platform is built as a modern full-stack application with a React frontend and Java Spring Boot backend.

---

## Completed Work

### 1. Project Foundation
- Monorepo structure established (frontend, backend, database, docs)
- Development environment configured for immediate local startup
- CI-ready project configuration with Maven and Vite
- Git workflow with batch-wise commits

### 2. User Authentication (Full Stack)
- Secure registration and login with BCrypt password hashing
- JWT-based stateless authentication (access + refresh tokens)
- Protected route guards on frontend
- Auto-session restoration on page refresh
- Logout with token invalidation
- Styled login/register/forgot-password pages

### 3. Expense Tracking (Full Stack)
- Create, read, update, delete expenses
- 10 pre-defined expense categories with icons and colors
- Filter by category and month
- Recurring expense support (daily/weekly/monthly/yearly)
- Responsive table view with formatted currency
- Real-time UI updates without page reload

### 4. Budget Planning (Full Stack)
- Create budgets with weekly/monthly/yearly periods
- Dynamic category allocation within budgets
- Auto-calculated end dates based on period
- Real-time spending calculation from actual expenses
- Visual progress bars with color-coded thresholds (green/yellow/red)
- Per-category spending breakdown within each budget

### 5. Savings Goals (Full Stack)
- Create goals with target amount and optional deadline
- Add contributions via modal dialog
- Automatic goal completion when target is reached
- Progress percentage calculation
- Days remaining countdown
- Separate views for active and completed goals
- Business rule enforcement (cannot modify completed goals)

### 6. Enterprise Architecture
- SOLID principles applied throughout the codebase
- Consistent error response format with trace IDs
- Centralized exception handling (15+ exception types covered)
- Machine-readable error codes for frontend handling
- Structured logging at appropriate levels
- Mapper pattern for clean layer separation
- Production-ready configuration with environment variables

---

## Technical Highlights

### Security
| Feature | Implementation |
|---------|---------------|
| Password Storage | BCrypt (strength 12) |
| Authentication | JWT with HS256 signing |
| Token Lifecycle | 24h access / 7-day refresh |
| API Protection | All endpoints require valid JWT |
| Input Validation | Server-side validation on every request |
| Error Masking | No internal details exposed to clients |

### Code Quality
| Metric | Status |
|--------|--------|
| Type Safety | Full TypeScript (frontend) + Java generics |
| Design Patterns | Repository, Service Layer, DTO, Mapper, Builder, Template Method |
| SOLID Compliance | All 5 principles applied |
| Error Handling | Enterprise-grade with correlation IDs |
| Logging | Structured with SLF4J + trace IDs |

### Database
- 9 tables with proper relationships and constraints
- UUID primary keys (no sequential ID exposure)
- Indexed columns for query performance
- Check constraints on monetary values
- Cascade deletes for data integrity

---

## Remaining Work

| Feature | Priority | Estimated Effort |
|---------|----------|-----------------|
| Dashboard with summary cards | High | 1 sprint |
| Analytics charts (trends, categories) | High | 1 sprint |
| AI Advisor (spending insights) | Medium | 1 sprint |
| Notifications system | Low | 1 sprint |
| PDF/CSV report export | Low | 0.5 sprint |

---

## How to Run Locally

```bash
# Backend (starts on http://localhost:8080)
cd backend
mvn spring-boot:run

# Frontend (starts on http://localhost:5173)
cd frontend
npm install
npm run dev
```

No external database required for development — uses H2 in-memory database.

---

## Demo Walkthrough

1. **Register** — Create account at `/register`
2. **Add Expenses** — Navigate to Expenses, add transactions with categories
3. **Create Budget** — Set a monthly budget with category allocations
4. **Set Goals** — Create savings goals, add contributions
5. **Track Progress** — View budget utilization and goal progress bars

---

## Next Steps

1. Complete Dashboard & Analytics module
2. Implement AI Advisor with rule-based spending analysis
3. Deploy to staging environment for client UAT
4. Gather feedback and iterate
