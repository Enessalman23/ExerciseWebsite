import React, { useState } from 'react';
import { SkipForward, CheckCircle2, Timer, ArrowRight } from 'lucide-react';

const WorkoutPlayerControls = ({ 
  currentStep, 
  warmupIdx, 
  warmupExercises, 
  handleStepNext, 
  skipTimer, 
  onClose, 
  currentDayName,
  planId,
  currentDayIdx
}) => {
  const [rpe, setRpe] = useState(5);

  const handleSave = () => {
    try {
      const pId = planId || 'default';
      const dIdx = currentDayIdx !== undefined ? currentDayIdx : '0';
      localStorage.setItem(`rpe_rating_${pId}_${dIdx}`, rpe);
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {currentStep === 'warmup' && (
        <button 
          onClick={handleStepNext} 
          className="btn btn-primary premium-shadow" 
          style={{ padding: '25px', fontSize: '1.5rem', borderRadius: '24px', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {warmupIdx < warmupExercises.length - 1 ? "Sıradaki Isınma" : "Hadi Başlayalım!"} <ArrowRight size={28} style={{ marginLeft: '15px' }} />
        </button>
      )}

      {currentStep === 'exercise' && (
        <button 
          onClick={handleStepNext} 
          className="btn btn-primary premium-shadow" 
          style={{ padding: '25px', fontSize: '1.5rem', borderRadius: '24px', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          Set Bitti, Dinlen <Timer size={28} style={{ marginLeft: '15px' }} />
        </button>
      )}

      {currentStep === 'rest' && (
        <button 
          onClick={skipTimer} 
          className="btn btn-secondary" 
          style={{ padding: '20px', fontSize: '1.3rem', borderRadius: '24px', border: '1px solid var(--glass-border)', color: '#fff', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.05)' }}
        >
          Dinlenmeyi Atla <SkipForward size={24} style={{ marginLeft: '15px' }} />
        </button>
      )}

      {currentStep === 'finished' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
          <div className="premium-glass-dark" style={{ padding: '40px', width: '100%', textAlign: 'center', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1.4rem', fontWeight: 900 }}>Antrenman Nasıl Geçti?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '25px', fontWeight: 600 }}>RPE Ölçeği (1-10)</p>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(val => (
                <button 
                  key={val}
                  onClick={() => setRpe(val)}
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: rpe === val ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: '#fff', border: '1px solid',
                    borderColor: rpe === val ? 'var(--primary)' : 'var(--glass-border)',
                    cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: rpe === val ? '0 5px 15px var(--primary-glow)' : 'none'
                  }}
                >
                  {val}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSave} 
              className="btn btn-primary premium-shadow" 
              style={{ padding: '20px', fontSize: '1.25rem', borderRadius: '20px', fontWeight: 900, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <CheckCircle2 size={24} style={{ marginRight: '12px' }} /> ANTRENMANI KAYDET VE ÇIK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlayerControls;
