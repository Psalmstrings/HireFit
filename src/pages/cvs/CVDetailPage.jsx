import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CVPreview from '../../components/cv/CVPreview';
import TemplateSelector from '../../components/cv/TemplateSelector';
import { Edit3, Zap, Clock, RotateCcw, ArrowLeft, Download, FileText } from 'lucide-react';

const CVDetailPage = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [versions, setVersions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'versions'
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const fetchCVAndVersions = async () => {
    try {
      const [cvRes, verRes] = await Promise.all([
        api.get(`/cvs/${id}`),
        api.get(`/cvs/${id}/versions`)
      ]);
      setCv(cvRes.data.cv);
      setSelectedTemplate(cvRes.data.cv.selectedTemplate || 'modern');
      setVersions(verRes.data.versions || []);
    } catch (err) {
      toastError('Failed to load CV.');
      navigate('/cvs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVAndVersions();
  }, [id]);

  const handleTemplateChange = async (tpl) => {
    setSelectedTemplate(tpl);
    try {
      await api.put(`/cvs/${id}`, { selectedTemplate: tpl });
    } catch (err) {
      console.warn('Failed to persist template preference');
    }
  };

  const handleRestoreVersion = async (versionId, label) => {
    if (!window.confirm(`Restore to "${label}"? This will set its content as your current active CV.`)) {
      return;
    }
    try {
      const { data } = await api.post(`/cvs/${id}/versions/${versionId}/restore`);
      success(`Restored to ${label}`);
      setCv(data.cv);
      setActiveTab('preview');
    } catch (err) {
      toastError('Failed to restore version.');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading CV preview...</span>
      </div>
    );
  }

  if (!cv) return null;

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Top breadcrumb & actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link to="/cvs" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back to CVs
          </Link>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            {cv.title}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link to={`/cvs/${cv._id}/edit`} className="btn btn-secondary btn-sm">
            <Edit3 size={14} /> Edit Fields
          </Link>
          <Link to={`/optimizer?cvId=${cv._id}`} className="btn btn-primary btn-sm">
            <Zap size={14} /> Tailor for Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs no-print">
        <button
          type="button"
          className={`tab-btn${activeTab === 'preview' ? ' active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          <FileText size={15} /> Document Preview & Export
        </button>
        <button
          type="button"
          className={`tab-btn${activeTab === 'versions' ? ' active' : ''}`}
          onClick={() => setActiveTab('versions')}
        >
          <Clock size={15} /> Version History ({versions.length})
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div>
          {/* Template Selector Bar */}
          <div className="card no-print" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 'var(--space-3)', letterSpacing: '0.06em' }}>
              Choose ATS-Optimized Template
            </div>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateChange}
            />
          </div>

          {/* Render Preview */}
          <CVPreview
            data={cv.parsedData}
            template={selectedTemplate}
            fileName={cv.title || 'HireFit_CV'}
          />
        </div>
      ) : (
        <div className="card">
          <h2 className="section-title mb-2">Version History</h2>
          <p className="section-subtitle mb-6">
            Every time you tailor or manually edit this CV, a distinct version snapshot is saved.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {versions.map(ver => {
              const isActive = String(cv.activeVersionId) === String(ver._id);
              return (
                <div
                  key={ver._id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: 'var(--space-4)', background: isActive ? 'var(--primary-light)' : 'var(--surface-2)',
                    borderRadius: 'var(--radius)', border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                    flexWrap: 'wrap', gap: 'var(--space-3)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                        {ver.label || ver.versionName || `Version ${ver.versionNumber}`}
                      </span>
                      {isActive && <span className="badge badge-primary">Active Version</span>}
                      {ver.matchScore != null && (
                        <span className={`badge ${ver.matchScore >= 75 ? 'badge-success' : 'badge-warning'}`}>
                          {ver.matchScore}% Match
                        </span>
                      )}
                      {ver.targetCompany && (
                        <span className="badge badge-neutral">
                          {ver.targetCompany}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                      Saved on {new Date(ver.createdAt).toLocaleString()}
                      {ver.targetJobTitle && ` · Role: ${ver.targetJobTitle}`}
                      {ver.changesSummary?.length > 0 && ` · ${ver.changesSummary.length} tailored improvement(s)`}
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRestoreVersion(ver._id, ver.label)}
                    >
                      <RotateCcw size={13} /> Restore as Active
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVDetailPage;
