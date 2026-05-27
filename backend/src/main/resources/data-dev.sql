-- Seed data for development (H2 in-memory database)
-- This file is automatically loaded when using the 'dev' profile

-- Default expense categories
INSERT INTO expense_categories (id, name, icon, color, is_default) VALUES
    (RANDOM_UUID(), 'Food & Dining', 'utensils', '#FF6384', TRUE),
    (RANDOM_UUID(), 'Transportation', 'car', '#36A2EB', TRUE),
    (RANDOM_UUID(), 'Housing', 'home', '#FFCE56', TRUE),
    (RANDOM_UUID(), 'Utilities', 'zap', '#4BC0C0', TRUE),
    (RANDOM_UUID(), 'Healthcare', 'heart', '#9966FF', TRUE),
    (RANDOM_UUID(), 'Entertainment', 'film', '#FF9F40', TRUE),
    (RANDOM_UUID(), 'Shopping', 'shopping-bag', '#FF6384', TRUE),
    (RANDOM_UUID(), 'Education', 'book', '#C9CBCF', TRUE),
    (RANDOM_UUID(), 'Personal Care', 'user', '#7C4DFF', TRUE),
    (RANDOM_UUID(), 'Other', 'more-horizontal', '#607D8B', TRUE);
