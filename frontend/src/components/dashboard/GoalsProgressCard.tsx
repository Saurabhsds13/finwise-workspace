import { SavingsGoal } from '../../types';
import './dashboard.css';

interface GoalsProgressCardProps {
  goals: SavingsGoal[];
}

function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').slice(0, 4);

  if (activeGoals.length === 0) {
    return (
      <div className="dashboard-card">
        <h3>Savings Goals</h3>
        <div className="empty-chart">No active goals</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3>Savings Goals</h3>
      <div className="goals-overview-list">
        {activeGoals.map((goal) => (
          <div key={goal.id} className="goal-overview-item">
            <div className="goal-overview-header">
              <span className="goal-overview-name">{goal.name}</span>
              <span className="goal-overview-percent">{goal.progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="goal-overview-bar">
              <div
                className="goal-overview-fill"
                style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
              />
            </div>
            <div className="goal-overview-amounts">
              <span>{formatAmount(goal.currentAmount)}</span>
              <span>{formatAmount(goal.targetAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsProgressCard;
