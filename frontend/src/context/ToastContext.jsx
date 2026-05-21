/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [alert, setAlert] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const showAlert = useCallback((title, message, type = 'error') => {
    setAlert({ title, message, type });
  }, []);

  const closeAlert = () => setAlert(null);

  // Global event listener for custom alerts (from non-react files)
  useEffect(() => {
    const handleGlobalAlert = (e) => {
      const { title, message, type } = e.detail;
      showAlert(title, message, type);
    };
    window.addEventListener('app-alert', handleGlobalAlert);
    return () => window.removeEventListener('app-alert', handleGlobalAlert);
  }, [showAlert]);

  return (
    <ToastContext.Provider value={{ showToast, showAlert }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast-container" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} glass-panel animate-slide-in`} style={{
            display: 'flex', alignItems: 'center', gap: '15px', padding: '16px 24px', borderRadius: '18px',
            minWidth: '300px', background: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#3b82f6' }}>
              {toast.type === 'success' && <CheckCircle2 size={22} />}
              {toast.type === 'error' && <AlertCircle size={22} />}
              {toast.type === 'info' && <Info size={22} />}
            </div>
            <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Premium Alert Modal */}
      {alert && (
        <div className="modal-overlay" style={{ zIndex: 4000 }} onClick={closeAlert}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{
            maxWidth: '450px', width: '90%', padding: '40px', textAlign: 'center', background: 'var(--bg-color)',
            border: '1px solid var(--border-color)', borderRadius: '32px', boxShadow: '0 50px 100px rgba(0,0,0,0.8)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: alert.type === 'error' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: alert.type === 'error' ? '#f43f5e' : '#10b981'
            }}>
              {alert.type === 'error' ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>{alert.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>{alert.message}</p>
            <button className="btn btn-primary premium-shadow" onClick={closeAlert} style={{ width: '100%', padding: '16px', fontSize: '1rem', fontWeight: 800 }}>
              Tamam
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
