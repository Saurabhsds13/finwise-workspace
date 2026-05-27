# FinWise - AI-Powered Financial Management Platform

An intelligent financial management platform that helps users track expenses, plan budgets, set savings goals, and receive personalized AI-driven financial advice.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Zustand, React Query, Recharts |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Database | PostgreSQL 15 (prod), H2 (dev) |
| Auth | JWT (access + refresh tokens) |

## Project Structure

```
finwise-workspace/
├── frontend/                    # React TypeScript UI
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Header, Sidebar, shared widgets
│   │   │   ├── dashboard/       # Dashboard cards & charts
│   │   │   ├── expenses/        # Expense form & list
│   │   │   ├── budget/          # Budget form & category list
│   │   │   └── goals/           # Goal cards & forms
│   │   ├── pages/               # Route-level page components
│   │   │   ├── auth/            # Login, Register, ForgotPassword
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── expenses/        # Expense management
│   │   │   ├── budget/          # Budget planning
│   │   │   ├── goals/           # Savings goals
│   │   │   ├── analytics/       # Charts & reports
│   │   │   ├── ai-advisor/      # AI suggestions
│   │   │   └── settings/        # User settings
│   │   ├── layouts/             # Auth & Main layouts
│   │   ├── routes/              # Route definitions
│   │   ├── services/            # API service layer (Axios)
│   │   ├── store/               # Zustand state stores
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript interfaces
│   │   └── styles/              # Global CSS
│   └── package.json
│
├── backend/                     # Java Spring Boot API
│   ├── src/main/java/com/finwise/
│   │   ├── controller/          # REST API endpoints
│   │   ├── service/             # Business logic interfaces
│   │   ├── repository/          # Data access (Spring Data JPA)
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Request/Response DTOs
│   │   │   ├── auth/
│   │   │   ├── expense/
│   │   │   ├── budget/
│   │   │   ├── goal/
│   │   │   └── analytics/
│   │   ├── config/              # Security, CORS config
│   │   └── exception/           # Global error handling
│   ├── src/main/resources/
│   │   ├── application.yml      # Main config
│   │   └── application-dev.yml  # Dev profile (H2)
│   └── pom.xml
│
├── database/                    # Database design
│   ├── migrations/              # SQL migration scripts
│   │   └── V1__initial_schema.sql
│   └── erd.md                   # Entity relationship diagram
│
└── docs/                        # Documentation
    └── architecture.md          # System architecture design
```

## Key Features

1. **User Authentication** — JWT-based login/register with refresh tokens
2. **Expense Tracking** — Add, categorize, and track recurring expenses
3. **Budget Planning** — Create budgets with category allocations and period tracking
4. **Savings Goals** — Set targets, track contributions, monitor progress
5. **Spending Analysis** — Category breakdowns, trends, and monthly comparisons
6. **Dashboard & Analytics** — Visual charts and summary cards
7. **AI-Based Suggestions** — Pattern detection, budget alerts, personalized advice

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 15+ (or use H2 for dev)

### Frontend
```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

### Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# starts on http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/expenses | List user expenses |
| POST | /api/expenses | Create expense |
| GET | /api/budgets | List user budgets |
| POST | /api/budgets | Create budget |
| GET | /api/goals | List savings goals |
| POST | /api/goals | Create goal |
| POST | /api/goals/:id/contribute | Add contribution |
| GET | /api/analytics/spending | Spending overview |
| GET | /api/analytics/categories | Category breakdown |
| GET | /api/analytics/trends | Spending trends |
| GET | /api/analytics/ai-insights | AI-generated insights |
