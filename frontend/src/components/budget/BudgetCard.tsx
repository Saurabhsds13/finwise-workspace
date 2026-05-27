import { Budget } from '../../types';
import './budget.css';

interface BudgetCardProps {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
}

function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const spentPercentage = budget.totalAmount > 0
    ? Math.min((budget.spentAmount / budget.totalAmount) * 100, 100)
    : 0;

  const remaining = budget.totalAmount - budget.spentAmount;
  const isOverBudget = remaining < 0;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getProgressColor = () => {
    if (spentPercentage >= 90) return 'var(--danger)';
    if (spentPercentage >= 70) return 'var(--warning)';
    return 'var(--secondary)';
  };

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <div>
          <h3 className="budget-card-title">{budget.name}</h3>
          <span className="budget-card-period">
            {budget.period} • {formatDate(budget.startDate)} – {formatDate(budget.endDate)}
          </span>
        </div>
        <div className="budget-card-actions">
          <button className="btn-icon" onClick={onEdit} aria-label="Edit budget">✏️</button>
          <button className="btn-icon btn-icon--danger" onClick={onDelete} aria-label="Delete budget">🗑️</button>
        </div>
      </div>

      <div className="budget-card-amounts">
        <div className="budget-spent">
          <span className="amount-label">Spent</span>
          <span className="amount-value">{formatAmount(budget.spentAmount)}</span>
        </div>
        <div className="budget-total">
          <span className="amount-label">Budget</span>
          <span className="amount-value">{formatAmount(budget.totalAmount)}</span>
        </div>
        <div className={`budget-remaining ${isOverBudget ? 'over-budget' : ''}`}>
          <span className="amount-label">{isOverBudget ? 'Over' : 'Remaining'}</span>
          <span className="amount-value">{formatAmount(Math.abs(remaining))}</span>
        </div>
      </div>

      <div className="budget-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${spentPercentage}%`, backgroundColor: getProgressColor() }}
          />
        </div>
        <span className="progress-label">{spentPercentage.toFixed(0)}% used</span>
      </div>

      {budget.categories.length > 0 && (
        <div className="budget-categories">
          <h4>Categories</h4>
          <div className="category-list">
            {budget.categories.map((cat) => {
              const catPercent = cat.allocatedAmount > 0
                ? Math.min((cat.spentAmount / cat.allocatedAmount) * 100, 100)
                : 0;
              return (
                <div key={cat.id} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-amounts">
                      {formatAmount(cat.spentAmount)} / {formatAmount(cat.allocatedAmount)}
                    </span>
                  </div>
                  <div className="category-progress">
                    <div
                      className="category-progress-fill"
                      style={{ width: `${catPercent}%`, backgroundColor: catPercent >= 90 ? 'var(--danger)' : 'var(--primary)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetCard;
