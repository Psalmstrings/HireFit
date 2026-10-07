import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const statuses = ['Saved', 'Applied', 'Interview', 'Assessment', 'Offer', 'Rejected'];

const ApplicationModal = ({ isOpen, onClose, onSave, application = null, cvs = [] }) => {
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    jobUrl: '',
    location: '',
    salary: '',
    status: 'Saved',
    cvId: '',
    notes: '',
    appliedDate: ''
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || '',
        jobTitle: application.jobTitle || '',
        jobUrl: application.jobUrl || '',
        location: application.location || '',
        salary: application.salary || '',
        status: application.status || 'Saved',
        cvId: application.cvId?._id || application.cvId || '',
        notes: application.notes || '',
        appliedDate: application.appliedDate ? new Date(application.appliedDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        company: '',
        jobTitle: '',
        jobUrl: '',
        location: '',
        salary: '',
        status: 'Saved',
        cvId: cvs[0]?._id || '',
        notes: '',
        appliedDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [application, cvs]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.jobTitle) {
      alert('Company and Job Title are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{application ? 'Edit Application' : 'Track New Application'}</div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Company Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Acme Inc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="grid grid-2 gap-3">
              <div className="form-group">
                <label className="form-label">Application Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Linked CV</label>
                <select
                  className="form-select"
                  value={formData.cvId}
                  onChange={e => setFormData({ ...formData, cvId: e.target.value })}
                >
                  <option value="">None / External</option>
                  {cvs.map(cv => (
                    <option key={cv._id} value={cv._id}>{cv.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-2 gap-3">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Remote / City"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salary Range</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. $120k - $140k"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Posting URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.jobUrl}
                onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes & Follow-up Plans</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Interviewer contacts, referral details, interview stages..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {application ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
