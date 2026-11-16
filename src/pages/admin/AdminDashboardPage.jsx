import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Shield, Users, FileText, Search, Target, Briefcase, Trash2,
  CheckCircle, XCircle, RefreshCw, Download, Cpu, Activity,
  Calendar, Clock, ExternalLink, Mail, Award, X
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  // Selected user for activity drill-down modal
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      success(`Updated role to ${newRole}.`);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to change user role.');
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/verify`);
      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isVerified: data.isVerified } : u)));
      success(data.message || 'Verification updated.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update verification status.');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}" and all their CVs/data? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      success(`User "${name}" deleted.`);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleViewActivity = async (userId) => {
    setActivityLoading(true);
    try {
      const { data } = await api.get(`/admin/users/${userId}/activity`);
      setSelectedUserActivity(data);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load user activity details.');
    } finally {
      setActivityLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!users || users.length === 0) return;
    const headers = ['Name', 'Email', 'Role', 'Verified', 'AI Calls', 'CVs', 'Jobs', 'Analyses', 'Applications', 'Joined Date', 'Last Login'];
    const rows = users.map(u => [
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      u.role,
      u.isVerified ? 'Yes' : 'No',
      u.aiUsageCount || 0,
      u.cvCount || 0,
      u.jobCount || 0,
      u.analysisCount || 0,
      u.applicationCount || 0,
      new Date(u.createdAt).toISOString().split('T')[0],
      u.lastLogin ? new Date(u.lastLogin).toISOString().split('T')[0] : 'Never'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hirefit_user_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('User telemetry exported as CSV.');
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesVerified = verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && u.isVerified) ||
      (verifiedFilter === 'unverified' && !u.isVerified);
    return matchesSearch && matchesRole && matchesVerified;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading admin control center...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="empty-state">
          <Shield size={32} color="var(--danger)" />
          <h3>Access Denied</h3>
          <p>You must have administrator privileges to view this portal.</p>
        </div>
      </div>
    );
  }

  const verifiedPercent = stats.totalUsers > 0
    ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                Admin & Usage Telemetry
              </h1>
              <p className="text-sm text-muted" style={{ margin: 0 }}>
                Real-time platform activity, user monitoring, and AI resource usage
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleExportCSV}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={16} /> Overview & Analytics
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} /> User Directory & Usage Tracking ({users.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <>
          {/* Main Stats Grid */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="stat-card">
              <div className="stat-card-label">Total Users</div>
              <div className="stat-card-value">{stats.totalUsers}</div>
              <div className="stat-card-sub">{stats.verifiedUsers} verified ({verifiedPercent}%)</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">CVs Processed</div>
              <div className="stat-card-value">{stats.totalCVs}</div>
              <div className="stat-card-sub">Resumes uploaded & parsed</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">Job Postings</div>
              <div className="stat-card-value">{stats.totalJobs}</div>
              <div className="stat-card-sub">Target roles parsed</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">AI Analyses</div>
              <div className="stat-card-value">{stats.totalAnalyses}</div>
              <div className="stat-card-sub">Avg alignment: {stats.avgMatchScore}%</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">Job Applications</div>
              <div className="stat-card-value">{stats.totalApplications}</div>
              <div className="stat-card-sub">Tracked in pipeline</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-label">AI Invocations</div>
              <div className="stat-card-value" style={{ color: 'var(--primary)' }}>
                {stats.totalAiInvocations}
              </div>
              <div className="stat-card-sub">Gemini AI calls executed</div>
            </div>
          </div>

          <div className="grid grid-2 gap-6" style={{ marginBottom: 'var(--space-6)' }}>
            {/* Match Score Distribution */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={18} color="var(--primary)" /> Match Score Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>High Match (80%+)</span>
                    <span style={{ fontWeight: 700 }}>{stats.scoreDistribution?.high || 0}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'var(--success)',
                      width: `${stats.totalAnalyses > 0 ? ((stats.scoreDistribution?.high || 0) / stats.totalAnalyses) * 100 : 0}%`
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>Moderate Alignment (60–79%)</span>
                    <span style={{ fontWeight: 700 }}>{stats.scoreDistribution?.medium || 0}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'var(--warning)',
                      width: `${stats.totalAnalyses > 0 ? ((stats.scoreDistribution?.medium || 0) / stats.totalAnalyses) * 100 : 0}%`
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--danger)' }}>Needs Tailoring (&lt;60%)</span>
                    <span style={{ fontWeight: 700 }}>{stats.scoreDistribution?.low || 0}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'var(--danger)',
                      width: `${stats.totalAnalyses > 0 ? ((stats.scoreDistribution?.low || 0) / stats.totalAnalyses) * 100 : 0}%`
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Infrastructure Health */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={18} color="var(--primary)" /> System Services & Connectivity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Mail size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Gmail Nodemailer</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>User verification & password resets</div>
                    </div>
                  </div>
                  <span className="badge badge-success">Online & Ready</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Cpu size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Gemini 3.5 Flash AI</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>CV analysis & factual optimization</div>
                    </div>
                  </div>
                  <span className="badge badge-success">Connected</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Shield size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Administrator Account</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>psalmtringsdigital@gmail.com</div>
                    </div>
                  </div>
                  <span className="badge badge-primary">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--primary)" /> Recent Platform Registrations & Activity
            </h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verification</th>
                    <th>Registered</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers?.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.isVerified ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                            <CheckCircle size={14} /> Verified
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>
                            <XCircle size={14} /> Pending
                          </span>
                        )}
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: USER DIRECTORY & MONITORING */}
      {activeTab === 'users' && (
        <div className="card">
          {/* Search & Filter Toolbar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)'
          }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: 120 }}
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="form-input"
                style={{ width: 'auto', minWidth: 140 }}
                value={verifiedFilter}
                onChange={e => setVerifiedFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>AI Invocations</th>
                  <th>CVs</th>
                  <th>Analyses</th>
                  <th>Applications</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--muted)' }}>
                      No users match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 6px', fontSize: 11 }}
                          onClick={() => handleToggleVerify(u._id)}
                          title="Click to toggle email verification"
                        >
                          {u.isVerified ? (
                            <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle size={13} /> Verified
                            </span>
                          ) : (
                            <span style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <XCircle size={13} /> Unverified
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: u.aiUsageCount > 0 ? 'var(--primary)' : 'var(--muted)' }}>
                          {u.aiUsageCount || 0}
                        </span>
                      </td>
                      <td>{u.cvCount || 0}</td>
                      <td>{u.analysisCount || 0}</td>
                      <td>{u.applicationCount || 0}</td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleViewActivity(u._id)}
                            title="View detailed activity & telemetry"
                          >
                            Activity
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleRole(u._id, u.role)}
                          >
                            Set {u.role === 'admin' ? 'User' : 'Admin'}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: USER ACTIVITY DRILL-DOWN */}
      {selectedUserActivity && (
        <div className="modal-overlay active" onClick={() => setSelectedUserActivity(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Activity size={20} color="var(--primary)" />
                <div>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>
                    {selectedUserActivity.user.name} — Usage Telemetry
                  </h3>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
                    {selectedUserActivity.user.email} • Joined {new Date(selectedUserActivity.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-icon btn-ghost"
                onClick={() => setSelectedUserActivity(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Quick Stat Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                marginBottom: 'var(--space-4)',
                textAlign: 'center'
              }}>
                <div style={{ padding: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>AI Invocations</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                    {selectedUserActivity.user.aiUsageCount || 0}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>CVs</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    {selectedUserActivity.activity.cvs?.length || 0}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Analyses</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    {selectedUserActivity.activity.analyses?.length || 0}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Applications</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    {selectedUserActivity.activity.applications?.length || 0}
                  </div>
                </div>
              </div>

              {/* CVs Section */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={15} color="var(--primary)" /> Uploaded CVs ({selectedUserActivity.activity.cvs?.length || 0})
                </h4>
                {selectedUserActivity.activity.cvs?.length === 0 ? (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>No CVs uploaded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedUserActivity.activity.cvs.map(cv => (
                      <div key={cv._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
                        <span style={{ fontWeight: 600 }}>{cv.title}</span>
                        <span style={{ color: 'var(--muted)' }}>{new Date(cv.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Analyses Section */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Target size={15} color="var(--primary)" /> Job Match Analyses ({selectedUserActivity.activity.analyses?.length || 0})
                </h4>
                {selectedUserActivity.activity.analyses?.length === 0 ? (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>No match analyses run yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedUserActivity.activity.analyses.map(an => (
                      <div key={an._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
                        <span>
                          <strong>{an.jobId?.title || 'Job Analysis'}</strong> {an.jobId?.company ? `(${an.jobId.company})` : ''}
                        </span>
                        <span className="badge badge-primary">{an.overallScore}% Alignment</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Applications Section */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Briefcase size={15} color="var(--primary)" /> Applications Tracked ({selectedUserActivity.activity.applications?.length || 0})
                </h4>
                {selectedUserActivity.activity.applications?.length === 0 ? (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>No job applications tracked yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedUserActivity.activity.applications.map(app => (
                      <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
                        <span>
                          <strong>{app.jobTitle}</strong> at {app.company}
                        </span>
                        <span className="badge badge-neutral">{app.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedUserActivity(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
