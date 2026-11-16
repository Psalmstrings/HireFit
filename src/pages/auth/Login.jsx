import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import { LogIn, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const { login } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUnverifiedEmail(null);
    try {
      const data = await login(email, password);
      success('Welcome back to HireFit!');
      if (data?.user?.isVerified === false) {
        info('Notice: Your email address is not verified yet. Please check your inbox.');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toastError(msg);
      if (err.response?.data?.code === 'UNVERIFIED_EMAIL') {
        setUnverifiedEmail(email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = unverifiedEmail || email;
    if (!targetEmail) {
      toastError('Please enter your email address to receive verification link.');
      return;
    }
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: targetEmail });
      success(data.message || 'Verification link sent! Check your inbox.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to resend verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page page-narrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 440, padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Sign in to HireFit
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4 }}>
              Continue optimizing your CV and tracking applications
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="form-input"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <LogIn size={16} />}
              Sign In
            </button>
          </form>

          {unverifiedEmail && (
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--warning-light)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
              <p style={{ margin: '0 0 6px 0', color: '#92400E', fontWeight: 600 }}>Account unverified. Need a new activation link?</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResendVerification}
                disabled={resending}
              >
                <Mail size={14} /> {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
