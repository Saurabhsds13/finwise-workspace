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
            <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
          </div>
        </nav>

        <div className="landing-hero">
          <h1>Take Control of Your <span className="highlight">Finances</span></h1>
          <p className="hero-subtitle">
            AI-powered financial management — track expenses, plan budgets,
            set savings goals, and get personalized advice.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">10+</span>
              <span className="hero-stat-label">Expense Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">AI</span>
              <span className="hero-stat-label">Smart Insights</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Free & Secure</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="landing-features">
          <div className="feature-item">
            <span className="feature-emoji">💸</span>
            <span>Expense Tracking</span>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">📋</span>
            <span>Budget Planning</span>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🎯</span>
            <span>Savings Goals</span>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🤖</span>
            <span>AI Advisor</span>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">📈</span>
            <span>Analytics</span>
          </div>
          <div className="feature-item">
            <span className="feature-emoji">🔒</span>
            <span>Secure & Private</span>
          </div>
        </section>

        {/* About + Contact */}
        <div className="landing-bottom">
          <section id="about" className="landing-about">
            <p>
              FinWise helps individuals gain clarity over their money with intelligent
              tracking and AI-driven insights — no complexity, just results.
            </p>
          </section>

          <section id="contact" className="landing-contact">
            <span className="contact-chip">📧 support@finwise.app</span>
            <span className="contact-chip">📍 Mumbai, India</span>
          </section>
        </div>

        <footer className="landing-footer">
          <p>&copy; {new Date().getFullYear()} FinWise. Made with ❤️ in India</p>
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
