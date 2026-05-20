import React, { useState } from 'react';
import { SkipForward, CheckCircle2, Timer, ArrowRight, Loader, BrainCircuit } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { triggerAchievement } from '../AchievementSystem';

const WorkoutPlayerControls = ({ currentStep, warmupIdx, warmupExercises, handleStepNext, skipTimer, onClose, currentDayName }) => {
  const [rpe, setRpe] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const getFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const response = await axiosClient.post('/api/ai/workout-feedback', { rpe, dayName: currentDayName });
      setFeedback(response.data.feedback);
      triggerAchievement({
        type: 'trophy',
        title: 'Demir İrade',
        description: 'Antrenmanı başarıyla bitirdin. Bugünün kazananı sensin!'
      });
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
          
          {!feedback ? (
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
                onClick={getFeedback} 
                className="btn-secondary" 
                style={{ width: '100%', padding: '20px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontWeight: 800, fontSize: '1rem' }}
                disabled={loadingFeedback}
              >
                {loadingFeedback ? <Loader className="spin" size={24} /> : <BrainCircuit size={24} color="var(--primary)" />}
                AI ANALİZİ VE GERİ BİLDİRİM AL
              </button>
            </div>
          ) : (
            <div className="premium-glass-dark animate-fade-in" style={{ padding: '35px', width: '100%', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--primary)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem' }}>
                <BrainCircuit size={26} /> AI KOÇUN ANALİZİ
              </h3>
              <p style={{ lineHeight: 1.7, fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{feedback}</p>
            </div>
          )}

          <button 
            onClick={onClose} 
            className="btn btn-primary premium-shadow" 
            style={{ padding: '25px', fontSize: '1.4rem', borderRadius: '24px', fontWeight: 900, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <CheckCircle2 size={28} style={{ marginRight: '15px' }} /> ANTRENMANI KAYDET VE ÇIK
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlayerControls;
