import { useState, useEffect, FormEvent } from 'react';
import { goalService } from '../../services/goalService';
import './goals.css';

interface GoalFormProps {
  goalId: string | null;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function GoalForm({ goalId, onSubmit, onCancel }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalId) {
      loadGoal(goalId);
    }
  }, [goalId]);

  const loadGoal = async (id: string) => {
    try {
      const response = await goalService.getById(id);
      const goal = response.data;
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        targetDate: goal.targetDate || '',
      });
    } catch {
      setError('Failed to load goal');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate || null,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="goal-form-card">
      <h3>{goalId ? 'Edit Goal' : 'Create New Goal'}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="goal-name">Goal Name</label>
            <input
              id="goal-name"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="goal-amount">Target Amount</label>
            <input
              id="goal-amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="goal-date">Target Date (optional)</label>
            <input
              id="goal-date"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : goalId ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalForm;
