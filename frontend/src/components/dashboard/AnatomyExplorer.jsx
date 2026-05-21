import React, { useState, useEffect } from 'react';
import Model from 'react-body-highlighter';
import Skeleton from '../Skeleton';
import { Target, ChevronRight } from 'lucide-react';

const ExerciseDetailView = ({ exercise, onBack, getImageUrl }) => {
  const images = exercise.images || [];
  const hasMultipleImages = images.length > 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  return (
    <div className="animate-fade-in">
       <button 
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
       >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Listeye Geri Dön
       </button>
       
       <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <img 
            src={getImageUrl(images.length > 0 ? images[currentImageIndex] : exercise.gifUrl)} 
            alt={exercise.name} 
            style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain' }}
          />
          
          {hasMultipleImages && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="btn-secondary" style={{ padding: '4px 8px', borderRadius: '8px' }}
              >
                <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {images.map((_, idx) => (
                  <div key={idx} style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', 
                    background: idx === currentImageIndex ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                className="btn-secondary" style={{ padding: '4px 8px', borderRadius: '8px' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
       </div>

       <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px', textTransform: 'capitalize' }}>{exercise.name}</h2>
       
       <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <span className="workout-badge workout-badge-primary">{exercise.targetMuscles?.[0]}</span>
          <span className="workout-badge workout-badge-secondary">{exercise.equipments?.[0] || 'Vücut Ağırlığı'}</span>
       </div>

       <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--primary)" /> Uygulama Talimatları
       </h3>
       
       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {exercise.instructions?.map((step, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '15px' }}>
              <div style={{ minWidth: '24px', height: '24px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{idx + 1}</div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-main)' }}>{step.replace(/Adım:\s*\d+\s*/g, '')}</p>
            </div>
          ))}
       </div>
    </div>
  );
};

const AnatomyExplorer = ({
  viewModel,
  setViewModel,
  selectedMuscle,
  handleMuscleClick,
  fetchingExercises,
  localExercises,
  getImageUrl
}) => {
  const [detailExerciseLocal, setDetailExerciseLocal] = useState(null);
  const [prevMuscle, setPrevMuscle] = useState(selectedMuscle);

  if (selectedMuscle !== prevMuscle) {
    setPrevMuscle(selectedMuscle);
    setDetailExerciseLocal(null);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', marginBottom: '40px' }} className="responsive-grid">
      
      {/* Left: The Model */}
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '600px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', width: '100%', justifyContent: 'center' }}>
          <button 
            onClick={() => setViewModel('anterior')} 
            className={`btn ${viewModel === 'anterior' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
          >
            Ön Görünüm
          </button>
          <button 
            onClick={() => setViewModel('posterior')} 
            className={`btn ${viewModel === 'posterior' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
          >
            Arka Görünüm
          </button>
        </div>
        
        <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Model 
            type={viewModel} 
            onClick={handleMuscleClick}
            data={selectedMuscle ? [{ name: selectedMuscle, muscles: [selectedMuscle] }] : []}
            highlightedColors={['#4f46e5', '#818cf8']}
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          {selectedMuscle ? (
            <>Seçilen: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedMuscle.toUpperCase()}</span></>
          ) : "İncelemek istediğin bir kas grubuna tıkla."}
        </p>
      </div>

      {/* Right: Exercise List OR Detail View */}
      <div className="glass-panel" style={{ padding: '30px', overflowY: 'auto', maxHeight: '680px', position: 'relative' }}>
        {!selectedMuscle ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.3 }}>
             <Target size={80} />
             <h3 style={{ marginTop: '20px' }}>Keşfetmeye Başla</h3>
             <p>Kas haritasından bir bölge seçerek profesyonel hareketleri gör.</p>
          </div>
        ) : detailExerciseLocal ? (
          <ExerciseDetailView 
            exercise={detailExerciseLocal} 
            onBack={() => setDetailExerciseLocal(null)} 
            getImageUrl={getImageUrl} 
          />
        ) : (
          /* List View */
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedMuscle.toUpperCase()} Hareketleri</h3>
              <span className="workout-badge workout-badge-primary">{localExercises.length} Egzersiz</span>
            </div>

            {fetchingExercises ? (
              <Skeleton count={5} height={100} style={{ marginBottom: '15px' }} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {localExercises.map((ex, idx) => (
                  <div key={idx} className="glass-panel hover-scale" style={{ padding: '20px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                           <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)' }}>{ex.name}</h4>
                           <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {ex.equipments?.map((eq, eIdx) => (
                                <span key={eIdx} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{eq}</span>
                              ))}
                           </div>
                        </div>
                        {(ex.gifUrl || ex.images?.length > 0) && (
                          <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                             <img 
                               src={getImageUrl(ex.gifUrl || ex.images?.[0])} 
                               alt={ex.name} 
                               style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }}
                              />
                          </div>
                        )}
                     </div>
                     <button 
                      onClick={() => setDetailExerciseLocal(ex)}
                      className="btn btn-secondary" 
                      style={{ width: '100%', marginTop: '15px', fontSize: '0.8rem', padding: '8px' }}
                     >
                        Nasıl Yapılır? <ChevronRight size={14} />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnatomyExplorer;
