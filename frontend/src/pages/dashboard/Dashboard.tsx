import { useDashboard } from '../../hooks/useDashboard';
import SpendingOverviewCard from '../../components/dashboard/SpendingOverviewCard';
import CategoryPieChart from '../../components/dashboard/CategoryPieChart';
import BudgetOverviewCard from '../../components/dashboard/BudgetOverviewCard';
import GoalsProgressCard from '../../components/dashboard/GoalsProgressCard';
import './dashboard.css';

function Dashboard() {
  const { overview, categories, activeBudgets, goals, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Your financial overview for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <span className="summary-label">Total Spent</span>
          <span className="summary-value spent">{formatAmount(overview?.totalSpent || 0)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Budget</span>
          <span className="summary-value">{formatAmount(overview?.totalBudget || 0)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Remaining</span>
          <span className={`summary-value ${(overview?.remainingBudget || 0) < 0 ? 'over' : 'remaining'}`}>
            {formatAmount(Math.abs(overview?.remainingBudget || 0))}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Daily Average</span>
          <span className="summary-value">{formatAmount(overview?.averageDailySpending || 0)}</span>
        </div>
      </div>

      {/* Charts & Details */}
      <div className="dashboard-grid">
        <SpendingOverviewCard overview={overview} />
        <CategoryPieChart categories={categories} />
        <BudgetOverviewCard budgets={activeBudgets} />
        <GoalsProgressCard goals={goals} />
      </div>
    </div>
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default Dashboard;
