import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, Lightbulb } from 'lucide-react';

const categoryBadges = {
  Technical: 'badge-primary',
  Behavioral: 'badge-warning',
  'Role-Specific': 'badge-success',
  'CV-Specific': 'badge-danger'
};

const QuestionCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div>
          <span className={`badge ${categoryBadges[item.category] || 'badge-neutral'} mb-2`}>
            {item.category}
          </span>
          <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', margin: 'var(--space-1) 0' }}>
            {index + 1}. {item.question}
          </h4>
        </div>
        <button
          type="button"
          className="btn btn-icon btn-ghost btn-sm"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse' : 'Expand preparation details'}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Why they ask */}
          <div style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 2 }}>
              Why They Ask This
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {item.whyTheyAsk}
            </div>
          </div>

          {/* Answer Structure */}
          <div style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--warning)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: 2 }}>
              Recommended Answer Structure
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {item.answerStructure}
            </div>
          </div>

          {/* Talking points */}
          {item.candidateTalkingPoints?.length > 0 && (
            <div style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 4 }}>
                Your Tailored Talking Points (From Your Real CV)
              </div>
              <ul style={{ paddingLeft: 18, listStyleType: 'disc' }}>
                {item.candidateTalkingPoints.map((tp, tpIdx) => (
                  <li key={tpIdx} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>
                    {tp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Candidate prep notes */}
          <div style={{ marginTop: 'var(--space-2)' }}>
            <label className="form-label text-xs">My Personal Practice Notes</label>
            <textarea
              className="form-textarea text-sm"
              rows={2}
              placeholder="Jot down notes or draft your STAR response here..."
              value={userNotes}
              onChange={e => setUserNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
