import { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import SpendingTrendChart from '../../components/analytics/SpendingTrendChart';
import InsightsList from '../../components/analytics/InsightsList';
import './analytics.css';

function Analytics() {
  const [period, setPeriod] = useState('month');
  const { overview, categories, trends, insights, isLoading } = useAnalytics(period);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (isLoading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-subtitle">Understand your spending patterns</p>
        </div>
        <div className="period-selector">
          {['week', 'month', 'quarter', 'year'].map((p) => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="analytics-stats">
          <div className="stat-card">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">{formatAmount(overview.totalSpent)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Budget Utilization</span>
            <span className="stat-value">{overview.budgetUtilizationPercentage.toFixed(0)}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Daily Average</span>
            <span className="stat-value">{formatAmount(overview.averageDailySpending)}</span>
          </div>
        </div>
      )}

      <div className="analytics-grid">
        {/* Spending Trends */}
        <SpendingTrendChart trends={trends} />

        {/* Category Breakdown */}
        <div className="analytics-card">
          <h3>Category Breakdown</h3>
          {categories.length === 0 ? (
            <div className="empty-state">No spending data for this period</div>
          ) : (
            <div className="category-breakdown-list">
              {categories.map((cat) => (
                <div key={cat.category} className="breakdown-item">
                  <div className="breakdown-info">
                    <span className="breakdown-name">{cat.category}</span>
                    <span className="breakdown-amount">{formatAmount(cat.amount)}</span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="breakdown-percent">{cat.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <InsightsList insights={insights} />
    </div>
  );
}

export default Analytics;
