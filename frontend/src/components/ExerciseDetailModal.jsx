import React, { useState, useEffect } from 'react';
import { X, Info, Target, Dumbbell, ListOrdered, ChevronLeft, ChevronRight } from 'lucide-react';

const ExerciseDetailModal = React.memo(({ exercise, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = exercise?.images || [];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (hasMultipleImages) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [hasMultipleImages, images.length]);

  if (!exercise) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    // If it's a new dataset path (doesn't contain gifs_360x360)
    if (!path.includes('gifs_360x360')) {
        return `${baseUrl}/exercise-images/${path}`;
    }
    return `${baseUrl}/gifs/gifs_360x360/${path}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '750px', 
          width: '90%',
          padding: 0, 
          overflow: 'hidden',
          background: 'var(--bg-color)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Top Section: Visuals and Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: '320px' }} className="responsive-grid">
            {/* Visual Column */}
            <div style={{ 
              background: '#fff', 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}>
              {images.length > 0 || exercise.gifUrl ? (
                <img 
                  src={images.length > 0 ? getImageUrl(images[currentImageIndex]) : getImageUrl(exercise.gifUrl)} 
                  alt={exercise.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Dumbbell size={100} color="var(--primary)" style={{ opacity: 0.1 }} />
              )}
              
              {hasMultipleImages && (
                <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '8px' }}>
                  {images.map((_, idx) => (
                    <div key={idx} style={{ 
                      width: '10px', height: '4px', borderRadius: '2px', 
                      background: idx === currentImageIndex ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                      transition: 'all 0.3s'
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>HAREKET DETAYI</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '6px 0', textTransform: 'capitalize', color: 'var(--text-main)', lineHeight: 1.1 }}>{exercise.name}</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <Target size={18} color="var(--primary)" />
                  <div>
                     <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>HEDEF KAS</div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{exercise.targetMuscles?.[0] || 'Genel'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <Dumbbell size={18} color="var(--secondary)" />
                  <div>
                     <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>EKİPMAN</div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{exercise.equipments?.[0] || 'Vücut Ağırlığı'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Instructions */}
          <div style={{ padding: '40px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ListOrdered size={22} color="var(--primary)" /> Uygulama Talimatları
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {exercise.instructions && exercise.instructions.length > 0 ? (
                exercise.instructions.map((step, idx) => (
                  <div key={idx} className="glass-panel" style={{ 
                    display: 'flex', gap: '20px', padding: '16px 20px', borderRadius: '16px', 
                    background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      minWidth: '32px', height: '32px', background: 'var(--primary)', color: '#fff', 
                      borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 800, flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                      {step.replace(/Adım:\s*\d+\s*/g, '').replace(/Step:\s*\d+\s*/g, '')}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                  <Info size={40} style={{ marginBottom: '10px' }} />
                  <p>Bu hareket için henüz talimat eklenmemiş.</p>
                </div>
              )}
            </div>

            <button 
              onClick={onClose} 
              className="btn btn-primary premium-shadow" 
              style={{ width: '100%', marginTop: '40px', padding: '18px', fontSize: '1.1rem', fontWeight: 800 }}
            >
              Kapat
            </button>
          </div>
        </div>

        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', 
            border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '14px', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', zIndex: 100
          }}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
});

export default ExerciseDetailModal;
