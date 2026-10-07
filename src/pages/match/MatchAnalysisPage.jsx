import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import MatchScore from '../../components/analysis/MatchScore';
import SkillsBreakdown from '../../components/analysis/SkillsBreakdown';
import ATSChecklist from '../../components/analysis/ATSChecklist';
import { Sparkles, ArrowRight, Zap, Target, CheckCircle2, TrendingUp } from 'lucide-react';

const MatchAnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';
  const initialCvId = searchParams.get('cvId') || '';

  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(initialCvId);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

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

        if (!selectedCvId && cvList.length > 0) setSelectedCvId(cvList[0]._id);
        if (!selectedJobId && jobList.length > 0) setSelectedJobId(jobList[0]._id);
      } catch (err) {
        toastError('Failed to load CVs and jobs.');
      } finally {
        setInitLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRunMatch = async (force = false) => {
    if (!selectedCvId || !selectedJobId) {
      toastError('Please select both a CV and a Job posting.');
      return;
    }

    setLoading(true);
    try {
      const url = `/analysis/${selectedCvId}/${selectedJobId}${force ? '?force=true' : ''}`;
      const { data } = await api.post(url);
      setAnalysis(data.analysis);
      success('Alignment analysis complete!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to analyze alignment.');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading match engine...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          CV vs Job Description Match Engine
        </h1>
        <p className="text-sm text-muted">
          Compare your verified CV against target job requirements to generate a transparent alignment score and identify evidence gaps.
        </p>
      </div>

      {/* Selector Box */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="grid grid-2 gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Candidate CV</label>
            <select
              className="form-select"
              value={selectedCvId}
              onChange={e => setSelectedCvId(e.target.value)}
              disabled={loading}
            >
              {cvs.map(cv => (
                <option key={cv._id} value={cv._id}>{cv.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Target Job Description</label>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          {analysis && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleRunMatch(true)}
              disabled={loading}
            >
              Re-Calculate Score
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => handleRunMatch(false)}
            disabled={loading || !selectedCvId || !selectedJobId}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Evaluating Alignment...
              </>
            ) : (
              <>
                <Target size={16} /> Run Match Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Main Score Display */}
          <MatchScore analysis={analysis} />

          {/* Quick CTA to optimize */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0 }}>
                Ready to optimize your CV for this role?
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginTop: 4 }}>
                Our AI optimizer rewrites bullet points and highlights genuine matching competencies with zero fabricated experience.
              </p>
            </div>
            <Link
              to={`/optimizer?cvId=${selectedCvId}&jobId=${selectedJobId}`}
              className="btn btn-lg"
              style={{ background: '#FFFFFF', color: 'var(--primary)', fontWeight: 700 }}
            >
              <Zap size={16} /> Tailor CV Now
            </Link>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-2 gap-6">
            <div className="card">
              <h3 className="section-title mb-3" style={{ fontSize: 'var(--text-md)' }}>
                Identified Strengths ({analysis.strengths?.length || 0})
              </h3>
              <ul style={{ paddingLeft: 18, listStyleType: 'disc' }}>
                {(analysis.strengths || []).map((str, idx) => (
                  <li key={idx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="section-title mb-3" style={{ fontSize: 'var(--text-md)' }}>
                Strategic Recommendations ({analysis.recommendations?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(analysis.recommendations || []).map((rec, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{rec.title}</span>
                      <span className={`badge ${rec.priority === 'High' ? 'badge-danger' : 'badge-neutral'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                      {rec.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Skills Breakdown */}
          <SkillsBreakdown
            matchedSkills={analysis.matchedSkills}
            partialMatches={analysis.partialMatches}
            missingSkills={analysis.missingSkills}
          />

          {/* ATS Readiness Checklist */}
          <ATSChecklist items={analysis.atsChecklist} />
        </div>
      )}
    </div>
  );
};

export default MatchAnalysisPage;
