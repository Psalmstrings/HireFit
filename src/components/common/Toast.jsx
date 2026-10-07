import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} color="var(--success)" />,
  error: <XCircle size={16} color="var(--danger)" />,
  warning: <AlertTriangle size={16} color="var(--warning)" />,
  info: <Info size={16} color="var(--info)" />
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">{icons[toast.type]}</div>
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            className="btn btn-icon btn-ghost btn-sm"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
