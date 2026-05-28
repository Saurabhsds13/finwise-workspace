import { SavingsGoal } from '../../types';
import './goals.css';

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: () => void;
  onDelete: () => void;
  onContribute?: () => void;
}

function GoalCard({ goal, onEdit, onDelete, onContribute }: GoalCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = () => {
    if (goal.status === 'COMPLETED') return 'var(--secondary)';
    if (goal.progressPercentage >= 75) return 'var(--secondary)';
    if (goal.progressPercentage >= 40) return 'var(--primary)';
    return 'var(--warning)';
  };

  const getDaysRemaining = () => {
    if (!goal.targetDate) return null;
    const today = new Date();
    const target = new Date(goal.targetDate);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Due today';
    return `${diff} days left`;
  };

  const isCompleted = goal.status === 'COMPLETED';
  const daysRemaining = getDaysRemaining();

  return (
    <div className={`goal-card ${isCompleted ? 'goal-card--completed' : ''}`}>
      <div className="goal-card-header">
        <div>
          <h3 className="goal-card-title">{goal.name}</h3>
          {daysRemaining && (
            <span className={`goal-deadline ${daysRemaining === 'Overdue' ? 'overdue' : ''}`}>
              {daysRemaining}
            </span>
          )}
        </div>
        <div className="goal-card-actions">
          <button className="btn-icon" onClick={onEdit} aria-label="Edit goal">✏️</button>
          <button className="btn-icon btn-icon--danger" onClick={onDelete} aria-label="Delete goal">🗑️</button>
        </div>
      </div>

      <div className="goal-amounts">
        <span className="goal-current">{formatAmount(goal.currentAmount)}</span>
        <span className="goal-target">of {formatAmount(goal.targetAmount)}</span>
      </div>

      <div className="goal-progress">
        <div className="goal-progress-bar">
          <div
            className="goal-progress-fill"
            style={{
              width: `${Math.min(goal.progressPercentage, 100)}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>
        <span className="goal-progress-label">{goal.progressPercentage.toFixed(1)}%</span>
      </div>

      <div className="goal-card-footer">
        <span className="goal-target-date">
          Target: {formatDate(goal.targetDate)}
        </span>
        {!isCompleted && onContribute && (
          <button className="btn-contribute" onClick={onContribute}>
            + Add Funds
          </button>
        )}
        {isCompleted && <span className="goal-completed-badge">✅ Completed</span>}
      </div>
    </div>
  );
}

export default GoalCard;
