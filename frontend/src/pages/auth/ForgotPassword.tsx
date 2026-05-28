import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">FinWise</h1>
            <p className="auth-subtitle">Check your email</p>
          </div>
          <div className="auth-success">
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
          </div>
          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">FinWise</h1>
          <p className="auth-subtitle">Reset your password</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <p className="form-hint">
              Enter the email associated with your account and we'll send a reset link.
            </p>
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
