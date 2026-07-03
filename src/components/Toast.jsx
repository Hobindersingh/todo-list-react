import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" size={18} />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" size={18} />;
      case 'info':
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}
