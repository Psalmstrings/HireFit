import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import { UserPlus, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [resending, setResending] = useState(false);
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toastError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      success('Account created! A verification link has been sent to your email.');
      setRegisteredEmail(email);
    } catch (err) {
      toastError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: registeredEmail });
      success(data.message || 'Verification email resent! Please check your inbox.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page page-narrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 460, padding: 'var(--space-8)' }}>
          {registeredEmail ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Check Your Inbox
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                We sent a verification link to <strong>{registeredEmail}</strong>. Please click the link in your email to activate your account.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue to Dashboard <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResend}
                  disabled={resending}
                >
                  <Mail size={16} /> {resending ? 'Resending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  Create your account
                </h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4 }}>
                  Start tailoring your CV with verified, genuine experience
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    autoComplete="name"
                  />
                </div>

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
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
                  {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <UserPlus size={16} />}
                  Create Account
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
