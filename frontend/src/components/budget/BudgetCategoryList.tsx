import { BudgetCategory } from '../../types';
import './budget.css';

interface BudgetCategoryListProps {
  categories: BudgetCategory[];
}

function BudgetCategoryList({ categories }: BudgetCategoryListProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (categories.length === 0) {
    return <p className="no-categories">No category allocations set.</p>;
  }

  return (
    <div className="budget-category-list">
      {categories.map((cat) => {
        const percent = cat.allocatedAmount > 0
          ? Math.min((cat.spentAmount / cat.allocatedAmount) * 100, 100)
          : 0;
        const isOver = cat.spentAmount > cat.allocatedAmount;

        return (
          <div key={cat.id} className="budget-cat-item">
            <div className="budget-cat-info">
              <span className="budget-cat-name">{cat.name}</span>
              <span className={`budget-cat-amounts ${isOver ? 'over' : ''}`}>
                {formatAmount(cat.spentAmount)} / {formatAmount(cat.allocatedAmount)}
              </span>
            </div>
            <div className="budget-cat-bar">
              <div
                className="budget-cat-fill"
                style={{
                  width: `${percent}%`,
                  backgroundColor: isOver ? 'var(--danger)' : 'var(--primary)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetCategoryList;
