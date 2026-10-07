import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ApplicationModal from '../../components/applications/ApplicationModal';
import { Plus, Briefcase, ExternalLink, Edit2, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const statuses = ['All', 'Saved', 'Applied', 'Interview', 'Assessment', 'Offer', 'Rejected'];

const statusBadges = {
  Saved: 'badge-neutral',
  Applied: 'badge-primary',
  Interview: 'badge-warning',
  Assessment: 'badge-warning',
  Offer: 'badge-success',
  Rejected: 'badge-danger'
};

const ApplicationTrackerPage = () => {
  const [applications, setApplications] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      const [appRes, cvRes] = await Promise.all([
        api.get('/applications'),
        api.get('/cvs')
      ]);
      setApplications(appRes.data.applications || []);
      setCvs(cvRes.data.cvs || []);
    } catch (err) {
      toastError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveApplication = async (formData) => {
    try {
      if (editingApp) {
        const { data } = await api.put(`/applications/${editingApp._id}`, formData);
        setApplications(prev => prev.map(a => (a._id === editingApp._id ? data.application : a)));
        success('Application updated successfully.');
      } else {
        const { data } = await api.post('/applications', formData);
        setApplications(prev => [data.application, ...prev]);
        success('Application tracked!');
      }
      setModalOpen(false);
      setEditingApp(null);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save application.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete application for "${title}"?`)) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
      success('Application deleted.');
    } catch (err) {
      toastError('Failed to delete application.');
    }
  };

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading application tracker...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Job Application Tracker
          </h1>
          <p className="section-subtitle">
            Manage your opportunities through every hiring stage, linked with the exact tailored CV version used.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setEditingApp(null); setModalOpen(true); }}
        >
          <Plus size={16} /> Track New Application
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ overflowX: 'auto' }}>
        {statuses.map(st => (
          <button
            key={st}
            type="button"
            className={`tab-btn${filterStatus === st ? ' active' : ''}`}
            onClick={() => setFilterStatus(st)}
          >
            {st} ({st === 'All' ? applications.length : applications.filter(a => a.status === st).length})
          </button>
        ))}
      </div>

      {filteredApps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredApps.map(app => (
            <div
              key={app._id}
              className="card card-hover"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {app.jobTitle}
                  </h3>
                  <span className={`badge ${statusBadges[app.status] || 'badge-neutral'}`}>
                    {app.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {app.company}
                  </span>
                  {app.location && <span>• {app.location}</span>}
                  {app.salary && <span>• {app.salary}</span>}
                  {app.cvId && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FileText size={12} /> {app.cvId.title || 'Linked CV'}
                    </span>
                  )}
                  {app.appliedDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Calendar size={12} /> {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {app.notes && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>
                    "{app.notes}"
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {app.jobUrl && (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon btn-ghost btn-sm"
                    title="Open job link"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-icon btn-ghost btn-sm"
                  onClick={() => { setEditingApp(app); setModalOpen(true); }}
                  aria-label="Edit application"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  className="btn btn-icon btn-ghost btn-sm text-danger"
                  onClick={() => handleDelete(app._id, `${app.jobTitle} at ${app.company}`)}
                  aria-label="Delete application"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={24} />
            </div>
            <h3>No Applications in this Stage</h3>
            <p>Track jobs you are planning to apply for, active interviews, or offers received.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setEditingApp(null); setModalOpen(true); }}
            >
              <Plus size={16} /> Track New Application
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingApp(null); }}
        onSave={handleSaveApplication}
        application={editingApp}
        cvs={cvs}
      />
    </div>
  );
};

export default ApplicationTrackerPage;
