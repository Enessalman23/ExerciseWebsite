import React from 'react';
import Model from 'react-body-highlighter';
import Skeleton from '../Skeleton';
import { Target, ChevronRight } from 'lucide-react';

const AnatomyExplorer = ({
  viewModel,
  setViewModel,
  selectedMuscle,
  handleMuscleClick,
  fetchingExercises,
  localExercises,
  setDetailExercise,
  getImageUrl
}) => {
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

      {/* Right: Exercise List */}
      <div className="glass-panel" style={{ padding: '30px', overflowY: 'auto', maxHeight: '680px' }}>
        {!selectedMuscle ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.3 }}>
             <Target size={80} />
             <h3 style={{ marginTop: '20px' }}>Keşfetmeye Başla</h3>
             <p>Kas haritasından bir bölge seçerek profesyonel hareketleri gör.</p>
          </div>
        ) : (
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
                      onClick={() => setDetailExercise(ex)}
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
