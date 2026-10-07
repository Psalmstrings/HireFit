import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import FileUploader from '../../components/cv/FileUploader';
import CVEditor from '../../components/cv/CVEditor';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const loadingSteps = [
  'Reading and validating your document...',
  'Extracting raw text from document structure...',
  'Analyzing work history and accomplishments...',
  'Categorizing technical skills, tools, and education...',
  'Preparing your structured CV profile...'
];

const CVUploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [parsedResult, setParsedResult] = useState(null);
  const [createdCvId, setCreatedCvId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleUploadAndParse = async () => {
    if (!file) {
      toastError('Please select a CV document to upload.');
      return;
    }

    setUploading(true);
    setCurrentStepIdx(0);

    // Step cycle animation
    const interval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim() || file.name.replace(/\.[^/.]+$/, ''));
    if (targetRole.trim()) {
      formData.append('targetRole', targetRole.trim());
    }

    try {
      const { data } = await api.post('/cvs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setParsedResult(data.cv.parsedData);
      setCreatedCvId(data.cv.id);
      success('CV parsed successfully! Please review the extracted information below.');
    } catch (err) {
      clearInterval(interval);
      toastError(err.response?.data?.message || 'Failed to upload and parse CV.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveVerifiedData = async (updatedData) => {
    if (!createdCvId) return;
    setSavingEdit(true);
    try {
      await api.put(`/cvs/${createdCvId}`, { parsedData: updatedData });
      success('CV profile verified and saved!');
      navigate(`/cvs/${createdCvId}`);
    } catch (err) {
      toastError('Failed to save CV changes.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {parsedResult ? 'Review Extracted Information' : 'Upload Your Existing CV'}
        </h1>
        <p className="text-sm text-muted">
          {parsedResult
            ? 'We extracted your details into structured fields. Verify that everything is accurate before continuing.'
            : 'Upload your CV in PDF or Word format to extract your genuine experience, skills, and credentials.'}
        </p>
      </div>

      {!parsedResult ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div className="grid grid-2 gap-4" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">CV Name / Label</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Backend Developer CV"
                disabled={uploading}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Role / Specialization (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Node.js / Python Backend Engineer"
                disabled={uploading}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <FileUploader
              onFileSelect={setFile}
              uploading={uploading}
            />
          </div>

          {uploading ? (
            <div className="ai-loading">
              <div className="ai-loading-spinner" />
              <div className="ai-loading-title">
                {loadingSteps[currentStepIdx]}
              </div>
              <div className="ai-loading-subtitle">
                Our parser is analyzing your real achievements without inventing data.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleUploadAndParse}
                disabled={!file}
              >
                <Sparkles size={16} /> Parse CV with AI
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)', background: 'var(--success-light)',
            color: 'var(--success)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-sm)', fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            Extraction complete! Make any needed edits below, then click "Save Changes".
          </div>

          <CVEditor
            initialData={parsedResult}
            onSave={handleSaveVerifiedData}
            isSaving={savingEdit}
          />
        </div>
      )}
    </div>
  );
};

export default CVUploadPage;
