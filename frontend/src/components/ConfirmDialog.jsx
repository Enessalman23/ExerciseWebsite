import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Evet, Sil", cancelText = "Vazgeç" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '400px', padding: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertTriangle size={32} color="var(--error)" />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.5' }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
              {cancelText}
            </button>
            <button onClick={onConfirm} className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)', backgroundImage: 'none', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
