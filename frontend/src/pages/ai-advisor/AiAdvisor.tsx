import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { AiInsight } from '../../types';
import InsightsList from '../../components/analytics/InsightsList';
import './ai-advisor.css';

function AiAdvisor() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const response = await analyticsService.getAiInsights();
      setInsights(response.data);
    } catch {
      // Silently handle
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setIsGenerating(true);
    try {
      const response = await analyticsService.getAiSuggestions();
      setInsights((prev) => [...response.data, ...prev]);
    } catch {
      // Silently handle
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-advisor-page">
      <div className="ai-advisor-header">
        <div>
          <h1>AI Financial Advisor</h1>
          <p className="page-subtitle">Personalized insights based on your spending patterns</p>
        </div>
        <button
          className="btn-primary"
          onClick={generateNewInsights}
          disabled={isGenerating}
        >
          {isGenerating ? 'Analyzing...' : '🤖 Generate Insights'}
        </button>
      </div>

      <div className="ai-advisor-intro">
        <div className="intro-card">
          <h3>How it works</h3>
          <p>
            Our AI advisor analyzes your spending patterns, budget utilization, and goal progress
            to provide personalized recommendations. Insights are categorized as:
          </p>
          <div className="insight-types">
            <span className="type-badge warning">⚠️ Warnings — Potential overspending alerts</span>
            <span className="type-badge suggestion">💡 Suggestions — Actionable recommendations</span>
            <span className="type-badge achievement">🏆 Achievements — Positive financial habits</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="ai-loading">Analyzing your financial data...</div>
      ) : (
        <InsightsList insights={insights} />
      )}

      {!isLoading && insights.length === 0 && (
        <div className="ai-empty">
          <p>No insights yet</p>
          <span>Add some expenses and budgets, then click "Generate Insights" to get personalized advice.</span>
        </div>
      )}
    </div>
  );
}

export default AiAdvisor;
