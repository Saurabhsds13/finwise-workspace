-- FinWise Database Schema (MySQL)
-- V1: Initial schema creation

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- EXPENSE CATEGORIES (reference table)
-- =============================================
CREATE TABLE expense_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_default BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default categories
INSERT INTO expense_categories (id, name, icon, color, is_default) VALUES
    (UUID(), 'Food & Dining', 'utensils', '#FF6384', TRUE),
    (UUID(), 'Transportation', 'car', '#36A2EB', TRUE),
    (UUID(), 'Housing', 'home', '#FFCE56', TRUE),
    (UUID(), 'Utilities', 'zap', '#4BC0C0', TRUE),
    (UUID(), 'Healthcare', 'heart', '#9966FF', TRUE),
    (UUID(), 'Entertainment', 'film', '#FF9F40', TRUE),
    (UUID(), 'Shopping', 'shopping-bag', '#FF6384', TRUE),
    (UUID(), 'Education', 'book', '#C9CBCF', TRUE),
    (UUID(), 'Personal Care', 'user', '#7C4DFF', TRUE),
    (UUID(), 'Other', 'more-horizontal', '#607D8B', TRUE);

-- =============================================
-- EXPENSES TABLE
-- =============================================
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_expense_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(user_id, expense_date);
CREATE INDEX idx_expenses_category ON expenses(user_id, category);

-- =============================================
-- BUDGETS TABLE
-- =============================================
CREATE TABLE budgets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_budget_amount CHECK (total_amount > 0),
    CONSTRAINT chk_budget_dates CHECK (end_date > start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(user_id, start_date, end_date);

-- =============================================
-- BUDGET CATEGORIES TABLE
-- =============================================
CREATE TABLE budget_categories (
    id VARCHAR(36) PRIMARY KEY,
    budget_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    allocated_amount DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_budget_categories_budget FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    CONSTRAINT chk_budget_cat_amount CHECK (allocated_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_budget_categories_budget ON budget_categories(budget_id);

-- =============================================
-- SAVINGS GOALS TABLE
-- =============================================
CREATE TABLE savings_goals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_goal_target CHECK (target_amount > 0),
    CONSTRAINT chk_goal_current CHECK (current_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_goals_status ON savings_goals(user_id, status);

-- =============================================
-- GOAL CONTRIBUTIONS TABLE
-- =============================================
CREATE TABLE goal_contributions (
    id VARCHAR(36) PRIMARY KEY,
    goal_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    note TEXT,
    contributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contributions_goal FOREIGN KEY (goal_id) REFERENCES savings_goals(id) ON DELETE CASCADE,
    CONSTRAINT chk_contribution_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_contributions_goal ON goal_contributions(goal_id);

-- =============================================
-- AI INSIGHTS TABLE
-- =============================================
CREATE TABLE ai_insights (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_insights_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_insights_unread ON ai_insights(user_id, is_read);

-- =============================================
-- REFRESH TOKENS TABLE (for JWT auth)
-- =============================================
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
