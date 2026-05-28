import { useState } from 'react';
import BudgetForm from '../../components/budget/BudgetForm';
import BudgetCard from '../../components/budget/BudgetCard';
import { useBudgets } from '../../hooks/useBudgets';
import './budget.css';

function Budget() {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  const { budgets, isLoading, createBudget, updateBudget, deleteBudget } = useBudgets();

  const handleCreate = async (data: Record<string, unknown>) => {
    await createBudget(data);
    setShowForm(false);
  };

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    await updateBudget(id, data);
    setEditingBudget(null);
  };

  const handleEdit = (id: string) => {
    setEditingBudget(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <div className="budget-page">
      <div className="budget-header">
        <div>
          <h1>Budget Planning</h1>
          <p className="page-subtitle">Create and manage your spending budgets</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Create Budget
        </button>
      </div>

      {showForm && (
        <BudgetForm
          budgetId={editingBudget}
          onSubmit={editingBudget ? (data) => handleUpdate(editingBudget, data) : handleCreate}
          onCancel={handleCancel}
        />
      )}

      {isLoading ? (
        <div className="budget-loading">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="budget-empty">
          <p>No budgets yet</p>
          <span>Create your first budget to start tracking your spending limits.</span>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => handleEdit(budget.id)}
              onDelete={() => handleDelete(budget.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Budget;
