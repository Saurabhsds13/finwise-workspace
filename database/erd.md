# FinWise - Entity Relationship Diagram (MySQL)

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK, UUID)       │
│ email (UNIQUE)      │
│ password            │
│ first_name          │
│ last_name           │
│ created_at          │
│ updated_at          │
└─────────┬───────────┘
          │
          │ 1:N
          ├──────────────────────────────────────────────────────────┐
          │                          │                               │
          ▼                          ▼                               ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│     expenses        │  │      budgets        │  │     savings_goals       │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────────┤
│ id (PK, UUID)       │  │ id (PK, UUID)       │  │ id (PK, UUID)           │
│ user_id (FK)        │  │ user_id (FK)        │  │ user_id (FK)            │
│ amount              │  │ name                │  │ name                    │
│ category            │  │ total_amount        │  │ target_amount           │
│ description         │  │ period              │  │ current_amount          │
│ expense_date        │  │ start_date          │  │ target_date             │
│ is_recurring        │  │ end_date            │  │ status                  │
│ recurring_frequency │  │ created_at          │  │ created_at              │
│ created_at          │  └─────────┬───────────┘  └────────────┬────────────┘
└─────────────────────┘            │                            │
                                   │ 1:N                        │ 1:N
                                   ▼                            ▼
                        ┌─────────────────────┐  ┌─────────────────────────┐
                        │  budget_categories  │  │   goal_contributions    │
                        ├─────────────────────┤  ├─────────────────────────┤
                        │ id (PK, UUID)       │  │ id (PK, UUID)           │
                        │ budget_id (FK)      │  │ goal_id (FK)            │
                        │ name                │  │ amount                  │
                        │ allocated_amount    │  │ note                    │
                        └─────────────────────┘  │ contributed_at          │
                                                 └─────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│    ai_insights      │  │   refresh_tokens    │
├─────────────────────┤  ├─────────────────────┤
│ id (PK, UUID)       │  │ id (PK, UUID)       │
│ user_id (FK)        │  │ user_id (FK)        │
│ type                │  │ token (UNIQUE)      │
│ title               │  │ expires_at          │
│ message             │  │ created_at          │
│ is_read             │  └─────────────────────┘
│ created_at          │
└─────────────────────┘

┌─────────────────────────┐
│  expense_categories     │
├─────────────────────────┤
│ id (PK, UUID)           │
│ name (UNIQUE)           │
│ icon                    │
│ color                   │
│ is_default              │
└─────────────────────────┘
```

## Relationships

| Parent | Child | Relationship | On Delete |
|--------|-------|-------------|-----------|
| users | expenses | 1:N | CASCADE |
| users | budgets | 1:N | CASCADE |
| users | savings_goals | 1:N | CASCADE |
| users | ai_insights | 1:N | CASCADE |
| users | refresh_tokens | 1:N | CASCADE |
| budgets | budget_categories | 1:N | CASCADE |
| savings_goals | goal_contributions | 1:N | CASCADE |
