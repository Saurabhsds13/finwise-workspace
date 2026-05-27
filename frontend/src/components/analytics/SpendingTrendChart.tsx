import { SpendingTrend } from '../../types';
import './analytics.css';

interface SpendingTrendChartProps {
  trends: SpendingTrend[];
}

function SpendingTrendChart({ trends }: SpendingTrendChartProps) {
  if (trends.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Spending Trends</h3>
        <div className="empty-state">Not enough data for trends</div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...trends.map((t) => Math.max(t.totalSpent, t.budgetAmount))
  );

  const formatAmount = (amount: number) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="analytics-card">
      <h3>Spending Trends (6 Months)</h3>
      <div className="trend-chart">
        <div className="trend-legend">
          <span className="legend-item"><span className="legend-dot spent" /> Spent</span>
          <span className="legend-item"><span className="legend-dot budget" /> Budget</span>
        </div>
        <div className="trend-bars">
          {trends.map((trend) => {
            const spentHeight = maxValue > 0 ? (trend.totalSpent / maxValue) * 100 : 0;
            const budgetHeight = maxValue > 0 ? (trend.budgetAmount / maxValue) * 100 : 0;

            return (
              <div key={trend.month} className="trend-bar-group">
                <div className="trend-bar-container">
                  <div
                    className="trend-bar trend-bar--budget"
                    style={{ height: `${budgetHeight}%` }}
                    title={`Budget: ${formatAmount(trend.budgetAmount)}`}
                  />
                  <div
                    className="trend-bar trend-bar--spent"
                    style={{ height: `${spentHeight}%` }}
                    title={`Spent: ${formatAmount(trend.totalSpent)}`}
                  />
                </div>
                <span className="trend-label">{trend.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SpendingTrendChart;
