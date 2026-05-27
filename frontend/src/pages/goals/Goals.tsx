import { useState } from 'react';
import GoalCard from '../../components/goals/GoalCard';
import GoalForm from '../../components/goals/GoalForm';
import ContributionModal from '../../components/goals/ContributionModal';
import { useGoals } from '../../hooks/useGoals';
import './goals.css';

function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [contributingGoal, setContributingGoal] = useState<string | null>(null);

  const { goals, isLoading, createGoal, updateGoal, deleteGoal, addContribution } = useGoals();

  const handleCreate = async (data: Record<string, unknown>) => {
    await createGoal(data);
    setShowForm(false);
  };

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    await updateGoal(id, data);
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    setEditingGoal(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleContribute = async (amount: number) => {
    if (contributingGoal) {
      await addContribution(contributingGoal, amount);
      setContributingGoal(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED');

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <h1>Savings Goals</h1>
          <p className="page-subtitle">Set targets and track your progress</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + New Goal
        </button>
      </div>

      {showForm && (
        <GoalForm
          goalId={editingGoal}
          onSubmit={editingGoal ? (data) => handleUpdate(editingGoal, data) : handleCreate}
          onCancel={handleCancel}
        />
      )}

      {isLoading ? (
        <div className="goals-loading">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="goals-empty">
          <p>No savings goals yet</p>
          <span>Create your first goal to start saving towards something meaningful.</span>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <section className="goals-section">
              <h2>Active Goals</h2>
              <div className="goals-grid">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEdit(goal.id)}
                    onDelete={() => handleDelete(goal.id)}
                    onContribute={() => setContributingGoal(goal.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {completedGoals.length > 0 && (
            <section className="goals-section">
              <h2>Completed Goals 🎉</h2>
              <div className="goals-grid">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEdit(goal.id)}
                    onDelete={() => handleDelete(goal.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {contributingGoal && (
        <ContributionModal
          onSubmit={handleContribute}
          onClose={() => setContributingGoal(null)}
        />
      )}
    </div>
  );
}

export default Goals;
