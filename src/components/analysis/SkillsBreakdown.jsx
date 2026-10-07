import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const SkillsBreakdown = ({ matchedSkills = [], partialMatches = [], missingSkills = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Matched Skills */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <CheckCircle2 size={18} color="var(--success)" />
          <h3 className="section-title" style={{ margin: 0, fontSize: 'var(--text-md)' }}>
            Strong Matched Requirements ({matchedSkills.length})
          </h3>
        </div>
        <p className="text-xs text-muted mb-4">
          Competencies clearly demonstrated in your CV that align with the role prerequisites.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {matchedSkills.map((m, idx) => (
            <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                {m.skill}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                <strong>Evidence in your CV:</strong> {m.candidateEvidence}
              </div>
            </div>
          ))}
          {matchedSkills.length === 0 && (
            <div className="text-sm text-muted">No explicit requirement matches detected.</div>
          )}
        </div>
      </div>

      {/* Partial Matches */}
      {partialMatches.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <AlertTriangle size={18} color="var(--warning)" />
            <h3 className="section-title" style={{ margin: 0, fontSize: 'var(--text-md)' }}>
              Partial Matches ({partialMatches.length})
            </h3>
          </div>
          <p className="text-xs text-muted mb-4">
            Areas where you possess related or adjacent background, but direct evidence can be sharpened.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {partialMatches.map((p, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--warning)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                  {p.skill}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                  <strong>Related Experience:</strong> {p.candidateExperience}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                  <strong>Opportunity:</strong> {p.missingAspect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Evidenced in CV */}
      {missingSkills.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <HelpCircle size={18} color="var(--danger)" />
            <h3 className="section-title" style={{ margin: 0, fontSize: 'var(--text-md)' }}>
              Not Evidenced in Your CV ({missingSkills.length})
            </h3>
          </div>
          <p className="text-xs text-muted mb-4">
            These requirements were not identified in your supplied CV. If you possess this experience, consider adding it to your CV editor.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {missingSkills.map((m, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--danger)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{m.skill}</span>
                  <span className={`badge ${m.importance === 'High' ? 'badge-danger' : 'badge-neutral'}`}>
                    {m.importance} Priority
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                  {m.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsBreakdown;
