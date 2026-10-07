import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, TrendingUp, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';

const SkillsGapPage = () => {
  const [searchParams] = useSearchParams();
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [skillsGap, setSkillsGap] = useState(null);
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
        toastError('Failed to load CVs and jobs.');
      } finally {
        setInitLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedCvId || !selectedJobId) {
      toastError('Please select a CV and a Job posting.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/analysis/${selectedCvId}/${selectedJobId}`);
      if (data.analysis?.skillsGap) {
        setSkillsGap(data.analysis.skillsGap);
      } else {
        // Fallback format
        setSkillsGap({
          strong: (data.analysis.matchedSkills || []).map(m => ({
            skill: m.skill,
            evidence: m.candidateEvidence,
            relevance: m.jobRequirement
          })),
          develop: (data.analysis.partialMatches || []).map(p => ({
            skill: p.skill,
            currentEvidence: p.candidateExperience,
            recommendation: p.missingAspect
          })),
          notEvidenced: (data.analysis.missingSkills || []).map(m => ({
            skill: m.skill,
            importance: m.importance,
            note: m.note
          })),
          summary: 'Review your 3-tier skills breakdown below.'
        });
      }
      success('Skills gap breakdown generated!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to analyze skills gap.');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading skills gap engine...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Skills Gap & Competency Analysis
        </h1>
        <p className="text-sm text-muted">
          Categorizes target role expectations into Strong, Develop, and Not Evidenced, allowing you to focus your preparation.
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !selectedCvId || !selectedJobId}
          >
            {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Sparkles size={16} />}
            Analyze Skills Gap
          </button>
        </div>
      </div>

      {skillsGap && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Summary */}
          {skillsGap.summary && (
            <div className="card" style={{ background: 'var(--primary-light)', borderColor: '#C7D2FE' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--primary-dark)', marginBottom: 4 }}>
                Strategic Fit Summary
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-dark)', margin: 0, lineHeight: 1.6 }}>
                {skillsGap.summary}
              </p>
            </div>
          )}

          {/* 3-tier Columns */}
          <div className="grid grid-3 gap-6">
            {/* STRONG */}
            <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text)' }}>
                  STRONG ({skillsGap.strong?.length || 0})
                </h3>
              </div>
              <p className="text-xs text-muted mb-4">
                Explicit evidence found in your CV. You meet or exceed expectations here.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(skillsGap.strong || []).map((s, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{s.skill}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>{s.evidence}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEVELOP */}
            <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                <TrendingUp size={18} color="var(--warning)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text)' }}>
                  DEVELOP ({skillsGap.develop?.length || 0})
                </h3>
              </div>
              <p className="text-xs text-muted mb-4">
                Adjacent background detected. Strengthen evidence or articulate transferrable experience.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(skillsGap.develop || []).map((d, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{d.skill}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{d.currentEvidence}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                      <strong>Tip: </strong>{d.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NOT EVIDENCED */}
            <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
                <HelpCircle size={18} color="var(--danger)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text)' }}>
                  NOT EVIDENCED ({skillsGap.notEvidenced?.length || 0})
                </h3>
              </div>
              <p className="text-xs text-muted mb-4">
                Not identified in your supplied CV. If you possess this experience, consider adding it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(skillsGap.notEvidenced || []).map((n, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{n.skill}</span>
                      <span className="badge badge-neutral">{n.importance || 'Medium'}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                      {n.note || `Experience with ${n.skill} was not identified in your supplied CV.`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsGapPage;
