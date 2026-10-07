import React from 'react';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean typography, indigo accents, balanced section dividers.'
  },
  {
    id: 'minimal',
    name: 'Minimal ATS',
    description: 'Ultra-clean, single column, optimized for legacy ATS parsers.'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Editorial serif headers, leadership focus, impactful layout.'
  }
];

const TemplateSelector = ({ selectedTemplate = 'modern', onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      {templates.map(tpl => {
        const isSelected = selectedTemplate === tpl.id;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            style={{
              flex: '1 1 180px',
              padding: 'var(--space-3) var(--space-4)',
              background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
              border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all var(--transition)'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: isSelected ? 'var(--primary)' : 'var(--text)' }}>
              {tpl.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              {tpl.description}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TemplateSelector;
