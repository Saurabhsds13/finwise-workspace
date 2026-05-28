import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string; errorCode?: string } } };

      if (error.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.response?.status === 400) {
        setError('Please fill in all fields correctly.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Unable to connect to server. Please try again later.');
      }
    }
  };

  return (
    <div className="auth-landing">
      {/* Left Side - Landing Content */}
      <div className="landing-left">
        <nav className="landing-nav">
          <span className="landing-logo">FinWise</span>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="landing-hero">
          <h1>Take Control of Your <span className="highlight">Finances</span></h1>
          <p className="hero-subtitle">
            AI-powered financial management that helps you track expenses, plan budgets,
            set savings goals, and receive personalized advice — all in one place.
          </p>
        </div>

        {/* Features Section */}
        <section id="features" className="landing-features">
          <div className="feature-item">
            <span className="feature-emoji">💸</span>
            <div>
              <h3>Expense Tracking</h3>
              <p>Categorize and monitor every rupee with smart categorization</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">📋</span>
            <div>
              <h3>Budget Planning</h3>
              <p>Create budgets with category allocations and real-time tracking</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🎯</span>
            <div>
              <h3>Savings Goals</h3>
              <p>Set targets, track contributions, and celebrate milestones</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🤖</span>
            <div>
              <h3>AI Advisor</h3>
              <p>Get personalized insights based on your spending patterns</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="landing-about">
          <h2>About FinWise</h2>
          <p>
            FinWise is built for individuals who want clarity over their money without
            the complexity of traditional financial tools. Our AI engine analyzes your
            spending behavior and provides actionable recommendations to help you save
            more and spend smarter.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="landing-contact">
          <h2>Get in Touch</h2>
          <div className="contact-items">
            <div className="contact-chip">📧 support@finwise.app</div>
            <div className="contact-chip">📍 Mumbai, India</div>
            <div className="contact-chip">⏰ Mon-Fri, 9AM-6PM IST</div>
          </div>
        </section>

        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} FinWise. All rights reserved. Made with ❤️ in India</p>
        </footer>
      </div>

      {/* Right Side - Login Form */}
      <div className="landing-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (error) setError('');
                }}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (error) setError('');
                }}
                required
                autoComplete="current-password"
                minLength={8}
              />
            </div>

            <div className="form-row">
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
