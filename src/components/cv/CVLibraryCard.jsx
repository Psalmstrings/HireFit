import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Zap, Eye, Download, MoreVertical,
  Edit3, Trash2, CheckCircle2, Clock, FileType
} from 'lucide-react';

const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'text/plain': 'TXT'
};

const getFileTypeLabel = (mimeType) =>
  FILE_TYPE_LABELS[mimeType] || (mimeType ? mimeType.split('/')[1]?.toUpperCase() : 'FILE');

const getParseStatusBadge = (status) => {
  if (status === 'parsed') return { label: 'Parsed', color: 'var(--success)', bg: 'var(--success-light)' };
  if (status === 'failed') return { label: 'Parse Failed', color: 'var(--danger)', bg: 'var(--danger-light)' };
  return { label: 'Pending', color: 'var(--warning)', bg: 'var(--warning-light)' };
};

const CVLibraryCard = ({ cv, onDelete, onRename }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(cv.title);
  const [newRole, setNewRole] = useState(cv.targetRole || '');
  const menuRef = useRef(null);

  const badge = getParseStatusBadge(cv.parseStatus);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onRename(cv._id, newTitle.trim(), newRole.trim());
    setRenaming(false);
  };

  return (
    <div className="card cv-library-card" style={{ padding: 'var(--space-5)', position: 'relative' }}>
      {/* Top row: icon + title + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <FileText size={20} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {renaming ? (
            <form onSubmit={handleRenameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <input
                autoFocus
                className="form-input"
                style={{ fontSize: 'var(--text-sm)', padding: '6px 10px' }}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="CV title"
              />
              <input
                className="form-input"
                style={{ fontSize: 'var(--text-sm)', padding: '6px 10px' }}
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="Target role (e.g. Frontend Developer)"
              />
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setRenaming(false); setNewTitle(cv.title); setNewRole(cv.targetRole || ''); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h3 style={{
                fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                marginBottom: 2
              }}>
                {cv.title}
              </h3>
              {cv.targetRole && (
                <span style={{
                  display: 'inline-block',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  padding: '2px 10px', borderRadius: 'var(--radius-full)', marginBottom: 4
                }}>
                  {cv.targetRole}
                </span>
              )}
            </>
          )}
        </div>

        {/* More menu */}
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-icon btn-ghost btn-sm"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', zIndex: 50,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
              minWidth: 160, padding: 'var(--space-1)'
            }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--space-2)' }}
                onClick={() => { setRenaming(true); setMenuOpen(false); }}
              >
                <Edit3 size={13} /> Rename
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-danger"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--space-2)' }}
                onClick={() => { onDelete(cv._id, cv.title); setMenuOpen(false); }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--space-4)',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FileType size={11} />
          {getFileTypeLabel(cv.originalFile?.fileType)}
        </span>
        <span>·</span>
        <span>{cv.versionsCount || 1} version{(cv.versionsCount || 1) !== 1 ? 's' : ''}</span>
        <span>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} />
          {new Date(cv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span
          style={{
            marginLeft: 'auto', fontWeight: 600, fontSize: 'var(--text-xs)',
            color: badge.color, background: badge.bg,
            padding: '2px 8px', borderRadius: 'var(--radius-full)'
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Link
          to={`/optimizer?cvId=${cv._id}`}
          className="btn btn-primary btn-sm"
          style={{ flex: '1 1 auto' }}
        >
          <Zap size={13} /> Optimize CV
        </Link>
        <Link
          to={`/cvs/${cv._id}`}
          className="btn btn-secondary btn-sm"
          style={{ flex: '0 0 auto' }}
          title="Preview"
        >
          <Eye size={13} />
        </Link>
      </div>
    </div>
  );
};

export default CVLibraryCard;
