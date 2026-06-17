import React from 'react';
import { Clock, Dumbbell, Award, Zap, Timer } from 'lucide-react';

const ExerciseDisplay = ({
  currentStep,
  currentWarmup,
  currentExercise,
  restTimer,
  getImageUrl,
  warmupIdx,
  warmupExercises,
  exerciseIdx,
  exercises,
  isFocused,
  children
}) => {
  const [localImageIdx, setLocalImageIdx] = React.useState(0);

  const images = (currentStep === 'warmup' ? currentWarmup?.images : currentExercise?.images) || [];
  const maxRest = parseInt(currentExercise?.rest) || 60;

  React.useEffect(() => {
    setLocalImageIdx(0);
    if (images.length > 1) {
      const interval = setInterval(() => {
        setLocalImageIdx(prev => (prev + 1) % images.length);
      }, 2000); 
      return () => clearInterval(interval);
    }
  }, [currentExercise?.exerciseId, currentWarmup?.exerciseId, currentStep, images.length]);

  return (
    <div style={{ 
      flex: 1, display: 'flex', flexDirection: 'column', gap: '30px', 
      maxHeight: '100%', position: 'relative',
      paddingBottom: isFocused ? '220px' : '0',
      transition: 'all 0.4s ease-out'
    }}>
      
      <div className="glass-panel" style={{ 
        flex: '1 1 auto', position: 'relative', borderRadius: '40px', overflow: 'hidden', 
        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '300px', maxHeight: isFocused ? '60vh' : '500px'
      }}>
        {/* Animated Background Glow */}
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px', background: 'var(--primary-glow)',
          filter: 'blur(100px)', opacity: 0.1, zIndex: 0
        }}></div>

        {currentStep === 'warmup' && currentWarmup && (
          <div className="animate-fade-in" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
            {(currentWarmup.images?.length > 0 || currentWarmup.gifUrl) ? (
              <img 
                src={currentWarmup.images?.length > 0 ? getImageUrl(currentWarmup.images[localImageIdx]) : getImageUrl(currentWarmup.gifUrl)} 
                alt={currentWarmup.exerciseName}
                style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', background: '#fff', padding: '15px', border: '8px solid rgba(255,255,255,0.05)' }}
              />
            ) : (
              <div className="text-center">
                <Clock size={120} style={{ opacity: 0.15, color: '#fff' }} />
                <h2 style={{ fontSize: '2.5rem', marginTop: '30px', color: '#fff', fontWeight: 900 }}>ISINMA ZAMANI</h2>
              </div>
            )}
          </div>
        )}

        {currentStep === 'exercise' && currentExercise && (
          <div className="animate-fade-in" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
            {(currentExercise.images?.length > 0 || currentExercise.gifUrl) ? (
              <img 
                src={currentExercise.images?.length > 0 ? getImageUrl(currentExercise.images[localImageIdx]) : getImageUrl(currentExercise.gifUrl)} 
                alt={currentExercise.exerciseName}
                style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', background: '#fff', padding: '15px', border: '8px solid rgba(255,255,255,0.05)' }}
              />
            ) : (
              <Dumbbell size={120} style={{ opacity: 0.15, color: '#fff' }} />
            )}
          </div>
        )}

        {currentStep === 'rest' && (
          <div className="animate-slide-up text-center" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="var(--secondary)" strokeWidth="4" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * (restTimer / maxRest))} 
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ fontSize: '8rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-5px', color: '#fff', lineHeight: 1 }}>
                        {restTimer}
                    </div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '5px' }}>SN KALDI</div>
                </div>
            </div>
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'rgba(255,255,255,0.5)' }}>
               <Timer size={24} />
               <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>DINLENME MODU</span>
            </div>
          </div>
        )}

        {currentStep === 'finished' && (
          <div className="text-center animate-slide-up" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 60px var(--primary-glow)'
            }}>
                <Award size={110} style={{ color: '#fff' }} />
            </div>
            <h2 className="text-glow" style={{ fontSize: '5rem', marginTop: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-3px' }}>BİTTİ!</h2>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '15px auto 0', fontWeight: 500 }}>Bugün harika bir iş çıkardın.</p>
          </div>
        )}
      </div>

      {(currentStep === 'warmup' || currentStep === 'exercise' || currentStep === 'rest') && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
          padding: isFocused ? '0 40px' : '0 10px',
          marginBottom: isFocused ? '10px' : '0',
          gap: '20px'
        }}>
          <div style={{ flex: 1, maxWidth: '70%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: currentStep === 'warmup' ? 'var(--secondary)' : 'var(--primary)', marginBottom: '5px', fontSize: '1rem', fontWeight: 900, letterSpacing: '2px' }}>
               {currentStep === 'warmup' ? <Zap size={18} /> : <Dumbbell size={18} />}
               {currentStep === 'warmup' ? 'ISINMA EVRESİ' : 'AKTİF EGZERSİZ'}
            </div>
            <h2 style={{ 
              fontSize: (currentExercise?.exerciseName?.length > 40) ? '1.8rem' : (currentExercise?.exerciseName?.length > 25) ? '2.5rem' : '3.5rem', 
              margin: 0, fontWeight: 900, color: '#fff', 
              textTransform: 'uppercase', letterSpacing: '-1.5px', lineHeight: 1,
              maxWidth: '100%', overflowWrap: 'break-word'
            }}>
              {currentExercise?.exerciseName || (currentStep === 'warmup' ? "Isınma" : "Egzersiz")}
            </h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="workout-badge workout-badge-primary" style={{ fontSize: '0.9rem', padding: '6px 16px', fontWeight: 900 }}>{currentExercise?.targetMuscle?.toUpperCase()}</span>
              
              {/* Progress Bar indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '10px 20px', borderRadius: '18px', border: '1px solid var(--glass-border)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  width: '180px', 
                  height: '10px', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${
                      currentStep === 'warmup' 
                        ? (warmupExercises.length > 0 ? ((warmupIdx + 1) / warmupExercises.length) * 100 : 0)
                        : (exercises.length > 0 ? ((exerciseIdx + 1) / exercises.length) * 100 : 0)
                    }%`,
                    background: currentStep === 'warmup' ? 'linear-gradient(to right, #38bdf8, #0ea5e9)' : 'linear-gradient(to right, var(--primary), var(--secondary))',
                    borderRadius: '10px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: currentStep === 'warmup' ? '0 0 10px rgba(14, 165, 233, 0.6)' : '0 0 10px var(--primary-glow)'
                  }}></div>
                </div>
                <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', fontWeight: 900, fontFamily: 'monospace', minWidth: '55px', textAlign: 'right' }}>
                  {currentStep === 'warmup' ? `${warmupIdx + 1}/${warmupExercises.length}` : `${exerciseIdx + 1}/${exercises.length}`}
                </span>
              </div>
              {currentStep === 'exercise' && currentExercise?.isAlternative && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#38bdf8', 
                  background: 'rgba(14, 165, 233, 0.12)', 
                  border: '1px solid rgba(14, 165, 233, 0.3)', 
                  borderRadius: '10px', 
                  padding: '6px 14px', 
                  fontWeight: 800, 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 15px rgba(14, 165, 233, 0.1)',
                  lineHeight: '1.2'
                }}>
                  🛡️ AI Güvenlik Filtresi: {currentExercise.injuryReason || 'Sakatlık Önleme'} alternatifi
                </span>
              )}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
             {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;
