import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back to HireFit!');
      navigate('/dashboard');
    } catch (err) {
      toastError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'demo') {
      setEmail('demo@hirefit.dev');
      setPassword('DemoPass123!');
    } else {
      setEmail('admin@hirefit.dev');
      setPassword('AdminPass123!');
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
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <LogIn size={16} />}
              Sign In
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
            <span style={{ color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Quick Fill Seed Accounts:</span>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleFillDemo('demo')}>
                Demo User
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleFillDemo('admin')}>
                Admin User
              </button>
            </div>
          </div>

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
