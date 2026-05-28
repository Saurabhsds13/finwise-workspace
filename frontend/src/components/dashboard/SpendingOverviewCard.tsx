import { SpendingOverview } from '../../types';
import './dashboard.css';

interface SpendingOverviewCardProps {
  overview: SpendingOverview | null;
}

function SpendingOverviewCard({ overview }: SpendingOverviewCardProps) {
  if (!overview) return null;

  const utilization = overview.budgetUtilizationPercentage;
  const getColor = () => {
    if (utilization >= 90) return 'var(--danger)';
    if (utilization >= 70) return 'var(--warning)';
    return 'var(--secondary)';
  };

  return (
    <div className="dashboard-card">
      <h3>Budget Utilization</h3>
      <div className="utilization-chart">
        <div className="utilization-ring">
          <svg viewBox="0 0 100 100" className="ring-svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={getColor()}
              strokeWidth="10"
              strokeDasharray={`${Math.min(utilization, 100) * 2.51} 251`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="ring-center">
            <span className="ring-value">{utilization.toFixed(0)}%</span>
            <span className="ring-label">used</span>
          </div>
        </div>
      </div>
      <div className="utilization-details">
        <div className="detail-row">
          <span>Spent</span>
          <span className="detail-value">{formatAmount(overview.totalSpent)}</span>
        </div>
        <div className="detail-row">
          <span>Budget</span>
          <span className="detail-value">{formatAmount(overview.totalBudget)}</span>
        </div>
        <div className="detail-row">
          <span>Avg/Day</span>
          <span className="detail-value">{formatAmount(overview.averageDailySpending)}</span>
        </div>
      </div>
    </div>
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default SpendingOverviewCard;
