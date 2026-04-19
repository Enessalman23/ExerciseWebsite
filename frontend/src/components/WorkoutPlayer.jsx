import React, { useState, useEffect } from 'react';
import { 
  X, PlayCircle, SkipForward, CheckCircle2, 
  Timer, Clock, ArrowRight, Dumbbell, Info,
  ChevronRight, ListOrdered, Award, Zap
} from 'lucide-react';

const WorkoutPlayer = ({ plan, onClose }) => {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState('exercise'); // 'warmup', 'exercise', 'rest', 'finished'
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [warmupIdx, setWarmupIdx] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Safety check
  if (!plan || !plan.days || plan.days.length === 0) {
    return (
      <div className="modal-overlay" style={{ background: 'var(--bg-color)', zIndex: 9999 }}>
        <div className="glass-panel text-center" style={{ padding: '60px', maxWidth: '500px' }}>
          <X size={60} color="var(--error)" style={{ margin: '0 auto 20px' }} />
          <h2>Geçersiz Antrenman</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Program verileri okunamadı.</p>
          <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Kapat</button>
        </div>
      </div>
    );
  }

  const currentDay = plan.days[currentDayIdx];
  const warmupExercises = currentDay.warmupExercises || [];
  const exercises = currentDay.exercises || [];
  
  const currentWarmup = warmupExercises[warmupIdx];
  const currentExercise = currentStep === 'warmup' ? currentWarmup : exercises[exerciseIdx];

  useEffect(() => {
    let interval = null;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => setRestTimer(prev => prev - 1), 1000);
    } else if (restTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
      handleStepNext();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer]);

  const handleStepNext = () => {
    if (currentStep === 'warmup') {
      if (warmupIdx < warmupExercises.length - 1) {
        setWarmupIdx(prev => prev + 1);
      } else {
        setCurrentStep('exercise');
        setExerciseIdx(0);
      }
    } else if (currentStep === 'exercise') {
      const restSec = parseInt(currentExercise.rest) || 60;
      setRestTimer(restSec);
      setCurrentStep('rest');
      setIsTimerActive(true);
    } else if (currentStep === 'rest') {
      if (exerciseIdx < exercises.length - 1) {
        setExerciseIdx(prev => prev + 1);
        setCurrentStep('exercise');
      } else {
        setCurrentStep('finished');
      }
    }
  };

  if (!currentDay || !exercises) return null;

  const totalActions = warmupExercises.length + exercises.length;
  const currentActionIdx = currentStep === 'warmup' ? warmupIdx : warmupExercises.length + exerciseIdx;
  const progressPercentage = ((currentActionIdx + (currentStep === 'rest' || currentStep === 'finished' ? 1 : 0.5)) / totalActions) * 100;

  return (
    <div className="animate-fade-in" style={{ 
      position: 'fixed', inset: 0, 
      background: 'radial-gradient(circle at top right, #0f172a 0%, #020617 100%)', 
      zIndex: 9999, color: '#fff', display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* TOP PROGRESS BAR */}
      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
        <div style={{ 
          height: '100%', width: `${progressPercentage}%`, 
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 20px var(--primary)'
        }}></div>
      </div>

      {/* HEADER */}
      <div style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Aktif Antrenman</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 400 }}>{currentDay.dayName}</div>
          </div>
        </div>
        
        <button onClick={onClose} style={{ 
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '12px', padding: '10px 20px', color: '#fff', 
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          transition: 'all 0.2s'
        }} className="hover-scale">
          <X size={18} /> Antrenmandan Çık
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '60px', padding: '0 60px 60px', overflow: 'hidden' }}>
        
        {/* LEFT PANEL: HERO GIF */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflow: 'hidden' }}>
          
          <div className="glass-panel" style={{ 
            flex: 1, position: 'relative', borderRadius: '40px', overflow: 'hidden', 
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            {currentStep === 'warmup' && currentWarmup && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                {currentWarmup.gifUrl ? (
                  <img 
                    src={`http://localhost:8080/gifs/gifs_360x360/${currentWarmup.gifUrl}`} 
                    alt={currentWarmup.exerciseName}
                    style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=ISINMA+GIF"; }}
                  />
                ) : (
                  <div className="text-center">
                    <Clock size={100} style={{ opacity: 0.1, color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '2rem', marginTop: '20px' }}>Isınma Zamanı</h2>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'exercise' && currentExercise && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                {currentExercise.gifUrl ? (
                  <img 
                    src={`http://localhost:8080/gifs/gifs_360x360/${currentExercise.gifUrl}`} 
                    alt={currentExercise.exerciseName}
                    style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=GIF+Yükleniyor..."; }}
                  />
                ) : (
                  <Dumbbell size={100} style={{ opacity: 0.1 }} />
                )}
              </div>
            )}

            {currentStep === 'rest' && (
              <div className="text-center">
                <div style={{ fontSize: '10rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-5px', lineHeight: 1 }}>
                  {restTimer}
                </div>
                <div style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px' }}>
                  Dinlenme Zamanı
                </div>
              </div>
            )}

            {currentStep === 'finished' && (
              <div className="text-center animate-fade-in">
                <Award size={120} style={{ color: 'var(--secondary)' }} />
                <h2 style={{ fontSize: '4rem', marginTop: '30px' }}>YIKTIN GEÇTİN!</h2>
              </div>
            )}
          </div>

          {(currentStep === 'warmup' || currentStep === 'exercise' || currentStep === 'rest') && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentStep === 'warmup' ? 'var(--secondary)' : 'var(--primary)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                   {currentStep === 'warmup' ? <Zap size={16} /> : <Dumbbell size={16} />}
                   {currentStep === 'warmup' ? 'ISINMA' : 'ANA ANTRENMAN'}
                </div>
                <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>{currentExercise?.exerciseName || (currentStep === 'warmup' ? "Isınma Hareketi" : "Egzersiz")}</h2>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <span style={{ fontSize: '1.2rem', color: currentStep === 'warmup' ? 'var(--secondary)' : 'var(--primary)', fontWeight: 600 }}>{currentExercise?.targetMuscle?.toUpperCase()}</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>{currentStep === 'warmup' ? `Isınma ${warmupIdx + 1} / ${warmupExercises.length}` : `Egzersiz ${exerciseIdx + 1} / ${exercises.length}`}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px 30px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{currentExercise?.sets}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>SET GEREĞİ</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px 30px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{currentExercise?.reps}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>TEKRAR</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxHeight: '100%', overflow: 'hidden' }}>
          
          <div className="glass-panel" style={{ 
            flex: 1, padding: '40px', overflowY: 'auto', 
            background: 'rgba(255,255,255,0.03)', borderRadius: '40px',
            display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', fontSize: '1.4rem' }}>
              <ListOrdered size={24} color="var(--primary)" /> Nasıl Uygulanır?
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {currentExercise?.instructions && currentExercise.instructions.length > 0 ? (
                currentExercise.instructions.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      minWidth: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.8 }}>
                      {step.replace(/Step:\d+\s*/g, '')}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                   <Info size={40} style={{ margin: '0 auto 15px' }} />
                   <p>Açıklama bulunamadı. Formuna odaklan!</p>
                </div>
              )}
            </div>
          </div>

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
                onClick={() => { setIsTimerActive(false); handleStepNext(); }} 
                className="btn btn-secondary" 
                style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Dinlenmeyi Atla <SkipForward size={22} style={{ marginLeft: '10px' }} />
              </button>
            )}

            {currentStep === 'finished' && (
              <button 
                onClick={onClose} 
                className="btn btn-primary" 
                style={{ padding: '25px', fontSize: '1.4rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
              >
                Antrenmanı Bitir <CheckCircle2 size={24} style={{ marginLeft: '10px' }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
