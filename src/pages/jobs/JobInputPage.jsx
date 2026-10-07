import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import FileUploader from '../../components/cv/FileUploader';
import { Search, Sparkles, FileText, ArrowRight, CheckCircle2, Building, MapPin, Briefcase } from 'lucide-react';

const JobInputPage = () => {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [parsedJob, setParsedJob] = useState(null);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleAnalyzePasted = async (e) => {
    e.preventDefault();
    if (!rawText || rawText.trim().length < 20) {
      toastError('Please provide a complete job description.');
      return;
    }

    setAnalyzing(true);
    try {
      const { data } = await api.post('/jobs', { rawText, title: title.trim() });
      setParsedJob(data.job);
      success('Job description analyzed successfully!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to analyze job posting.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeUploaded = async () => {
    if (!file) {
      toastError('Please select a job description document.');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim() || file.name.replace(/\.[^/.]+$/, ''));

    try {
      const { data } = await api.post('/jobs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedJob(data.job);
      success('Job document analyzed successfully!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to upload job document.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {parsedJob ? 'Job Analysis Complete' : 'Analyze Target Job Description'}
        </h1>
        <p className="text-sm text-muted">
          {parsedJob
            ? 'Review the extracted prerequisites and keywords below, then compare your CV.'
            : 'Paste or upload any target job listing to extract required competencies, preferred skills, and ATS keywords.'}
        </p>
      </div>

      {!parsedJob ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          {/* Method tabs */}
          <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
            <button
              type="button"
              className={`tab-btn${activeTab === 'paste' ? ' active' : ''}`}
              onClick={() => setActiveTab('paste')}
            >
              Option 1: Paste Text
            </button>
            <button
              type="button"
              className={`tab-btn${activeTab === 'upload' ? ' active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Option 2: Upload File
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Job Title / Reference (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer — Acme Corp"
              disabled={analyzing}
            />
          </div>

          {activeTab === 'paste' ? (
            <form onSubmit={handleAnalyzePasted}>
              <div className="form-group">
                <label className="form-label">Job Description Text <span className="required">*</span></label>
                <textarea
                  className="form-textarea"
                  rows={10}
                  required
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="Paste the full job posting here (including requirements, responsibilities, and qualifications)..."
                  disabled={analyzing}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={analyzing}>
                  {analyzing ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16 }} />
                      Analyzing Requirements...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Analyze Job Description
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <FileUploader
                  onFileSelect={setFile}
                  label="Upload job posting document"
                  sublabel="Supports PDF, Word (.docx) or TXT files"
                  uploading={analyzing}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleAnalyzeUploaded}
                  disabled={!file || analyzing}
                >
                  {analyzing ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16 }} />
                      Extracting & Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Analyze Uploaded Job
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Parsed Job Overview */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)' }}>
                  {parsedJob.structuredData?.jobTitle || parsedJob.title}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Building size={14} /> {parsedJob.structuredData?.company || parsedJob.company}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} /> {parsedJob.structuredData?.location || 'Remote/Hybrid'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Briefcase size={14} /> {parsedJob.structuredData?.seniority || 'Mid-Level'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => navigate(`/match?jobId=${parsedJob._id}`)}
              >
                Compare Against My CV <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Required Skills & Preferred */}
          <div className="grid grid-2 gap-6">
            <div className="card">
              <h3 className="section-title mb-3" style={{ fontSize: 'var(--text-md)' }}>
                Required Must-Have Skills ({parsedJob.structuredData?.requiredSkills?.length || 0})
              </h3>
              <div className="skills-list">
                {(parsedJob.structuredData?.requiredSkills || []).map((s, idx) => (
                  <span key={idx} className="skill-chip matched">{s}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title mb-3" style={{ fontSize: 'var(--text-md)' }}>
                Preferred / Nice-to-Have Skills ({parsedJob.structuredData?.preferredSkills?.length || 0})
              </h3>
              <div className="skills-list">
                {(parsedJob.structuredData?.preferredSkills || []).map((s, idx) => (
                  <span key={idx} className="skill-chip partial">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Responsibilities & Keywords */}
          <div className="card">
            <h3 className="section-title mb-3" style={{ fontSize: 'var(--text-md)' }}>
              Core Responsibilities Extracted
            </h3>
            <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
              {(parsedJob.structuredData?.responsibilities || []).map((r, idx) => (
                <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setParsedJob(null)}
            >
              Analyze Another Job
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/match?jobId=${parsedJob._id}`)}
            >
              Proceed to CV Matching <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobInputPage;
