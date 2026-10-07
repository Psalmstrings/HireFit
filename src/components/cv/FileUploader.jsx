import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUploader = ({
  onFileSelect,
  accept = '.pdf,.docx,.doc',
  label = 'Drag & drop your CV here',
  sublabel = 'Supports PDF and Word (.docx) documents up to 10MB',
  uploading = false,
  error = null
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = useCallback((file) => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const allowedExts = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      alert('Unsupported file type. Please upload a PDF or Word document.');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  }, [handleFile]);

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      {selectedFile ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-lg)',
            background: 'var(--primary-light)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0
          }}>
            <FileText size={22} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedFile.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              {formatSize(selectedFile.size)} · Ready to upload
            </div>
          </div>
          {!uploading && (
            <button className="btn btn-icon btn-ghost" onClick={clearFile} aria-label="Remove file">
              <X size={16} />
            </button>
          )}
          {uploading && <div className="spinner" />}
        </div>
      ) : (
        <label
          className={`file-upload-zone${dragOver ? ' drag-over' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          htmlFor="file-upload-input"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-upload-input')?.click()}
        >
          <div className="file-upload-icon">
            <Upload size={22} />
          </div>
          <h3>{label}</h3>
          <p>{sublabel}</p>
          <span className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
            Browse Files
          </span>
          <input
            id="file-upload-input"
            type="file"
            accept={accept}
            onChange={handleChange}
            style={{ display: 'none' }}
            aria-label="Upload document file"
          />
        </label>
      )}

      {error && (
        <div className="form-error" style={{ marginTop: 'var(--space-2)' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
