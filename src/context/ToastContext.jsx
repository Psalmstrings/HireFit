import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message, title = 'Success') => addToast(message, 'success', title), [addToast]);
  const error = useCallback((message, title = 'Error') => addToast(message, 'error', title, 6000), [addToast]);
  const warning = useCallback((message, title = 'Warning') => addToast(message, 'warning', title), [addToast]);
  const info = useCallback((message, title = '') => addToast(message, 'info', title), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, success, error, warning, info, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
