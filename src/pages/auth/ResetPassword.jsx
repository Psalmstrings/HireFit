import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/layout/Navbar';
import { Check } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toastError('Missing password reset token.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, newPassword });
      localStorage.setItem('hirefit_token', data.token);
      success(data.message);
      navigate('/dashboard');
    } catch (err) {
      toastError(err.response?.data?.message || 'Password reset failed.');
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
              Set New Password
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4 }}>
              Choose a secure password with at least 6 characters
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Check size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
