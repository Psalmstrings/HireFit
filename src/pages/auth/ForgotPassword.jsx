import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      success(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
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
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)' }}>
              Reset Password
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4 }}>
              Enter your email to receive password reset instructions
            </p>
          </div>

          {resetToken ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ padding: 'var(--space-4)', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                Password reset token generated!
              </div>
              <Link to={`/reset-password?token=${resetToken}`} className="btn btn-primary" style={{ width: '100%' }}>
                Set New Password
              </Link>
            </div>
          ) : (
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <KeyRound size={16} />}
                Send Reset Link
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeft size={14} /> Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
