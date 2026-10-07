import React from 'react';

const getScoreColor = (score) => {
  if (score >= 75) return 'var(--success)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--danger)';
};

const getScoreClass = (score) => {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

const getScoreLabel = (score) => {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Strong Match';
  if (score >= 55) return 'Moderate Match';
  return 'Needs Improvement';
};

// Circular score gauge
export const ScoreGauge = ({ score, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="score-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-circle-value">
        <div className="score-number" style={{ color, fontSize: size > 120 ? 'var(--text-4xl)' : 'var(--text-2xl)' }}>
          {score}
        </div>
        <div className="score-label">/100</div>
      </div>
    </div>
  );
};

// Score progress bar
export const ScoreBar = ({ label, score }) => {
  const cls = getScoreClass(score);
  return (
    <div className="score-bar-item">
      <div className="score-bar-label">{label}</div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${cls}`}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="score-bar-value">{score}</div>
    </div>
  );
};

// Main score display card
const MatchScore = ({ analysis }) => {
  if (!analysis) return null;

  const { overallScore, scoreLabel, categoryScores } = analysis;
  const scoreClass = getScoreClass(overallScore);

  const categories = [
    { label: 'Skills Match', key: 'skillsMatch' },
    { label: 'Experience Match', key: 'experienceMatch' },
    { label: 'Keyword Alignment', key: 'keywordMatch' },
    { label: 'Responsibility Match', key: 'responsibilityMatch' },
    { label: 'Education Match', key: 'educationMatch' },
    { label: 'ATS Readiness', key: 'atsReadiness' }
  ];

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <ScoreGauge score={overallScore} size={160} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--text-lg)', fontWeight: 700,
              color: getScoreColor(overallScore)
            }}>
              {getScoreLabel(overallScore)}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, maxWidth: 180, textAlign: 'center' }}>
              {scoreLabel || 'AI Job Match Score Estimate'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
            Category Breakdown
          </h3>
          {categories.map(cat => (
            <ScoreBar
              key={cat.key}
              label={cat.label}
              score={categoryScores?.[cat.key] || 0}
            />
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--text-xs)',
        color: 'var(--muted)',
        lineHeight: 1.6,
        borderLeft: '3px solid var(--warning)'
      }}>
        <strong>Disclaimer:</strong> This is an AI-generated estimate based on the CV and job description you provided. It does not predict actual ATS system output or guarantee interview success. Use it as a guide for positioning your genuine experience more effectively.
      </div>
    </div>
  );
};

export default MatchScore;
