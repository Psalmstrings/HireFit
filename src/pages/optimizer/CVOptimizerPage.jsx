import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import BeforeAfterCard from '../../components/optimization/BeforeAfterCard';
import { ScoreGauge } from '../../components/analysis/MatchScore';
import SkillsBreakdown from '../../components/analysis/SkillsBreakdown';
import {
  Zap, ShieldCheck, Check, ArrowRight, Eye, CheckCircle2,
  FileText, Briefcase, Plus, RotateCcw, Sparkles, Building2,
  Clock, FileType, CheckCircle, AlertCircle, Lightbulb,
  Columns, Layers, CheckSquare, Sparkle
} from 'lucide-react';

const PROGRESS_STEPS = [
  'Loading complete Master CV background & verified achievements...',
  'Parsing target job requirements & extracting key competencies...',
  'Calculating transparent candidate-to-role match score...',
  'Tailoring wording and positioning while preserving 100% of master content...'
];

const CVOptimizerPage = () => {
  const [searchParams] = useSearchParams();
  const initialCvId = searchParams.get('cvId') || '';

  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(initialCvId);

  // Job inputs
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [customVersionName, setCustomVersionName] = useState('');

  // Execution states
  const [optimizing, setOptimizing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [changes, setChanges] = useState([]);
  const [viewMode, setViewMode] = useState('diffs'); // 'diffs' | 'sideBySide'
  const [initLoading, setInitLoading] = useState(true);

  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const { data } = await api.get('/cvs');
        const list = data.cvs || [];
        setCvs(list);

        if (list.length > 0) {
          if (initialCvId && list.some(c => c._id === initialCvId)) {
            setSelectedCvId(initialCvId);
          } else if (!selectedCvId) {
            setSelectedCvId(list[0]._id);
          }
        }
      } catch (err) {
        toastError('Failed to load your CV Library.');
      } finally {
        setInitLoading(false);
      }
    };
    fetchCvs();
  }, [initialCvId]);

  const handleOptimize = async () => {
    if (!selectedCvId) {
      toastError('Please select a CV from your library first.');
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 40) {
      toastError('Please paste a substantive job description (at least 40 characters).');
      return;
    }

    setOptimizing(true);
    setStepIdx(0);

    const interval = setInterval(() => {
      setStepIdx(prev => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1400);

    try {
      const payload = {
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim(),
        jobUrl: jobUrl.trim(),
        versionName: customVersionName.trim()
      };

      const { data } = await api.post(`/cvs/${selectedCvId}/optimize`, payload);
      clearInterval(interval);
      setOptimizationResult(data);
      setChanges(data.changes || []);
      success('CV tailored & optimized successfully! All master content preserved.');
    } catch (err) {
      clearInterval(interval);
      toastError(err.response?.data?.message || 'Optimization failed. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const handleStatusChange = async (changeIdx, newStatus) => {
    const updated = [...changes];
    updated[changeIdx].status = newStatus;
    setChanges(updated);

    if (optimizationResult?.version?._id) {
      try {
        await api.put(`/analysis/changes/${optimizationResult.version._id}`, {
          changeIndex: changeIdx,
          status: newStatus
        });
      } catch (err) {
        console.warn('Failed to persist change status to server');
      }
    }
  };

  const handleTextEdit = (changeIdx, newText) => {
    const updated = [...changes];
    updated[changeIdx].after = newText;
    setChanges(updated);
    success('Edit updated locally.');
  };

  const handleReset = () => {
    setOptimizationResult(null);
    setChanges([]);
    setJobDescription('');
    setJobTitle('');
    setCompanyName('');
    setJobUrl('');
    setCustomVersionName('');
    setViewMode('diffs');
  };

  const selectedCv = cvs.find(c => c._id === selectedCvId);
  const masterCvData = selectedCv?.parsedData || optimizationResult?.originalMasterCv || {};
  const optimizedCvData = optimizationResult?.optimizedCv || {};

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading CV Optimizer...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Job-Specific CV Optimizer
        </h1>
        <p className="text-sm text-muted" style={{ marginTop: 4 }}>
          Select any Master CV from your library, paste a target job description, and tailor wording and emphasis without deleting or fabricating any content.
        </p>
      </div>

      {/* Zero Fabrication & Master CV Preservation Notice */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-4)', background: '#F0FDF4', color: '#166534',
        borderRadius: 'var(--radius)', border: '1px solid #BBF7D0', marginBottom: 'var(--space-6)',
        fontSize: 'var(--text-sm)', lineHeight: 1.5
      }}>
        <ShieldCheck size={26} style={{ flexShrink: 0 }} />
        <div>
          <strong>Non-Destructive & Zero-Fabrication Guarantee: </strong>
          Your Master CV is the permanent source of truth. All employers, positions, responsibilities, skills, and credentials are 100% preserved. The AI optimizer refines wording and highlights relevant competencies—it never invents claims or deletes substantive history.
        </div>
      </div>

      {!optimizationResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* STEP 1: Select a Saved CV */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff',
                    fontWeight: 700, fontSize: 'var(--text-xs)'
                  }}>
                    1
                  </span>
                  <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                    Select a Master CV from Your Library
                  </h2>
                </div>
                <p className="text-xs text-muted" style={{ marginLeft: 32, marginTop: 2 }}>
                  Pick the CV version you want to tailor for this specific position.
                </p>
              </div>

              <Link to="/cvs/upload" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Upload a New CV
              </Link>
            </div>

            {cvs.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                <FileText size={24} />
                <p>You have not uploaded any CVs yet.</p>
                <Link to="/cvs/upload" className="btn btn-primary btn-sm">
                  Upload Your First CV
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
                gap: 'var(--space-3)'
              }}>

                {cvs.map(cv => {
                  const isSelected = cv._id === selectedCvId;
                  return (
                    <div
                      key={cv._id}
                      onClick={() => setSelectedCvId(cv._id)}
                      style={{
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                        position: 'relative'
                      }}
                      className="card-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <FileText size={18} color={isSelected ? 'var(--primary)' : 'var(--muted)'} />
                          <h4 style={{
                            fontSize: 'var(--text-sm)', fontWeight: 700,
                            color: isSelected ? 'var(--primary-dark)' : 'var(--text)',
                            margin: 0
                          }}>
                            {cv.title}
                          </h4>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={18} color="var(--primary)" />
                        )}
                      </div>

                      {cv.targetRole && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{
                            fontSize: 'var(--text-xs)', fontWeight: 600,
                            background: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'var(--surface-2)',
                            color: isSelected ? 'var(--primary-dark)' : 'var(--text-secondary)',
                            padding: '2px 8px', borderRadius: 'var(--radius-full)'
                          }}>
                            {cv.targetRole}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>
                        <span>{cv.versionsCount || 1} version(s)</span>
                        <span>·</span>
                        <span>{new Date(cv.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 2: Target Job Details */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff',
                fontWeight: 700, fontSize: 'var(--text-xs)'
              }}>
                2
              </span>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                  Provide Target Job Description
                </h2>
                <p className="text-xs text-muted" style={{ margin: 0 }}>
                  Paste the full job posting requirements to align your CV with this specific role.
                </p>
              </div>
            </div>

            <div className="grid grid-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Title (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  disabled={optimizing}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Stripe, Revolut, etc."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  disabled={optimizing}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Job Description Text <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={9}
                placeholder="Paste the full job description text here, including requirements, qualifications, and responsibilities..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                disabled={optimizing}
              />
              <span className="form-hint">
                Provide as much context as possible (at least 40 characters) for accurate ATS matching.
              </span>
            </div>

            <div className="grid grid-2 gap-4" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Posting URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://company.com/careers/job-123"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  disabled={optimizing}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tailored Version Label (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`e.g. Optimized for ${jobTitle || 'Target Role'}`}
                  value={customVersionName}
                  onChange={e => setCustomVersionName(e.target.value)}
                  disabled={optimizing}
                />
              </div>
            </div>

            {/* Content Preservation Setting Control */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
              padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', marginBottom: 'var(--space-6)'
            }}>
              <input
                type="checkbox"
                id="preserveAllContent"
                checked={true}
                readOnly
                style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)' }}
              />
              <label htmlFor="preserveAllContent" style={{ fontSize: 'var(--text-sm)', cursor: 'default' }}>
                <strong style={{ color: 'var(--text)', display: 'block' }}>Preserve all CV content (Default: Active)</strong>
                <span style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>
                  Keep all substantive information from your original Master CV (all positions, responsibilities, achievements, skills, education, certifications, and projects) while tailoring wording and emphasis for this role.
                </span>
              </label>
            </div>

            {optimizing ? (
              <div className="ai-loading" style={{ margin: 'var(--space-4) 0' }}>
                <div className="ai-loading-spinner" />
                <div className="ai-loading-title">
                  {PROGRESS_STEPS[stepIdx]}
                </div>
                <div className="ai-loading-subtitle">
                  Tailoring your CV for <strong>{jobTitle || 'this job opportunity'}</strong> without generating synthetic or fabricated facts.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ minHeight: 46, width: '100%', maxWidth: 280 }}
                  onClick={handleOptimize}
                  disabled={!selectedCvId || !jobDescription.trim()}
                >
                  <Sparkles size={18} /> Optimize My CV
                </button>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Header Bar */}
          <div className="card" style={{ padding: 'var(--space-5)', background: 'var(--primary-light)', borderColor: '#C7D2FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 6 }}>
                  Optimization Complete
                </span>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                  {optimizationResult.version?.label || `Tailored Version v${optimizationResult.version?.versionNumber || 2}`}
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, margin: 0 }}>
                  A new dedicated CV version was created. Your original Master CV is <strong>intact and unmodified</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', width: '100%', maxWidth: 440 }}>
                <button type="button" className="btn btn-secondary btn-sm" style={{ flex: '1 1 140px', minHeight: 38 }} onClick={handleReset}>
                  <RotateCcw size={14} /> Optimize Another
                </button>
                <Link to={`/cvs/${selectedCvId}`} className="btn btn-primary btn-sm" style={{ flex: '1 1 180px', minHeight: 38 }}>
                  <Eye size={14} /> View & Export CV
                </Link>
              </div>
            </div>
          </div>


          {/* DEDICATED PRESERVED VS IMPROVED SECTION */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                Your CV Has Been Tailored
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4, margin: 0 }}>
                Your CV was optimized for this role while preserving the substantive content from your original Master CV.
              </p>
            </div>

            <div className="grid grid-2 gap-6">
              {/* Preserved Column */}
              <div style={{ padding: 'var(--space-4)', background: '#F0FDF4', borderRadius: 'var(--radius)', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <CheckCircle2 size={18} color="#166534" />
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: '#166534', margin: 0 }}>
                    Preserved from Master CV
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {(optimizationResult.preservedSections && optimizationResult.preservedSections.length > 0 ? optimizationResult.preservedSections : [
                    'Complete Professional Summary',
                    `${masterCvData.workExperience?.length || 0} Work Experience position(s)`,
                    `${(masterCvData.skills?.technical?.length || 0) + (masterCvData.skills?.soft?.length || 0)} Technical & Soft Skills`,
                    'Education & Degrees',
                    'Certifications & Credentials',
                    'Projects & Accomplishments',
                    'Additional Sections'
                  ]).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: '#166534', fontWeight: 600 }}>
                      <Check size={14} color="#166534" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improved Column */}
              <div style={{ padding: 'var(--space-4)', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px solid #C7D2FE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
                    Tailored for Target Role
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {(optimizationResult.improvedSections && optimizationResult.improvedSections.length > 0 ? optimizationResult.improvedSections : [
                    'Professional Summary wording & role alignment',
                    'Relevant experience positioning & active verbs',
                    'Job-specific keyword integration',
                    'Bullet point clarity & impact metrics',
                    'Skill prioritization for ATS indexing'
                  ]).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', fontWeight: 600 }}>
                      <Check size={14} color="var(--primary)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Match Score & Analysis Highlights */}
          {optimizationResult.matchResult && (
            <div className="grid grid-3 gap-6">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-6)' }}>
                <ScoreGauge score={optimizationResult.matchScore || optimizationResult.matchResult.overallScore || 0} size={150} />
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text)' }}>
                    {optimizationResult.matchResult.scoreLabel || 'AI Job Match Score'}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                    Estimated alignment based on supplied CV and Job Description
                  </div>
                </div>
              </div>

              <div className="card grid-span-2" style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>

                  <Lightbulb size={18} color="var(--primary)" />
                  AI Optimization Summary
                </h3>
                <p className="text-xs text-muted mb-4">
                  Key areas targeted in this tailored version to elevate your alignment with the employer's expectations.
                </p>

                {optimizationResult.matchResult.recommendations && optimizationResult.matchResult.recommendations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {optimizationResult.matchResult.recommendations.slice(0, 4).map((rec, idx) => {
                      if (typeof rec === 'string') {
                        return (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
                            padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'
                          }}>
                            <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>{rec}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'
                        }}>
                          <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{rec.title || rec.description}</span>
                              {rec.priority && (
                                <span className={`badge ${rec.priority === 'High' ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                                  {rec.priority}
                                </span>
                              )}
                            </div>
                            {rec.title && rec.description && (
                              <div style={{ color: 'var(--muted)', marginTop: 2 }}>{rec.description}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    Resume bullet points refined for stronger impact metrics and alignment.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills Breakdown (Matching, Partial, and Not Evidenced in CV) */}
          {optimizationResult.matchResult && (
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text)', marginBottom: 'var(--space-4)' }}>
                Job Requirements & Competencies Analysis
              </h2>
              <SkillsBreakdown
                matchedSkills={optimizationResult.matchResult.matchedSkills || []}
                partialMatches={optimizationResult.matchResult.partialMatches || []}
                missingSkills={optimizationResult.matchResult.missingSkills || []}
              />
            </div>
          )}

          {/* View Mode Toggle Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                Tailored CV Review
              </h2>
              <p className="text-xs text-muted" style={{ margin: 0 }}>
                Inspect proposed improvements individually or compare Master CV vs Tailored CV side by side.
              </p>
            </div>

            <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 'var(--radius)', flexWrap: 'wrap', width: '100%', maxWidth: 460 }}>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'diffs' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '6px 12px', flex: '1 1 auto', minHeight: 38 }}
                onClick={() => setViewMode('diffs')}
              >
                <Layers size={14} /> Diffs ({changes.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'sideBySide' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '6px 12px', flex: '1 1 auto', minHeight: 38 }}
                onClick={() => setViewMode('sideBySide')}
              >
                <Columns size={14} /> Master vs Tailored
              </button>
            </div>
          </div>


          {/* View Mode 1: Proposed Improvements Diffs */}
          {viewMode === 'diffs' && (
            <div>
              {changes.length === 0 ? (
                <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                  <p className="text-sm text-muted">Your CV already possesses high alignment for this role. No phrasing modifications were necessary.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {changes.map((chg, idx) => (
                    <BeforeAfterCard
                      key={idx}
                      change={chg}
                      index={idx}
                      onStatusChange={handleStatusChange}
                      onTextEdit={handleTextEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Mode 2: Section-by-Section Side-by-Side Comparison */}
          {viewMode === 'sideBySide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Professional Summary Comparison */}
              <div className="card" style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                  Professional Summary
                </h3>
                <div className="grid grid-2 gap-4">
                  <div style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Master CV (Original)
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                      {masterCvData.professionalSummary || 'No summary in original CV.'}
                    </p>
                  </div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px solid #C7D2FE' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Tailored CV (Role-Optimized)
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-dark)', margin: 0, lineHeight: 1.6 }}>
                      {optimizedCvData.professionalSummary || masterCvData.professionalSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Experience Comparison */}
              <div className="card" style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                  Work Experience Positions ({masterCvData.workExperience?.length || 0} Total)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {(masterCvData.workExperience || []).map((mJob, idx) => {
                    const oJob = (optimizedCvData.workExperience || [])[idx] || mJob;
                    return (
                      <div key={idx} style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)', marginBottom: 8 }}>
                          {mJob.company} — {mJob.jobTitle}
                        </div>
                        <div className="grid grid-2 gap-4">
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                              Master Bullet Points
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                              {(mJob.responsibilities || []).map((r, rIdx) => (
                                <li key={rIdx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>
                              Tailored Bullet Points
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.6 }}>
                              {(oJob.responsibilities || []).map((r, rIdx) => (
                                <li key={rIdx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Experience Comparison (if projects exist) */}
              {((masterCvData.projectExperience && masterCvData.projectExperience.length > 0) || (masterCvData.projects && masterCvData.projects.length > 0)) && (
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                    Project Experience ({((masterCvData.projectExperience || masterCvData.projects) || []).length} Total)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {((masterCvData.projectExperience || masterCvData.projects) || []).map((mProj, idx) => {
                      const oProjects = optimizedCvData.projectExperience || optimizedCvData.projects || [];
                      const oProj = oProjects[idx] || mProj;
                      return (
                        <div key={idx} style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)', marginBottom: 4 }}>
                            {mProj.name} {mProj.role ? `— ${mProj.role}` : ''}
                          </div>
                          {mProj.technologies?.length > 0 && (
                            <div style={{ fontSize: '11px', color: 'var(--primary)', marginBottom: 8, fontWeight: 600 }}>
                              {mProj.technologies.join(', ')}
                            </div>
                          )}
                          <div className="grid grid-2 gap-4">
                            <div>
                              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                                Master Description & Achievements
                              </div>
                              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {mProj.description}
                              </p>
                              {mProj.achievements?.length > 0 && (
                                <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                  {mProj.achievements.map((a, aIdx) => <li key={aIdx}>{a}</li>)}
                                </ul>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>
                                Tailored Description & Achievements
                              </div>
                              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.6 }}>
                                {oProj.description || mProj.description}
                              </p>
                              {(oProj.achievements || mProj.achievements)?.length > 0 && (
                                <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.6 }}>
                                  {(oProj.achievements || mProj.achievements).map((a, aIdx) => <li key={aIdx}>{a}</li>)}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skills Prioritization Comparison */}
              <div className="card" style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                  Technical Skills & Competencies
                </h3>
                <div className="grid grid-2 gap-4">
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Master Skills List ({masterCvData.skills?.technical?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(masterCvData.skills?.technical || []).map((s, idx) => (
                        <span key={idx} className="badge badge-neutral">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Role-Prioritized Skills List ({optimizedCvData.skills?.technical?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(optimizedCvData.skills?.technical || masterCvData.skills?.technical || []).map((s, idx) => (
                        <span key={idx} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Export Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: '1 1 180px', minHeight: 44 }} onClick={handleReset}>
              <RotateCcw size={15} /> Tailor Another Position
            </button>
            <Link to={`/cvs/${selectedCvId}`} className="btn btn-primary btn-lg" style={{ flex: '1 1 240px', minHeight: 44 }}>
              <Eye size={16} /> View & Export Tailored CV <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


export default CVOptimizerPage;
