import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CVLibraryCard from '../../components/cv/CVLibraryCard';
import {
  FileText, Plus, Search, Sparkles, FolderHeart
} from 'lucide-react';

const CVListPage = () => {
  const [cvs, setCvs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchCVs = async () => {
    try {
      const { data } = await api.get('/cvs');
      setCvs(data.cvs || []);
    } catch (err) {
      toastError('Failed to fetch CVs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/cvs/${id}`);
      success('CV deleted successfully.');
      setCvs(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      toastError('Failed to delete CV.');
    }
  };

  const handleRename = async (id, newTitle, newTargetRole) => {
    try {
      await api.patch(`/cvs/${id}/rename`, {
        title: newTitle,
        targetRole: newTargetRole
      });
      success('CV updated.');
      setCvs(prev => prev.map(c => (c._id === id ? { ...c, title: newTitle, targetRole: newTargetRole } : c)));
    } catch (err) {
      toastError('Failed to rename CV.');
    }
  };

  const filteredCvs = cvs.filter(cv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (cv.title || '').toLowerCase().includes(q) ||
      (cv.targetRole || '').toLowerCase().includes(q) ||
      (cv.originalFile?.fileName || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading your CV Library...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FolderHeart size={24} color="var(--primary)" />
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', margin: 0 }}>
              My CV Library
            </h1>
          </div>
          <p className="section-subtitle" style={{ marginTop: 4 }}>
            Store multiple tailored resumes permanently. Pick any saved CV to customize for target jobs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/optimizer" className="btn btn-secondary">
            <Sparkles size={16} /> Optimize for a Job
          </Link>
          <Link to="/cvs/upload" className="btn btn-primary">
            <Plus size={16} /> Upload New CV
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      {cvs.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search by CV title, target role, or filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* CV Grid */}
      {cvs.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: 'var(--space-12) var(--space-4)' }}>
            <div className="empty-state-icon">
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Your CV Library is Empty</h3>
            <p style={{ maxWidth: 480, margin: '8px auto 20px' }}>
              Upload your CVs once (e.g. Backend Developer CV, Frontend Developer CV, Full Stack Developer CV). They will remain saved in your library so you can optimize any of them for any job opening.
            </p>
            <Link to="/cvs/upload" className="btn btn-primary btn-lg">
              <Plus size={18} /> Upload Your First CV
            </Link>
          </div>
        </div>
      ) : filteredCvs.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <p>No CVs matching "<strong>{searchQuery}</strong>".</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
              Show All Saved CVs
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--space-5)'
        }}>
          {filteredCvs.map(cv => (
            <CVLibraryCard
              key={cv._id}
              cv={cv}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CVListPage;
