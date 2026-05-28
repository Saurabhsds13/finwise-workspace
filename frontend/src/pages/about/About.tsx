import './about.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About FinWise</h1>
        <p className="about-tagline">
          AI-powered financial management for smarter money decisions
        </p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          FinWise was built with a simple goal — to help individuals take control of their
          finances through intelligent tracking, smart budgeting, and personalized AI-driven
          insights. We believe everyone deserves clarity over their money, without the
          complexity of traditional financial tools.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">💸</span>
            <h3>Expense Tracking</h3>
            <p>Categorize and monitor every rupee you spend with intuitive tracking tools.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Budget Planning</h3>
            <p>Create weekly, monthly, or yearly budgets with category-wise allocations.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Savings Goals</h3>
            <p>Set financial targets, track contributions, and celebrate milestones.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>AI Advisor</h3>
            <p>Get personalized insights and recommendations based on your spending patterns.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📈</span>
            <h3>Analytics</h3>
            <p>Visualize trends, category breakdowns, and month-over-month comparisons.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure & Private</h3>
            <p>Bank-grade encryption and JWT authentication to keep your data safe.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Technology</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <span className="tech-label">Frontend</span>
            <span className="tech-value">React, TypeScript, Vite</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Backend</span>
            <span className="tech-value">Java 17, Spring Boot 3.2</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Database</span>
            <span className="tech-value">MySQL 8.0</span>
          </div>
          <div className="tech-item">
            <span className="tech-label">Security</span>
            <span className="tech-value">JWT, BCrypt, Spring Security</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Team</h2>
        <p>
          FinWise is developed by a passionate team of engineers and designers who believe
          in building tools that make a real difference in people's financial lives.
        </p>
      </section>
    </div>
  );
}

export default About;
