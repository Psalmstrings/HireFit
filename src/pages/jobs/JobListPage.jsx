import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Trash2, ArrowRight, Building, MapPin } from 'lucide-react';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data.jobs || []);
    } catch (err) {
      toastError('Failed to fetch job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete job posting "${title}"?`)) return;
    try {
      await api.delete(`/jobs/${id}`);
      success('Job posting deleted.');
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      toastError('Failed to delete job posting.');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Saved Job Descriptions
          </h1>
          <p className="section-subtitle">
            Review parsed requirements, keywords, and run alignment matches against your CVs.
          </p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          <Plus size={16} /> Analyze New Job
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {jobs.map(job => (
            <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)' }}>
                  {job.structuredData?.jobTitle || job.title}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Building size={13} /> {job.structuredData?.company || job.company}
                  </span>
                  <span>•</span>
                  <span>{job.structuredData?.seniority || 'Mid-Level'}</span>
                  <span>•</span>
                  <span>{job.structuredData?.remoteType || 'Not specified'}</span>
                  <span>•</span>
                  <span>{job.structuredData?.requiredSkills?.length || 0} Required Skills</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Link to={`/match?jobId=${job._id}`} className="btn btn-primary btn-sm">
                  Match Against CV <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  className="btn btn-icon btn-ghost btn-sm text-danger"
                  onClick={() => handleDelete(job._id, job.title)}
                  aria-label="Delete job posting"
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
              <Search size={24} />
            </div>
            <h3>No Job Descriptions Saved</h3>
            <p>Paste or upload job postings to extract competencies and generate match scores.</p>
            <Link to="/jobs" className="btn btn-primary">
              <Plus size={16} /> Analyze Your First Job
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;
