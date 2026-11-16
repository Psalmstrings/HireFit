import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import { CheckCircle2, AlertCircle, ArrowRight, Mail, Sparkles } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'verifying' : 'no_token'); // verifying | success | error | no_token
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const { loadUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const verifyToken = async () => {
      try {
        const { data } = await api.post('/auth/verify-email', { token });
        if (!isMounted) return;

        if (data.token) {
          localStorage.setItem('hirefit_token', data.token);
          if (data.user) {
            localStorage.setItem('hirefit_user', JSON.stringify(data.user));
          }
          await loadUser();
        }
        setStatus('success');
        success('Email verified successfully! Welcome to HireFit.');
      } catch (err) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token, loadUser, success]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      toastError('Please enter your registered email address.');
      return;
    }
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: resendEmail });
      success(data.message || 'Verification email sent! Please check your inbox.');
      setResendEmail('');
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
        <div className="card" style={{ width: '100%', maxWidth: 480, padding: 'var(--space-8)', textAlign: 'center' }}>

          {status === 'verifying' && (
            <div>
              <div className="spinner" style={{ width: 42, height: 42, margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Verifying Your Account
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                Please wait while we confirm your email address and prepare your account...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Account Verified!
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                Your email has been verified successfully. A welcome email is on its way to your inbox. You now have full access to HireFit's AI career tools.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <AlertCircle size={36} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Verification Failed
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                {errorMessage}
              </p>

              <form onSubmit={handleResend} style={{ textAlign: 'left', marginTop: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Enter your email to get a new link</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    className="form-input"
                    required
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                  <button type="submit" className="btn btn-primary" disabled={resending} style={{ whiteSpace: 'nowrap' }}>
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: 600 }}>
                  Back to Sign in
                </Link>
              </div>
            </div>
          )}

          {status === 'no_token' && (
            <div>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <Mail size={32} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Email Verification
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                Did not receive your verification email or need a new activation link? Enter your email address below.
              </p>

              <form onSubmit={handleResend} style={{ textAlign: 'left' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={resending}>
                  {resending ? 'Sending...' : 'Send Verification Link'}
                </button>
              </form>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                  Back to Sign in
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
