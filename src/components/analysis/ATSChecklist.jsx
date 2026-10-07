import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const ATSChecklist = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  const renderIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 size={18} color="var(--success)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--warning)" />;
      case 'needs_improvement':
      default:
        return <XCircle size={18} color="var(--danger)" />;
    }
  };

  return (
    <div className="card">
      <h3 className="section-title mb-2">ATS Readiness Checklist</h3>
      <p className="text-xs text-muted mb-4">
        Evaluation of structure, headings, contact accessibility, and formatting compliance for automated parsers.
      </p>

      <div>
        {items.map((it, idx) => (
          <div key={idx} className="ats-item">
            <div className="ats-icon">{renderIcon(it.status)}</div>
            <div>
              <div className="ats-item-label">{it.item}</div>
              <div className="ats-item-feedback">{it.feedback}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSChecklist;
