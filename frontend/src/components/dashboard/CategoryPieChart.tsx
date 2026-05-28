import { CategoryBreakdown } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import './dashboard.css';

interface CategoryPieChartProps {
  categories: CategoryBreakdown[];
}

function CategoryPieChart({ categories }: CategoryPieChartProps) {
  const getCategoryColor = (name: string) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.name === name);
    return cat?.color || '#607D8B';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (categories.length === 0) {
    return (
      <div className="dashboard-card">
        <h3>Spending by Category</h3>
        <div className="empty-chart">No spending data this month</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3>Spending by Category</h3>
      <div className="category-chart">
        {/* Simple bar chart representation */}
        <div className="category-bars">
          {categories.slice(0, 6).map((cat) => (
            <div key={cat.category} className="category-bar-item">
              <div className="category-bar-header">
                <span className="category-bar-name">{cat.category}</span>
                <span className="category-bar-amount">{formatAmount(cat.amount)}</span>
              </div>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: getCategoryColor(cat.category),
                  }}
                />
              </div>
              <span className="category-bar-percent">{cat.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPieChart;
