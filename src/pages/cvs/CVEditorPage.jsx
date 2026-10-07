import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CVEditor from '../../components/cv/CVEditor';
import { ArrowLeft, Eye } from 'lucide-react';

const CVEditorPage = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const { data } = await api.get(`/cvs/${id}`);
        setCv(data.cv);
      } catch (err) {
        toastError('Failed to load CV for editing.');
        navigate('/cvs');
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, [id]);

  const handleSave = async (updatedData) => {
    setSaving(true);
    try {
      await api.put(`/cvs/${id}`, { parsedData: updatedData });
      success('CV updated and new version snapshot created.');
      navigate(`/cvs/${id}`);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span className="loading-text">Loading editor...</span>
      </div>
    );
  }

  if (!cv) return null;

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link to={`/cvs/${id}`} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back to Preview
          </Link>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            Editing: {cv.title}
          </h1>
        </div>
        <Link to={`/cvs/${id}`} className="btn btn-secondary btn-sm">
          <Eye size={14} /> Preview Templates
        </Link>
      </div>

      <CVEditor
        initialData={cv.parsedData}
        onSave={handleSave}
        isSaving={saving}
      />
    </div>
  );
};

export default CVEditorPage;
