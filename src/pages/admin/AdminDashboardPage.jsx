import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Shield, Users, FileText, Search, Target, Briefcase, Trash2 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      toastError(err.response?.data?.message || 'Access denied or failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      success(`Updated user role to ${newRole}.`);
    } catch (err) {
      toastError('Failed to change user role.');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      success('User deleted.');
    } catch (err) {
      toastError('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading admin portal...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="empty-state">
          <Shield size={32} color="var(--danger)" />
          <h3>Access Denied</h3>
          <p>You must have administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={22} color="var(--primary)" />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', margin: 0 }}>
            Platform Administration & Telemetry
          </h1>
        </div>
        <p className="text-sm text-muted" style={{ marginTop: 4 }}>
          System-wide performance, user activity, AI invocation statistics, and role management.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Registered Users</div>
          <div className="stat-card-value">{stats.totalUsers}</div>
          <div className="stat-card-sub">Global accounts</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">CVs Processed</div>
          <div className="stat-card-value">{stats.totalCVs}</div>
          <div className="stat-card-sub">Uploaded and parsed</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Jobs Analyzed</div>
          <div className="stat-card-value">{stats.totalJobs}</div>
          <div className="stat-card-sub">Descriptions parsed</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">AI Analyses Run</div>
          <div className="stat-card-value">{stats.totalAnalyses}</div>
          <div className="stat-card-sub">Average alignment: {stats.avgMatchScore}%</div>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="card">
        <h3 className="section-title mb-4">User Directory & Permissions</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>AI Invocations</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.aiUsageCount || 0}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleRole(u._id, u.role)}
                      >
                        Set to {u.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost btn-sm text-danger"
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        aria-label="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
