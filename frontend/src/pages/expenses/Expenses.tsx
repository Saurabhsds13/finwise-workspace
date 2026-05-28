import { useState } from 'react';
import ExpenseList from '../../components/expenses/ExpenseList';
import ExpenseForm from '../../components/expenses/ExpenseForm';
import ExpenseFilters from '../../components/expenses/ExpenseFilters';
import { useExpenses } from '../../hooks/useExpenses';
import './expenses.css';

function Expenses() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [filters, setFilters] = useState({ category: '', month: '' });

  const { expenses, isLoading, createExpense, updateExpense, deleteExpense } = useExpenses(filters);

  const handleCreate = async (data: Record<string, unknown>) => {
    await createExpense(data);
    setShowForm(false);
  };

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    await updateExpense(id, data);
    setEditingExpense(null);
  };

  const handleEdit = (id: string) => {
    setEditingExpense(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Expenses</h1>
          <p className="page-subtitle">Track and manage your spending</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Expense
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          expenseId={editingExpense}
          onSubmit={editingExpense ? (data) => handleUpdate(editingExpense, data) : handleCreate}
          onCancel={handleCancel}
        />
      )}

      <ExpenseFilters filters={filters} onFilterChange={setFilters} />

      <ExpenseList
        expenses={expenses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={deleteExpense}
      />
    </div>
  );
}

export default Expenses;
