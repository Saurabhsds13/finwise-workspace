import { useState, useEffect, FormEvent } from 'react';
import { budgetService } from '../../services/budgetService';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import './budget.css';

interface CategoryAllocation {
  name: string;
  allocatedAmount: string;
}

interface BudgetFormProps {
  budgetId: string | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function BudgetForm({ budgetId, onSubmit, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    categories: [] as CategoryAllocation[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetId) {
      loadBudget(budgetId);
    }
  }, [budgetId]);

  // Auto-calculate end date based on period
  useEffect(() => {
    if (formData.startDate && formData.period) {
      const start = new Date(formData.startDate);
      let end: Date;

      switch (formData.period) {
        case 'WEEKLY':
          end = new Date(start);
          end.setDate(end.getDate() + 6);
          break;
        case 'MONTHLY':
          end = new Date(start);
          end.setMonth(end.getMonth() + 1);
          end.setDate(end.getDate() - 1);
          break;
        case 'YEARLY':
          end = new Date(start);
          end.setFullYear(end.getFullYear() + 1);
          end.setDate(end.getDate() - 1);
          break;
        default:
          return;
      }

      setFormData((prev) => ({ ...prev, endDate: end.toISOString().split('T')[0] }));
    }
  }, [formData.startDate, formData.period]);

  const loadBudget = async (id: string) => {
    try {
      const response = await budgetService.getById(id);
      const budget = response.data;
      setFormData({
        name: budget.name,
        totalAmount: budget.totalAmount.toString(),
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        categories: budget.categories.map((c: { name: string; allocatedAmount: number }) => ({
          name: c.name,
          allocatedAmount: c.allocatedAmount.toString(),
        })),
      });
    } catch {
      setError('Failed to load budget');
    }
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: '', allocatedAmount: '' }],
    });
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index),
    });
  };

  const updateCategory = (index: number, field: keyof CategoryAllocation, value: string) => {
    const updated = [...formData.categories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, categories: updated });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        totalAmount: parseFloat(formData.totalAmount),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categories: formData.categories
          .filter((c) => c.name && c.allocatedAmount)
          .map((c) => ({
            name: c.name,
            allocatedAmount: parseFloat(c.allocatedAmount),
          })),
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allocatedTotal = formData.categories.reduce(
    (sum, c) => sum + (parseFloat(c.allocatedAmount) || 0),
    0
  );

  return (
    <div className="budget-form-card">
      <h3>{budgetId ? 'Edit Budget' : 'Create New Budget'}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="budget-name">Budget Name</label>
            <input
              id="budget-name"
              type="text"
              placeholder="e.g., Monthly Household Budget"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget-amount">Total Amount</label>
            <input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget-period">Period</label>
            <select
              id="budget-period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              required
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget-start">Start Date</label>
            <input
              id="budget-start"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Category Allocations */}
        <div className="budget-categories-section">
          <div className="categories-header">
            <h4>Category Allocations</h4>
            <span className="allocation-summary">
              Allocated: ₹{allocatedTotal.toFixed(2)} / ₹{parseFloat(formData.totalAmount || '0').toFixed(2)}
            </span>
          </div>

          {formData.categories.map((cat, index) => (
            <div key={index} className="category-row">
              <select
                value={cat.name}
                onChange={(e) => updateCategory(index, 'name', e.target.value)}
                required
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount"
                value={cat.allocatedAmount}
                onChange={(e) => updateCategory(index, 'allocatedAmount', e.target.value)}
                required
              />
              <button type="button" className="btn-icon btn-icon--danger" onClick={() => removeCategory(index)}>
                ✕
              </button>
            </div>
          ))}

          <button type="button" className="btn-text" onClick={addCategory}>
            + Add Category
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : budgetId ? 'Update Budget' : 'Create Budget'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BudgetForm;
