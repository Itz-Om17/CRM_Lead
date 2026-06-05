import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error', id }

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 3000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  );
}

function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-text">{message}</span>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={onClose} 
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}
