import React, { useState } from 'react';
import { Check, X, Edit3, HelpCircle } from 'lucide-react';

const BeforeAfterCard = ({ change, index, onStatusChange, onTextEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(change.after || '');

  const handleSaveEdit = () => {
    onTextEdit(index, editText);
    setIsEditing(false);
  };

  const isAccepted = change.status === 'accepted';
  const isRejected = change.status === 'rejected';

  return (
    <div className="change-card" style={{ opacity: isRejected ? 0.65 : 1 }}>
      <div className="change-card-header">
        <span className="change-section-label">{change.section}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className={`badge ${isAccepted ? 'badge-success' : isRejected ? 'badge-danger' : 'badge-warning'}`}>
            {change.status || 'pending'}
          </span>
        </div>
      </div>

      <div className="change-body">
        {/* Before */}
        <div className="change-before">
          <div className="change-side-label">Original Wording</div>
          <div className="change-text">{change.before}</div>
        </div>

        {/* After */}
        <div className="change-after">
          <div className="change-side-label">Optimized Wording</div>
          {isEditing ? (
            <div>
              <textarea
                className="form-textarea"
                rows={3}
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                  Save Edit
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="change-text">{change.after}</div>
          )}
        </div>
      </div>

      {/* Rationale */}
      <div className="change-rationale">
        <HelpCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
        <span><strong>Rationale: </strong>{change.rationale}</span>
      </div>

      {/* Actions */}
      <div className="change-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 size={13} /> Edit
        </button>
        <button
          type="button"
          className={`btn btn-sm ${isRejected ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => onStatusChange(index, isRejected ? 'accepted' : 'rejected')}
        >
          <X size={13} /> {isRejected ? 'Rejected' : 'Reject Change'}
        </button>
        <button
          type="button"
          className={`btn btn-sm ${isAccepted ? 'btn-success' : 'btn-primary'}`}
          onClick={() => onStatusChange(index, isAccepted ? 'pending' : 'accepted')}
        >
          <Check size={13} /> {isAccepted ? 'Accepted' : 'Accept Change'}
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterCard;
