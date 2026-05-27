import { EXPENSE_CATEGORIES } from '../../constants/categories';
import './expenses.css';

interface ExpenseFiltersProps {
  filters: { category: string; month: string };
  onFilterChange: (filters: { category: string; month: string }) => void;
}

function ExpenseFilters({ filters, onFilterChange }: ExpenseFiltersProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="expense-filters">
      <div className="filter-group">
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-month">Month</label>
        <input
          id="filter-month"
          type="month"
          value={filters.month || currentMonth}
          onChange={(e) => onFilterChange({ ...filters, month: e.target.value })}
        />
      </div>

      {(filters.category || filters.month) && (
        <button
          className="btn-text"
          onClick={() => onFilterChange({ category: '', month: '' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default ExpenseFilters;
