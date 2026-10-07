import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Copy, Check, Download, FileText, Trash2 } from 'lucide-react';

const tones = ['professional', 'enthusiastic', 'confident', 'direct'];

const CoverLetterPage = () => {
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedLetters, setSavedLetters] = useState([]);

  const [selectedCvId, setSelectedCvId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [recipientName, setRecipientName] = useState('Hiring Manager');

  const [generating, setGenerating] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      const [cvRes, jobRes, letRes] = await Promise.all([
        api.get('/cvs'),
        api.get('/jobs'),
        api.get('/cover-letters')
      ]);
      const cvList = cvRes.data.cvs || [];
      const jobList = jobRes.data.jobs || [];

      setCvs(cvList);
      setJobs(jobList);
      setSavedLetters(letRes.data.coverLetters || []);

      if (cvList.length > 0) setSelectedCvId(cvList[0]._id);
      if (jobList.length > 0) setSelectedJobId(jobList[0]._id);
    } catch (err) {
      toastError('Failed to load documents.');
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCvId || !selectedJobId) {
      toastError('Please select both a CV and a Job posting.');
      return;
    }

    setGenerating(true);
    try {
      const { data } = await api.post('/cover-letters/generate', {
        cvId: selectedCvId,
        jobId: selectedJobId,
        tone: selectedTone,
        recipientName
      });
      setCurrentLetter(data.coverLetter);
      setEditedContent(data.coverLetter.content);
      setSavedLetters(prev => [data.coverLetter, ...prev]);
      success('Cover letter generated based on your genuine experience!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentLetter) return;
    try {
      await api.put(`/cover-letters/${currentLetter._id}`, { content: editedContent });
      success('Cover letter saved.');
    } catch (err) {
      toastError('Failed to save changes.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    success('Copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([editedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${currentLetter?.company || 'Application'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading cover letter studio...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-muted">
          Craft targeted, compelling cover letters that connect your verified accomplishments directly to the target role.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="grid grid-2 gap-4">
          <div className="form-group">
            <label className="form-label">Candidate CV</label>
            <select
              className="form-select"
              value={selectedCvId}
              onChange={e => setSelectedCvId(e.target.value)}
              disabled={generating}
            >
              {cvs.map(cv => <option key={cv._id} value={cv._id}>{cv.title}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Job Posting</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              disabled={generating}
            >
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.structuredData?.jobTitle || job.title} ({job.structuredData?.company || job.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-2 gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Recipient / Hiring Manager</label>
            <input
              type="text"
              className="form-input"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              placeholder="e.g. Hiring Manager or Jane Doe"
              disabled={generating}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Letter Tone</label>
            <select
              className="form-select"
              value={selectedTone}
              onChange={e => setSelectedTone(e.target.value)}
              disabled={generating}
            >
              {tones.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={generating || !selectedCvId || !selectedJobId}
          >
            {generating ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Crafting Factual Cover Letter...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Tailored Cover Letter
              </>
            )}
          </button>
        </div>
      </div>

      {editedContent && (
        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <h3 className="section-title" style={{ margin: 0, fontSize: 'var(--text-md)' }}>
              Cover Letter for {currentLetter?.jobTitle} at {currentLetter?.company}
            </h3>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownloadTxt}>
                <Download size={14} /> Download (.txt)
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>

          <textarea
            className="form-textarea"
            rows={16}
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.7, fontSize: 'var(--text-sm)', padding: 'var(--space-4)' }}
          />
        </div>
      )}
    </div>
  );
};

export default CoverLetterPage;
