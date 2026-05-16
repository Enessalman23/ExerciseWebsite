import React, { useState } from 'react';
import { SkipForward, CheckCircle2, Timer, ArrowRight, Loader, BrainCircuit } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const WorkoutPlayerControls = ({ currentStep, warmupIdx, warmupExercises, handleStepNext, skipTimer, onClose, currentDayName }) => {
  const [rpe, setRpe] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const getFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const response = await axiosClient.post('/api/ai/workout-feedback', { rpe, dayName: currentDayName });
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error(err);
      setFeedback('Değerlendirme alınamadı, ancak harika bir iş çıkardın!');
    } finally {
      setLoadingFeedback(false);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {currentStep === 'warmup' && (
        <button 
          onClick={handleStepNext} 
          className="btn btn-primary" 
          style={{ padding: '25px', fontSize: '1.4rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
        >
          {warmupIdx < warmupExercises.length - 1 ? "Sıradaki Isınma" : "Antrenmana Başla!"} <ArrowRight size={24} style={{ marginLeft: '10px' }} />
        </button>
      )}

      {currentStep === 'exercise' && (
        <button 
          onClick={handleStepNext} 
          className="btn btn-primary" 
          style={{ padding: '25px', fontSize: '1.4rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
        >
          Set Bitti, Dinlen! <Timer size={24} style={{ marginLeft: '10px' }} />
        </button>
      )}

      {currentStep === 'rest' && (
        <button 
          onClick={skipTimer} 
          className="btn btn-secondary" 
          style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
        >
          Dinlenmeyi Atla <SkipForward size={22} style={{ marginLeft: '10px' }} />
        </button>
      )}

      {currentStep === 'finished' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
          
          {!feedback ? (
            <div className="glass-panel" style={{ padding: '30px', width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.05)' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Antrenman Nasıldı? (RPE)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>1: Çok Kolay - 10: Maksimum Efor</p>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(val => (
                  <button 
                    key={val}
                    onClick={() => setRpe(val)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: rpe === val ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <button 
                onClick={getFeedback} 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '16px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                disabled={loadingFeedback}
              >
                {loadingFeedback ? <Loader className="spin" size={20} /> : <BrainCircuit size={20} />}
                AI Değerlendirmesi Al
              </button>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '30px', width: '100%', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--primary)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
                <BrainCircuit size={24} /> Koçun Mesajı
              </h3>
              <p style={{ lineHeight: 1.6, fontSize: '1.05rem', color: '#fff' }}>{feedback}</p>
            </div>
          )}

          <button 
            onClick={onClose} 
            className="btn btn-primary" 
            style={{ padding: '20px 60px', fontSize: '1.2rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)', width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <CheckCircle2 size={24} style={{ marginRight: '10px' }} /> Kapat
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlayerControls;
