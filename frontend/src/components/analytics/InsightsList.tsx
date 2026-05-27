import { AiInsight } from '../../types';
import './analytics.css';

interface InsightsListProps {
  insights: AiInsight[];
}

function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return '⚠️';
      case 'SUGGESTION': return '💡';
      case 'ACHIEVEMENT': return '🏆';
      default: return '📌';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'WARNING': return 'insight--warning';
      case 'SUGGESTION': return 'insight--suggestion';
      case 'ACHIEVEMENT': return 'insight--achievement';
      default: return '';
    }
  };

  return (
    <div className="insights-section">
      <h2>AI Insights</h2>
      <div className="insights-list">
        {insights.map((insight) => (
          <div key={insight.id} className={`insight-card ${getTypeClass(insight.type)}`}>
            <span className="insight-icon">{getIcon(insight.type)}</span>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightsList;
