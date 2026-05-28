import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string; errorCode?: string } } };

      if (error.response?.data?.errorCode === 'EMAIL_ALREADY_EXISTS') {
        setError('This email is already registered. Please use a different email or sign in.');
      } else if (error.response?.status === 400) {
        setError('Please fill in all fields correctly.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Unable to create account. Please try again later.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">FinWise</h1>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success" role="status">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-row-inline">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (error) setError('');
                }}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (error) setError('');
                }}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

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
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError('');
              }}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (error) setError('');
              }}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
