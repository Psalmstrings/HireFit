import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      success(data.message || 'Password reset link sent to your email.');
      setSubmitted(true);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page page-narrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 440, padding: 'var(--space-8)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <MailCheck size={30} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                Check Your Email
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password shortly.
              </p>
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)' }}>
                  Reset Password
                </h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4 }}>
                  Enter your email to receive password reset instructions
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

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <KeyRound size={16} />}
                  Send Reset Link
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ArrowLeft size={14} /> Back to Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
