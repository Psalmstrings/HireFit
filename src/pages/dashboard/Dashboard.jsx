import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CVLibraryCard from '../../components/cv/CVLibraryCard';
import {
  FileText, Briefcase, Target, ArrowRight, PlusCircle, Search,
  Zap, FolderHeart, Sparkles, Filter
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [stats, setStats] = useState({
    cvCount: 0,
    jobCount: 0,
    appCount: 0,
    avgScore: 0
  });
  const [cvs, setCvs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [cvRes, jobRes, appRes, analysisRes] = await Promise.all([
        api.get('/cvs'),
        api.get('/jobs'),
        api.get('/applications'),
        api.get('/analysis')
      ]);

      const cvList = cvRes.data.cvs || [];
      const analyses = analysisRes.data.analyses || [];
      const apps = appRes.data.applications || [];
      const jobs = jobRes.data.jobs || [];

      const totalScore = analyses.reduce((acc, a) => acc + (a.overallScore || 0), 0);
      const avg = analyses.length > 0 ? Math.round(totalScore / analyses.length) : 0;

      setStats({
        cvCount: cvList.length,
        jobCount: jobs.length,
        appCount: apps.length,
        avgScore: avg
      });

      setCvs(cvList);
      setRecentAnalyses(analyses.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteCV = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/cvs/${id}`);
      success('CV deleted successfully.');
      setCvs(prev => prev.filter(c => c._id !== id));
      setStats(prev => ({ ...prev, cvCount: Math.max(0, prev.cvCount - 1) }));
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete CV.');
    }
  };

  const handleRenameCV = async (id, newTitle, newTargetRole) => {
    try {
      await api.patch(`/cvs/${id}/rename`, {
        title: newTitle,
        targetRole: newTargetRole
      });
      success('CV details updated.');
      setCvs(prev => prev.map(c => (c._id === id ? { ...c, title: newTitle, targetRole: newTargetRole } : c)));
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update CV.');
    }
  };

  const filteredCvs = cvs.filter(cv => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = (cv.title || '').toLowerCase().includes(query);
    const matchRole = (cv.targetRole || '').toLowerCase().includes(query);
    const matchFilename = (cv.originalFile?.fileName || '').toLowerCase().includes(query);
    return matchTitle || matchRole || matchFilename;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading your career dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 'var(--text-sm)' }}>
            Your personal CV repository, AI role-tailoring workspace, and career alignment progress.
          </p>
        </div>

        {/* Global Action buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/cvs/upload" className="btn btn-secondary">
            <PlusCircle size={16} /> Upload CV
          </Link>
          <Link to="/optimizer" className="btn btn-primary">
            <Sparkles size={16} /> Optimize for a Job
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={20} />
          </div>
          <div className="stat-card-label">CV Library Count</div>
          <div className="stat-card-value">{stats.cvCount}</div>
          <div className="stat-card-sub">Saved resumes in your profile</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Search size={20} />
          </div>
          <div className="stat-card-label">Jobs Analyzed</div>
          <div className="stat-card-value">{stats.jobCount}</div>
          <div className="stat-card-sub">Target descriptions evaluated</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Target size={20} />
          </div>
          <div className="stat-card-label">Avg. Match Score</div>
          <div className="stat-card-value">
            {stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}
          </div>
          <div className="stat-card-sub">AI benchmark alignment</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Briefcase size={20} />
          </div>
          <div className="stat-card-label">Applications</div>
          <div className="stat-card-value">{stats.appCount}</div>
          <div className="stat-card-sub">Live opportunities tracked</div>
        </div>
      </div>

      {/* PERMANENT CV LIBRARY SECTION */}
      <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FolderHeart size={22} color="var(--primary)" />
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                My CV Library
              </h2>
            </div>
            <p className="section-subtitle" style={{ marginTop: 4, marginBottom: 0 }}>
              Select any saved CV version whenever applying for a new job opportunity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: 240 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 34, paddingRight: 12, fontSize: 'var(--text-sm)', height: 38 }}
                placeholder="Search by role or title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <Link to="/cvs/upload" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Upload CV
            </Link>
          </div>
        </div>

        {/* CV Grid */}
        {cvs.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-10) var(--space-4)' }}>
            <div className="empty-state-icon">
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Your CV Library is Empty</h3>
            <p style={{ maxWidth: 460 }}>
              Upload your CVs (e.g., Backend Developer, Frontend Developer, Product Manager) once. You can then pick any of them to tailor for specific job openings.
            </p>
            <Link to="/cvs/upload" className="btn btn-primary">
              <PlusCircle size={16} /> Upload Your First CV
            </Link>
          </div>
        ) : filteredCvs.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <p>No CVs found matching "<strong>{searchQuery}</strong>".</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {filteredCvs.map(cv => (
              <CVLibraryCard
                key={cv._id}
                cv={cv}
                onDelete={handleDeleteCV}
                onRename={handleRenameCV}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Matches Section */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Job Matches & Evaluations</h2>
            <p className="section-subtitle">Candidate-to-role comparisons and match scoring</p>
          </div>
          <Link to="/jobs" className="btn btn-ghost btn-sm">Analyze New Job</Link>
        </div>

        {recentAnalyses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentAnalyses.map(an => (
              <Link
                key={an._id}
                to={`/analysis/${an._id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)', background: 'var(--surface-2)',
                  borderRadius: 'var(--radius)', transition: 'background var(--transition)'
                }}
                className="card-hover"
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                    {an.jobId?.title || 'Target Job Posting'}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
                    {an.jobId?.company || 'Company'} · {new Date(an.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-md)', color: an.overallScore >= 75 ? 'var(--success)' : 'var(--warning)' }}>
                    {an.overallScore}%
                  </span>
                  <ArrowRight size={14} color="var(--muted)" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <p>No job matches run yet.</p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Analyze a Job Description
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
