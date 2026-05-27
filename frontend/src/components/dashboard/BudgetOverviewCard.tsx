import { Budget } from '../../types';
import './dashboard.css';

interface BudgetOverviewCardProps {
  budgets: Budget[];
}

function BudgetOverviewCard({ budgets }: BudgetOverviewCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (budgets.length === 0) {
    return (
      <div className="dashboard-card">
        <h3>Active Budgets</h3>
        <div className="empty-chart">No active budgets</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3>Active Budgets</h3>
      <div className="budget-overview-list">
        {budgets.map((budget) => {
          const percent = budget.totalAmount > 0
            ? Math.min((budget.spentAmount / budget.totalAmount) * 100, 100)
            : 0;
          const getColor = () => {
            if (percent >= 90) return 'var(--danger)';
            if (percent >= 70) return 'var(--warning)';
            return 'var(--secondary)';
          };

          return (
            <div key={budget.id} className="budget-overview-item">
              <div className="budget-overview-header">
                <span className="budget-overview-name">{budget.name}</span>
                <span className="budget-overview-amounts">
                  {formatAmount(budget.spentAmount)} / {formatAmount(budget.totalAmount)}
                </span>
              </div>
              <div className="budget-overview-bar">
                <div
                  className="budget-overview-fill"
                  style={{ width: `${percent}%`, backgroundColor: getColor() }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetOverviewCard;
