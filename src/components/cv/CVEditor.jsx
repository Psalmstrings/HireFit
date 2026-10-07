import React, { useState } from 'react';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

const CVEditor = ({ initialData, onSave, isSaving = false }) => {
  const [data, setData] = useState(initialData || {});

  const updatePersonalInfo = (field, value) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        [field]: value
      }
    }));
  };

  const updateSkills = (category, valueString) => {
    const list = valueString.split(',').map(s => s.trim()).filter(Boolean);
    setData(prev => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        [category]: list
      }
    }));
  };

  const updateExperience = (idx, field, value) => {
    const list = [...(data.workExperience || [])];
    list[idx] = { ...list[idx], [field]: value };
    setData(prev => ({ ...prev, workExperience: list }));
  };

  const updateExperienceBullet = (expIdx, type, bulletIdx, value) => {
    const list = [...(data.workExperience || [])];
    const bullets = [...(list[expIdx][type] || [])];
    bullets[bulletIdx] = value;
    list[expIdx] = { ...list[expIdx], [type]: bullets };
    setData(prev => ({ ...prev, workExperience: list }));
  };

  const addExperienceBullet = (expIdx, type) => {
    const list = [...(data.workExperience || [])];
    list[expIdx] = {
      ...list[expIdx],
      [type]: [...(list[expIdx][type] || []), '']
    };
    setData(prev => ({ ...prev, workExperience: list }));
  };

  const removeExperienceBullet = (expIdx, type, bulletIdx) => {
    const list = [...(data.workExperience || [])];
    list[expIdx] = {
      ...list[expIdx],
      [type]: (list[expIdx][type] || []).filter((_, i) => i !== bulletIdx)
    };
    setData(prev => ({ ...prev, workExperience: list }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      workExperience: [
        {
          company: '',
          jobTitle: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          responsibilities: [''],
          achievements: []
        },
        ...(prev.workExperience || [])
      ]
    }));
  };

  const removeExperience = (idx) => {
    setData(prev => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  const { personalInfo = {}, skills = {} } = data;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
          Edit and refine extracted CV content. Changes will be saved as a new version.
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h3 className="section-title mb-4">Personal Information</h3>
        <div className="grid grid-2 gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={personalInfo.fullName || ''}
              onChange={e => updatePersonalInfo('fullName', e.target.value)}
              placeholder="e.g. Alex Johnson"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={personalInfo.email || ''}
              onChange={e => updatePersonalInfo('email', e.target.value)}
              placeholder="e.g. alex@example.com"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={personalInfo.phone || ''}
              onChange={e => updatePersonalInfo('phone', e.target.value)}
              placeholder="e.g. +1 555 123 4567"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              value={personalInfo.location || ''}
              onChange={e => updatePersonalInfo('location', e.target.value)}
              placeholder="e.g. London, UK / Remote"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">LinkedIn URL</label>
            <input
              type="text"
              className="form-input"
              value={personalInfo.linkedin || ''}
              onChange={e => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Portfolio / GitHub</label>
            <input
              type="text"
              className="form-input"
              value={personalInfo.portfolio || ''}
              onChange={e => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="github.com/username"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="card">
        <h3 className="section-title mb-2">Professional Summary</h3>
        <p className="text-sm text-muted mb-4">Concise narrative positioning your core experience and career focus.</p>
        <textarea
          className="form-textarea"
          rows={4}
          value={data.professionalSummary || ''}
          onChange={e => setData(prev => ({ ...prev, professionalSummary: e.target.value }))}
          placeholder="State your verified background, technical expertise, and career value..."
        />
      </div>

      {/* Skills */}
      <div className="card">
        <h3 className="section-title mb-4">Skills & Tools (Comma Separated)</h3>
        <div className="form-group">
          <label className="form-label">Technical Skills</label>
          <input
            type="text"
            className="form-input"
            value={(skills.technical || []).join(', ')}
            onChange={e => updateSkills('technical', e.target.value)}
            placeholder="React, JavaScript, TypeScript, Node.js, SQL"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tools & Frameworks</label>
          <input
            type="text"
            className="form-input"
            value={(skills.tools || []).join(', ')}
            onChange={e => updateSkills('tools', e.target.value)}
            placeholder="Git, Docker, AWS, Postman, Jira"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Professional / Soft Skills</label>
          <input
            type="text"
            className="form-input"
            value={(skills.soft || []).join(', ')}
            onChange={e => updateSkills('soft', e.target.value)}
            placeholder="Cross-functional collaboration, Agile, Mentoring"
          />
        </div>
      </div>

      {/* Work Experience */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ margin: 0 }}>Work Experience</h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addExperience}>
            <Plus size={14} /> Add Role
          </button>
        </div>

        {(data.workExperience || []).map((exp, idx) => (
          <div key={idx} style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)' }}>
                {exp.jobTitle || 'Role'} at {exp.company || 'Company'}
              </span>
              <button
                type="button"
                className="btn btn-icon btn-ghost btn-sm text-danger"
                onClick={() => removeExperience(idx)}
                aria-label="Remove role"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-2 gap-3 mb-3">
              <input
                type="text"
                className="form-input"
                placeholder="Job Title"
                value={exp.jobTitle || ''}
                onChange={e => updateExperience(idx, 'jobTitle', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Company Name"
                value={exp.company || ''}
                onChange={e => updateExperience(idx, 'company', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Start Date (e.g. Jan 2021)"
                value={exp.startDate || ''}
                onChange={e => updateExperience(idx, 'startDate', e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="End Date (e.g. Present)"
                value={exp.endDate || ''}
                onChange={e => updateExperience(idx, 'endDate', e.target.value)}
              />
            </div>

            <div style={{ marginTop: 'var(--space-3)' }}>
              <label className="form-label mb-2" style={{ display: 'block' }}>Key Responsibilities & Achievements</label>
              {(exp.responsibilities || []).map((resp, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={resp}
                    onChange={e => updateExperienceBullet(idx, 'responsibilities', rIdx, e.target.value)}
                    placeholder="Describe genuine responsibility or project outcome..."
                  />
                  <button
                    type="button"
                    className="btn btn-icon btn-ghost btn-sm"
                    onClick={() => removeExperienceBullet(idx, 'responsibilities', rIdx)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => addExperienceBullet(idx, 'responsibilities')}
              >
                <Plus size={13} /> Add Bullet Point
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default CVEditor;
