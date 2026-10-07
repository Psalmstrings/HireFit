import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import QuestionCard from '../../components/interview/QuestionCard';
import { Sparkles, BookOpen, Building, Briefcase } from 'lucide-react';

const InterviewPrepPage = () => {
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cvRes, jobRes] = await Promise.all([
          api.get('/cvs'),
          api.get('/jobs')
        ]);
        const cvList = cvRes.data.cvs || [];
        const jobList = jobRes.data.jobs || [];

        setCvs(cvList);
        setJobs(jobList);

        if (cvList.length > 0) setSelectedCvId(cvList[0]._id);
        if (jobList.length > 0) setSelectedJobId(jobList[0]._id);
      } catch (err) {
        toastError('Failed to load documents.');
      } finally {
        setInitLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCvId || !selectedJobId) {
      toastError('Please select both a CV and a Job posting.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/interviews/generate', {
        cvId: selectedCvId,
        jobId: selectedJobId
      });
      setSession(data.session);
      success('Interview preparation questions generated!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to generate interview prep.');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading interview coach...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          AI Interview Coach & Q&A Preparation
        </h1>
        <p className="text-sm text-muted">
          Anticipate technical, behavioral, and CV-specific questions with candidate-tailored talking points sourced from your genuine experience.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="grid grid-2 gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Candidate CV</label>
            <select
              className="form-select"
              value={selectedCvId}
              onChange={e => setSelectedCvId(e.target.value)}
              disabled={loading}
            >
              {cvs.map(cv => <option key={cv._id} value={cv._id}>{cv.title}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Job Posting</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              disabled={loading}
            >
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.structuredData?.jobTitle || job.title} ({job.structuredData?.company || job.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={loading || !selectedCvId || !selectedJobId}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Analyzing CV & Job Architecture...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Interview Q&A Session
              </>
            )}
          </button>
        </div>
      </div>

      {session && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text)' }}>
                Target Questions for {session.jobTitle || 'Role'} at {session.company || 'Company'}
              </h2>
              <p className="text-xs text-muted">
                Click any question to view interviewer intent, STAR answering blueprints, and your tailored talking points.
              </p>
            </div>
            <span className="badge badge-primary">
              {session.questions?.length || 0} Questions
            </span>
          </div>

          <div>
            {(session.questions || []).map((q, idx) => (
              <QuestionCard key={idx} item={q} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepPage;
