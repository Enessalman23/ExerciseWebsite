import React from 'react';
import { X, Info, Target, Dumbbell, ListOrdered } from 'lucide-react';

const ExerciseDetailModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel animate-fade-in" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '800px', 
          padding: 0, 
          overflow: 'hidden',
          background: 'var(--bg-color)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Header Image/GIF */}
        <div style={{ 
          width: '100%', 
          height: '350px', 
          background: '#000', 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {exercise.gifUrl ? (
            <img 
              src={`http://localhost:8080/gifs/gifs_360x360/${exercise.gifUrl}`} 
              alt={exercise.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Dumbbell size={80} color="var(--primary)" style={{ opacity: 0.2 }} />
          )}
          
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(0,0,0,0.5)', 
              border: 'none', 
              color: '#fff', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '10px', textTransform: 'capitalize', color: 'var(--text-main)' }}>{exercise.name}</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span className="workout-badge workout-badge-primary">
                  <Target size={14} style={{ marginRight: '6px' }} /> {exercise.targetMuscles?.[0] || 'Genel'}
                </span>
                <span className="workout-badge workout-badge-secondary">
                  <Dumbbell size={14} style={{ marginRight: '6px' }} /> {exercise.equipments?.[0] || 'Ekipman Gerekmiyor'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ListOrdered size={20} color="var(--primary)" /> Adım Adım Uygulama
              </h3>
              
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {exercise.instructions && exercise.instructions.length > 0 ? (
                  exercise.instructions.map((step, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      background: 'var(--surface-hover)', 
                      padding: '16px', 
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      transition: 'transform 0.2s',
                    }} className="hover-scale">
                      <div style={{ 
                        minWidth: '28px', 
                        height: '28px', 
                        background: 'var(--primary)', 
                        color: '#fff', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginTop: '2px'
                      }}>
                        {idx + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                        {step.replace(/Adım:\s*\d+\s*/g, '').replace(/Step:\s*\d+\s*/g, '')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Talimat bulunamadı.</p>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              onClick={onClose} 
              className="btn btn-primary" 
              style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
            >
              Anladım, Teşekkürler!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
