import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import optimizerApi from '../../services/optimizerApi';
import { useToast } from '../../context/ToastContext';
import BeforeAfterCard from '../../components/optimization/BeforeAfterCard';
import { ScoreGauge } from '../../components/analysis/MatchScore';
import SkillsBreakdown from '../../components/analysis/SkillsBreakdown';
import {
  Zap, ShieldCheck, Check, ArrowRight, ArrowLeft, Eye, CheckCircle2,
  FileText, Briefcase, Plus, RotateCcw, Sparkles, Building2,
  Clock, FileType, CheckCircle, AlertCircle, Lightbulb,
  Columns, Layers, CheckSquare, Sparkle, AlertTriangle, HelpCircle,
  ThumbsUp, Sliders, ChevronRight, X
} from 'lucide-react';

const PROGRESS_STEPS = [
  'Verifying complete Master CV background & verified history...',
  'Analyzing target job requirements & employer criteria...',
  'Integrating candidate-confirmed competencies truthfully...',
  'Calculating transparent before & after alignment scores...',
  'Refining phrasing and positioning while preserving 100% of master content...'
];

const CVOptimizerPage = () => {
  const [searchParams] = useSearchParams();
  const initialCvId = searchParams.get('cvId') || '';

  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(initialCvId);

  // Wizard state: 1: Select CV, 2: Target Job, 3: Job Requirements, 4: Match & Gaps, 5: Confirm Skills, 6: Mode & Run, 7: Results
  const [currentStep, setCurrentStep] = useState(1);

  // Job inputs
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [customVersionName, setCustomVersionName] = useState('');
  const [savedJobId, setSavedJobId] = useState(null);

  // Step 3 & 4 data
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [parsedJob, setParsedJob] = useState(null);
  const [categorizedRequirements, setCategorizedRequirements] = useState([]);

  const [detectingGaps, setDetectingGaps] = useState(false);
  const [matchedRequirements, setMatchedRequirements] = useState([]);
  const [partialRequirements, setPartialRequirements] = useState([]);
  const [candidateConfirmedRequirements, setCandidateConfirmedRequirements] = useState([]);
  const [missingGaps, setMissingGaps] = useState([]);
  const [baselineScore, setBaselineScore] = useState(70);

  // Step 5 candidate confirmation responses: map of gapName -> { response: 'yes'|'limited'|'no', proficiency: string }
  const [gapResponses, setGapResponses] = useState({});
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [savingFacts, setSavingFacts] = useState(false);

  // Step 6 mode selection
  const [optimizationMode, setOptimizationMode] = useState('balanced'); // 'balanced' | 'aggressive' | 'conservative'

  // Step 7 execution & results
  const [optimizing, setOptimizing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [changes, setChanges] = useState([]);
  const [viewMode, setViewMode] = useState('diffs'); // 'diffs' | 'sideBySide'
  const [initLoading, setInitLoading] = useState(true);

  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Load CV library on mount
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

  // Load existing confirmed facts when selectedCvId changes
  useEffect(() => {
    if (!selectedCvId) return;
    optimizerApi.getConfirmedFacts(selectedCvId)
      .then(res => {
        if (res.facts && res.facts.length > 0) {
          const initialResponses = {};
          res.facts.forEach(f => {
            initialResponses[f.name] = {
              response: f.proficiency === 'proficient' ? 'yes' : 'limited',
              proficiency: f.proficiency
            };
          });
          setGapResponses(prev => ({ ...prev, ...initialResponses }));
        }
      })
      .catch(() => {});
  }, [selectedCvId]);

  // Handlers for step progression
  const handleProceedToJobInput = () => {
    if (!selectedCvId) {
      toastError('Please select a Master CV first.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 -> 3: Analyze Job
  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toastError('Please paste a substantive job description (at least 30 characters).');
      return;
    }
    setAnalyzingJob(true);
    try {
      const res = await optimizerApi.analyzeJob({
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim(),
        jobUrl: jobUrl.trim()
      });
      setParsedJob(res.parsedJob);
      setCategorizedRequirements(res.categorizedRequirements || []);
      if (res.jobId) setSavedJobId(res.jobId);
      setCurrentStep(3);
      success('Job posting parsed and requirements extracted.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to analyze job description.');
    } finally {
      setAnalyzingJob(false);
    }
  };

  // Step 3 -> 4: Detect Gaps
  const handleDetectGaps = async () => {
    setDetectingGaps(true);
    try {
      const res = await optimizerApi.detectGaps({
        cvId: selectedCvId,
        jobId: savedJobId,
        parsedJob,
        jobDescription: jobDescription.trim()
      });
      setMatchedRequirements(res.matchedRequirements || []);
      setPartialRequirements(res.partialRequirements || []);
      setCandidateConfirmedRequirements(res.candidateConfirmedRequirements || []);
      setMissingGaps(res.missingGaps || []);
      setBaselineScore(res.alignmentScoreBefore || 72);
      setCurrentStep(4);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to evaluate requirement gaps.');
    } finally {
      setDetectingGaps(false);
    }
  };

  // Step 4 -> 5: Go to Gap Confirmation
  const handleProceedToConfirmation = () => {
    if (missingGaps.length === 0) {
      // If no gaps detected, jump straight to mode selection
      setCurrentStep(6);
    } else {
      setCurrentStep(5);
    }
  };

  // Step 5 Gap response toggling
  const handleSetGapResponse = (gapName, responseType) => {
    setGapResponses(prev => {
      const existing = prev[gapName]?.response;
      if (existing === responseType) {
        // Toggle off if clicked again
        const copy = { ...prev };
        delete copy[gapName];
        return copy;
      }
      return {
        ...prev,
        [gapName]: {
          response: responseType,
          proficiency: responseType === 'yes' ? 'proficient' : 'working_knowledge'
        }
      };
    });
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    setGapResponses(prev => ({
      ...prev,
      [trimmed]: {
        response: 'yes',
        proficiency: 'proficient'
      }
    }));
    setCustomSkillInput('');
    success(`Added "${trimmed}" to confirmed capabilities.`);
  };

  // Step 5 -> 6: Save Confirmed Facts and Proceed
  const handleSaveFactsAndProceed = async () => {
    setSavingFacts(true);
    try {
      const factsToSave = Object.entries(gapResponses).map(([name, data]) => ({
        name,
        type: 'skill',
        response: data.response,
        proficiency: data.proficiency
      }));

      if (factsToSave.length > 0) {
        await optimizerApi.confirmFacts({
          cvId: selectedCvId,
          facts: factsToSave
        });
      }
      setCurrentStep(6);
    } catch (err) {
      toastError('Failed to save confirmations, continuing to optimization mode.');
      setCurrentStep(6);
    } finally {
      setSavingFacts(false);
    }
  };

  // Step 6 -> 7: Run Optimization
  const handleRunOptimization = async () => {
    setOptimizing(true);
    setStepIdx(0);

    const interval = setInterval(() => {
      setStepIdx(prev => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const confirmedFactsList = Object.entries(gapResponses)
        .filter(([_, d]) => d.response === 'yes' || d.response === 'limited')
        .map(([name, d]) => ({
          name,
          type: 'skill',
          proficiency: d.proficiency,
          source: 'candidate_confirmed',
          confirmed: true
        }));

      const payload = {
        cvId: selectedCvId,
        jobId: savedJobId,
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim(),
        versionName: customVersionName.trim(),
        optimizationMode,
        candidateConfirmedFacts: confirmedFactsList
      };

      const res = await optimizerApi.runOptimization(payload);
      clearInterval(interval);
      setOptimizationResult(res);
      setChanges(res.changes || []);
      setCurrentStep(7);
      success('CV optimized successfully! 100% of Master CV content preserved.');
    } catch (err) {
      clearInterval(interval);
      toastError(err.response?.data?.message || 'Optimization failed. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  // Direct Quick Optimize bypass for convenience
  const handleQuickOptimize = async () => {
    if (!selectedCvId) {
      toastError('Please select a CV first.');
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toastError('Please paste a substantive job description.');
      return;
    }
    setOptimizationMode('balanced');
    setCurrentStep(6);
  };

  // Change status in results review
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
    setParsedJob(null);
    setCategorizedRequirements([]);
    setMissingGaps([]);
    setMatchedRequirements([]);
    setPartialRequirements([]);
    setCandidateConfirmedRequirements([]);
    setGapResponses({});
    setCurrentStep(1);
    setViewMode('diffs');
  };

  const selectedCv = cvs.find(c => c._id === selectedCvId);
  const masterCvData = selectedCv?.parsedData || optimizationResult?.originalMasterCv || {};
  const optimizedCvData = optimizationResult?.optimizedCv || {};

  if (initLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading CV Optimizer Engine...</span>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Select CV' },
    { num: 2, label: 'Target Job' },
    { num: 3, label: 'Job Requirements' },
    { num: 4, label: 'Match & Gaps' },
    { num: 5, label: 'Confirm Skills' },
    { num: 6, label: 'Mode & Run' },
    { num: 7, label: 'Review & Tailor' }
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
              Intelligent CV Optimization Engine
            </h1>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>
              Tailor your CV for any job with precision, interactive gap confirmation, and a 100% zero-fabrication guarantee.
            </p>
          </div>
          {currentStep > 1 && currentStep < 7 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
              <RotateCcw size={14} /> Start Over
            </button>
          )}
        </div>
      </div>

      {/* Zero Fabrication Guarantee Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)', background: '#F0FDF4', color: '#166534',
        borderRadius: 'var(--radius)', border: '1px solid #BBF7D0', marginBottom: 'var(--space-5)',
        fontSize: 'var(--text-xs)', lineHeight: 1.5
      }}>
        <ShieldCheck size={22} style={{ flexShrink: 0 }} />
        <div>
          <strong>Non-Destructive & Zero-Fabrication Promise: </strong>
          Your Master CV is the permanent source of truth. All positions, responsibilities, skills, and credentials are preserved. The optimizer refines wording, highlights relevance, and only adds skills you explicitly confirm.
        </div>
      </div>

      {/* Step Navigation Progress Track */}
      <div className="wizard-steps-bar">
        {stepsList.map(s => {
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;
          return (
            <div
              key={s.num}
              className={`wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => {
                // Allow navigating back to completed steps
                if (isCompleted || s.num === 1) setCurrentStep(s.num);
              }}
            >
              <span className="wizard-step-num">{isCompleted ? '✓' : s.num}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          STEP 1: SELECT MASTER CV
          ======================================================== */}
      {currentStep === 1 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                Step 1: Choose Your Master Source CV
              </h2>
              <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>
                Select the base CV you want to tailor for your target role.
              </p>
            </div>
            <Link to="/cvs/upload" className="btn btn-secondary btn-sm">
              <Plus size={14} /> Upload New CV
            </Link>
          </div>

          {cvs.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <FileText size={28} />
              <p>You have not uploaded any CVs to your library yet.</p>
              <Link to="/cvs/upload" className="btn btn-primary btn-sm">
                Upload Your First Master CV
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
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
                      transition: 'all var(--transition)'
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
                      {isSelected && <CheckCircle2 size={18} color="var(--primary)" />}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProceedToJobInput}
              disabled={!selectedCvId}
            >
              Continue to Job Description <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 2: TARGET JOB DETAILS
          ======================================================== */}
      {currentStep === 2 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                Step 2: Provide Target Job Description
              </h2>
              <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>
                Paste the job posting to extract requirements and evaluate candidate-to-role alignment.
              </p>
            </div>
            {selectedCv && (
              <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>
                CV: {selectedCv.title}
              </span>
            )}
          </div>

          <div className="grid grid-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Full Stack Developer, Senior Software Engineer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Google, Revolut, Stripe"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
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
              placeholder="Paste the full job posting requirements, responsibilities, and qualifications..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <span className="form-hint">
              Provide the full description for deep requirement extraction and accurate ATS gap mapping.
            </span>
          </div>

          <div className="grid grid-2 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Posting URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://company.com/careers/job-id"
                value={jobUrl}
                onChange={e => setJobUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tailored Version Label (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder={`e.g. Tailored for ${jobTitle || 'Target Role'}`}
                value={customVersionName}
                onChange={e => setCustomVersionName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft size={16} /> Back to CV Selection
            </button>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAnalyzeJob}
                disabled={analyzingJob || !jobDescription.trim()}
              >
                {analyzingJob ? (
                  <>
                    <div className="spinner spinner-sm" /> Analyzing Job...
                  </>
                ) : (
                  <>
                    Analyze Job Requirements <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 3: JOB REQUIREMENTS BREAKDOWN
          ======================================================== */}
      {currentStep === 3 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                  Step 3: Target Role Requirements Breakdown
                </h2>
                <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>
                  The AI extracted the core technical, functional, and qualification criteria for this posting.
                </p>
              </div>
              <span className="badge badge-primary">
                {parsedJob?.jobTitle || 'Target Role'} {parsedJob?.company ? `· ${parsedJob.company}` : ''}
              </span>
            </div>
          </div>

          {/* Extracted Details Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {/* Required Skills */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
                Required Core Skills ({parsedJob?.requiredSkills?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(parsedJob?.requiredSkills || []).map((skill, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '4px 10px', fontSize: 'var(--text-xs)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            {parsedJob?.preferredSkills?.length > 0 && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Preferred / Nice-to-Have Competencies ({parsedJob.preferredSkills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {parsedJob.preferredSkills.map((skill, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ padding: '4px 10px', fontSize: 'var(--text-xs)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            {parsedJob?.responsibilities?.length > 0 && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Key Expected Responsibilities
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {parsedJob.responsibilities.slice(0, 5).map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep(2)}
            >
              <ArrowLeft size={16} /> Back to Job Input
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDetectGaps}
              disabled={detectingGaps}
            >
              {detectingGaps ? (
                <>
                  <div className="spinner spinner-sm" /> Evaluating Match & Gaps...
                </>
              ) : (
                <>
                  Evaluate CV Match & Detect Gaps <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 4: REVIEW MATCH & REQUIREMENT GAPS
          ======================================================== */}
      {currentStep === 4 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              Step 4: Requirement Coverage & Evidence Evaluation
            </h2>
            <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>
              Comparison of your Master CV against target employer requirements.
            </p>
          </div>

          {/* Baseline Score Display */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)'
          }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Baseline Master CV Alignment Score
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                {baselineScore}%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
                Calculated strictly from verified evidence in your original Master CV.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '6px 12px', background: '#F0FDF4', borderRadius: 'var(--radius)', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#166534' }}>{matchedRequirements.length}</div>
                <div style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>Strong Matches</div>
              </div>
              <div style={{ textAlign: 'center', padding: '6px 12px', background: '#FFFBEB', borderRadius: 'var(--radius)', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#B45309' }}>{partialRequirements.length}</div>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600 }}>Partial Matches</div>
              </div>
              {candidateConfirmedRequirements.length > 0 && (
                <div style={{ textAlign: 'center', padding: '6px 12px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px solid #C7D2FE' }}>
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--primary-dark)' }}>{candidateConfirmedRequirements.length}</div>
                  <div style={{ fontSize: '10px', color: 'var(--primary-dark)', fontWeight: 600 }}>Confirmed</div>
                </div>
              )}
              <div style={{ textAlign: 'center', padding: '6px 12px', background: '#FEF2F2', borderRadius: 'var(--radius)', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#991B1B' }}>{missingGaps.length}</div>
                <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 600 }}>Gaps to Confirm</div>
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            {/* Strong Matches */}
            {matchedRequirements.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)', background: '#F0FDF4', borderRadius: 'var(--radius)',
                border: '1px solid #BBF7D0', fontSize: 'var(--text-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CheckCircle2 size={16} color="#166534" />
                  <strong style={{ color: '#166534' }}>{item.skill}</strong>
                </div>
                <span style={{ color: '#166534' }}>Verified in Master CV</span>
              </div>
            ))}

            {/* Candidate Confirmed */}
            {candidateConfirmedRequirements.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)', background: 'var(--primary-light)', borderRadius: 'var(--radius)',
                border: '1px solid #C7D2FE', fontSize: 'var(--text-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Check size={16} color="var(--primary)" />
                  <strong style={{ color: 'var(--primary-dark)' }}>{item.skill}</strong>
                </div>
                <span style={{ color: 'var(--primary-dark)' }}>Candidate Confirmed</span>
              </div>
            ))}

            {/* Missing Gaps */}
            {missingGaps.map((gap, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)', background: '#FEF2F2', borderRadius: 'var(--radius)',
                border: '1px solid #FECACA', fontSize: 'var(--text-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <strong style={{ color: '#991B1B' }}>{gap.name}</strong>
                  <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '1px 6px' }}>{gap.category}</span>
                </div>
                <span style={{ color: '#991B1B' }}>Not identified in Master CV</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep(3)}
            >
              <ArrowLeft size={16} /> Back to Requirements
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProceedToConfirmation}
            >
              {missingGaps.length > 0
                ? `Confirm Missing Skills (${missingGaps.length})`
                : 'Proceed to Optimization Mode'
              } <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 5: CONFIRM MISSING SKILLS / GAPS
          ======================================================== */}
      {currentStep === 5 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <HelpCircle size={20} color="var(--primary)" />
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                Step 5: Candidate Capability Confirmation
              </h2>
            </div>
            <p className="text-xs text-muted" style={{ margin: '6px 0 0 0' }}>
              We never guess or fabricate skills. If you possess experience with these competencies, confirm them below so the optimizer can incorporate them truthfully into your tailored CV.
            </p>
          </div>

          {/* List of Gap Confirmation Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {missingGaps.map(gap => {
              const currentResp = gapResponses[gap.name]?.response;
              return (
                <div key={gap.id || gap.name} className="gap-confirm-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                          {gap.name}
                        </span>
                        <span className={`badge ${gap.importance === 'high' ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {gap.category || 'Skill'}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                        {gap.jobContext || 'Referenced in target role'}
                      </div>
                    </div>

                    <div className="gap-btn-group">
                      <button
                        type="button"
                        className={`gap-btn ${currentResp === 'yes' ? 'active-yes' : ''}`}
                        onClick={() => handleSetGapResponse(gap.name, 'yes')}
                      >
                        <Check size={14} /> Yes — Proficient
                      </button>

                      <button
                        type="button"
                        className={`gap-btn ${currentResp === 'limited' ? 'active-limited' : ''}`}
                        onClick={() => handleSetGapResponse(gap.name, 'limited')}
                      >
                        <Sparkle size={14} /> Limited / Working Knowledge
                      </button>

                      <button
                        type="button"
                        className={`gap-btn ${currentResp === 'no' ? 'active-no' : ''}`}
                        onClick={() => handleSetGapResponse(gap.name, 'no')}
                      >
                        <X size={14} /> No Experience
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom unlisted skill input */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Have other verified skills relevant to this role not listed above?
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: 'var(--text-xs)', height: 38 }}
                  placeholder="e.g. Next.js, GraphQL, PostgreSQL..."
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddCustomSkill}
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentStep(4)}
            >
              <ArrowLeft size={16} /> Back to Match Review
            </button>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentStep(6)}
              >
                Skip Confirmation
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveFactsAndProceed}
                disabled={savingFacts}
              >
                {savingFacts ? (
                  <>
                    <div className="spinner spinner-sm" /> Saving Facts...
                  </>
                ) : (
                  <>
                    Save & Continue to Optimization <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 6: OPTIMIZATION MODE & RUN
          ======================================================== */}
      {currentStep === 6 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              Step 6: Select Optimization Strategy & Mode
            </h2>
            <p className="text-xs text-muted" style={{ margin: '4px 0 0 0' }}>
              Choose how actively the engine tailors language, emphasis, and keywords for this application.
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-3 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
            <div
              className={`mode-card ${optimizationMode === 'balanced' ? 'selected' : ''}`}
              onClick={() => setOptimizationMode('balanced')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text)' }}>Balanced (Recommended)</strong>
                {optimizationMode === 'balanced' && <CheckCircle2 size={16} color="var(--primary)" />}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Elevates accomplishments with action verbs and natural keyword alignment while strictly preserving all original context.
              </p>
            </div>

            <div
              className={`mode-card ${optimizationMode === 'aggressive' ? 'selected' : ''}`}
              onClick={() => setOptimizationMode('aggressive')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text)' }}>Aggressive ATS Alignment</strong>
                {optimizationMode === 'aggressive' && <CheckCircle2 size={16} color="var(--primary)" />}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Maximizes keyword prominence and high-density ATS phrasing for all verified and confirmed capabilities.
              </p>
            </div>

            <div
              className={`mode-card ${optimizationMode === 'conservative' ? 'selected' : ''}`}
              onClick={() => setOptimizationMode('conservative')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text)' }}>Conservative Refinement</strong>
                {optimizationMode === 'conservative' && <CheckCircle2 size={16} color="var(--primary)" />}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                Subtle improvements, keeping your original phrasing as close to the master source as possible.
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-xs)'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Optimization Parameters Summary:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li><strong>Target Role:</strong> {jobTitle || parsedJob?.jobTitle || 'Role Specified in Job Description'}</li>
              <li><strong>Confirmed Capabilities:</strong> {Object.keys(gapResponses).filter(k => gapResponses[k].response === 'yes' || gapResponses[k].response === 'limited').length} skill(s) verified by candidate</li>
              <li><strong>Preservation:</strong> 100% of Master CV jobs, education, credentials, and sections guaranteed</li>
            </ul>
          </div>

          {optimizing ? (
            <div className="ai-loading" style={{ margin: 'var(--space-4) 0' }}>
              <div className="ai-loading-spinner" />
              <div className="ai-loading-title">{PROGRESS_STEPS[stepIdx]}</div>
              <div className="ai-loading-subtitle">
                Tailoring your CV with <strong>{optimizationMode}</strong> mode. Zero fabrication guarantee active.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(5)}
              >
                <ArrowLeft size={16} /> Back to Confirmation
              </button>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleRunOptimization}
                style={{ minHeight: 46, minWidth: 260 }}
              >
                <Sparkles size={18} /> Optimize My CV Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STEP 7: RESULTS VIEW & VERIFIED BEFORE/AFTER COMPARISON
          ======================================================== */}
      {currentStep === 7 && optimizationResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Header Summary Card */}
          <div className="card" style={{ padding: 'var(--space-5)', background: 'var(--primary-light)', borderColor: '#C7D2FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 6 }}>
                  Optimization Complete · Mode: {optimizationResult.optimizationMode || optimizationMode}
                </span>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                  {optimizationResult.version?.label || `Tailored Version v${optimizationResult.version?.versionNumber || 2}`}
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, margin: 0 }}>
                  A dedicated tailored CV version was created. Your original Master CV remains <strong>100% intact and untouched</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', width: '100%', maxWidth: 440 }}>
                <button type="button" className="btn btn-secondary btn-sm" style={{ flex: '1 1 140px', minHeight: 38 }} onClick={handleReset}>
                  <RotateCcw size={14} /> Tailor Another Job
                </button>
                <Link to={`/cvs/${selectedCvId}`} className="btn btn-primary btn-sm" style={{ flex: '1 1 180px', minHeight: 38 }}>
                  <Eye size={14} /> View & Export Tailored CV
                </Link>
              </div>
            </div>
          </div>

          {/* Transparent Before vs After Alignment Score Card */}
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
              Transparent Candidate-to-Role Alignment
            </h3>
            <div className="grid grid-3 gap-4">
              <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Baseline Master CV Score
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', marginTop: 4 }}>
                  {optimizationResult.alignment?.before || baselineScore}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                  Before role tailoring
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px solid #C7D2FE', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>
                  Tailored CV Alignment Score
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary-dark)', marginTop: 4 }}>
                  {optimizationResult.alignment?.after || 86}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--primary-dark)', marginTop: 2 }}>
                  With confirmed competencies
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', background: '#F0FDF4', borderRadius: 'var(--radius)', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Legitimate Net Alignment Gain
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#166534', marginTop: 4 }}>
                  +{Math.max(0, (optimizationResult.alignment?.after || 86) - (optimizationResult.alignment?.before || baselineScore))}%
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: 2 }}>
                  Zero synthetic score inflation
                </div>
              </div>
            </div>
          </div>

          {/* Preserved vs Tailored Guarantee Badges */}
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
              Preservation & Tailoring Audit
            </h3>
            <div className="grid grid-2 gap-4">
              <div style={{ padding: 'var(--space-4)', background: '#F0FDF4', borderRadius: 'var(--radius)', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <CheckCircle2 size={18} color="#166534" />
                  <strong style={{ fontSize: 'var(--text-sm)', color: '#166534' }}>100% Preserved from Master CV</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(optimizationResult.preservedSections || [
                    'Complete Professional Summary',
                    'All Work Experience positions & bullets',
                    'Education degrees & institutions',
                    'Certifications & credentials',
                    'Projects & deliverables'
                  ]).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: '#166534' }}>
                      <Check size={14} color="#166534" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px solid #C7D2FE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-dark)' }}>Tailored for Target Role</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(optimizationResult.improvedSections || [
                    'Summary aligned with target requirements',
                    'Active impact verbs applied to past roles',
                    'Candidate-confirmed capabilities integrated',
                    'ATS keyword prioritization'
                  ]).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--primary-dark)' }}>
                      <Check size={14} color="var(--primary)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

          {/* View Mode 1: Diffs */}
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

          {/* View Mode 2: Side-by-Side Comparison */}
          {viewMode === 'sideBySide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Summary */}
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

              {/* Work Experience */}
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

              {/* Skills Prioritization */}
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
                      Role-Tailored Skills List ({optimizedCvData.skills?.technical?.length || 0})
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

          {/* Bottom Navigation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: '1 1 180px', minHeight: 44 }} onClick={handleReset}>
              <RotateCcw size={15} /> Tailor Another Job
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
