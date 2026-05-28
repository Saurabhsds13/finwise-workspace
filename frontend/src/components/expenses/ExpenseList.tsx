import { Expense } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import './expenses.css';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ExpenseList({ expenses, isLoading, onEdit, onDelete }: ExpenseListProps) {
  if (isLoading) {
    return <div className="expense-loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-empty">
        <p>No expenses found</p>
        <span>Start tracking your spending by adding your first expense.</span>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.name === category);
    return cat?.icon || '💰';
  };

  const getCategoryColor = (category: string) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.name === category);
    return cat?.color || '#607D8B';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
    }
  };

  return (
    <div className="expense-list">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="expense-category">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <span className="category-icon">{getCategoryIcon(expense.category)}</span>
                  <span>{expense.category}</span>
                </div>
              </td>
              <td className="expense-description">
                {expense.description || '—'}
                {expense.isRecurring && <span className="recurring-badge">Recurring</span>}
              </td>
              <td className="expense-date">{formatDate(expense.date)}</td>
              <td className="expense-amount">{formatAmount(expense.amount)}</td>
              <td className="expense-actions">
                <button
                  className="btn-icon"
                  onClick={() => onEdit(expense.id)}
                  aria-label="Edit expense"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-icon--danger"
                  onClick={() => handleDelete(expense.id)}
                  aria-label="Delete expense"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
