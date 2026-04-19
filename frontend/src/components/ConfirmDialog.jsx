import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Evet, Sil", cancelText = "Vazgeç" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000, backdropFilter: 'blur(10px)' }}>
      <div className="modal-content animate-fade-in" style={{ 
        maxWidth: '420px', 
        padding: '40px',
        background: 'var(--surface-color)',
        borderRadius: '32px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'var(--error)',
          filter: 'blur(80px)',
          opacity: 0.15,
          zIndex: 0
        }}></div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <AlertTriangle size={40} color="var(--error)" />
          </div>
          
          <h3 style={{ 
            fontSize: '1.6rem', 
            marginBottom: '16px', 
            color: 'var(--text-main)',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h3>
          
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1rem', 
            marginBottom: '40px', 
            lineHeight: '1.6',
            padding: '0 10px'
          }}>
            {message}
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={onCancel} 
              className="btn hover-scale" 
              style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                height: '56px',
                borderRadius: '16px'
              }}
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm} 
              className="btn btn-primary hover-scale" 
              style={{ 
                flex: 1, 
                backgroundColor: 'var(--error)', 
                backgroundImage: 'none', 
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                height: '56px',
                borderRadius: '16px'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
