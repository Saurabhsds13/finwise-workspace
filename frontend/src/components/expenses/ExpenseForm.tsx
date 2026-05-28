import { useState, useEffect, FormEvent } from 'react';
import { expenseService } from '../../services/expenseService';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import './expenses.css';

interface ExpenseFormProps {
  expenseId: string | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function ExpenseForm({ expenseId, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseId) {
      loadExpense(expenseId);
    }
  }, [expenseId]);

  const loadExpense = async (id: string) => {
    try {
      const response = await expenseService.getById(id);
      const expense = response.data;
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || '',
        date: expense.date,
        isRecurring: expense.isRecurring,
        recurringFrequency: expense.recurringFrequency || '',
      });
    } catch {
      setError('Failed to load expense');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || null,
        date: formData.date,
        isRecurring: formData.isRecurring,
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : null,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expense-form-card">
      <h3>{expenseId ? 'Edit Expense' : 'Add New Expense'}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <input
              id="description"
              type="text"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group form-checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            />
            <span>This is a recurring expense</span>
          </label>
        </div>

        {formData.isRecurring && (
          <div className="form-group">
            <label htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              value={formData.recurringFrequency}
              onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
              required
            >
              <option value="">Select frequency</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : expenseId ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
