import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, SkipForward, CheckCircle2, 
  Timer, ArrowRight, Info,
  ChevronRight, ListOrdered, Zap
} from 'lucide-react';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import ExerciseDisplay from './workout/ExerciseDisplay';

const WorkoutPlayer = ({ plan, onClose }) => {
  // Safety check FIRST to prevent crashes
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

  const [currentDayIdx, setCurrentDayIdx] = useState(() => {
    try {
      const startIdx = plan?.startDayIdx || 0;
      return (plan?.days && startIdx >= 0 && startIdx < plan.days.length) ? startIdx : 0;
    } catch (e) { return 0; }
  });

  const currentDay = (plan?.days && plan.days[currentDayIdx]) || (plan?.days && plan.days[0]) || null;
  const warmupExercises = currentDay?.warmupExercises || [];
  const exercises = currentDay?.exercises || [];

  const [currentStep, setCurrentStep] = useState(warmupExercises.length > 0 ? 'warmup' : 'exercise');
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [warmupIdx, setWarmupIdx] = useState(0);
  
  // Kalıcı ilerleme takibi için localStorage kullanıyoruz
  const storageKey = `completed_days_${plan.workoutPlanId || 'default'}`;
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Tamamlanan günleri kaydet
  useEffect(() => {
    if (currentStep === 'finished' && !completedDays.includes(currentDayIdx)) {
      const newCompleted = [...completedDays, currentDayIdx];
      setCompletedDays(newCompleted);
      localStorage.setItem(storageKey, JSON.stringify(newCompleted));
    }
  }, [currentStep, currentDayIdx, completedDays, storageKey]);

  // Safety return if still no data
  if (!currentDay) {
    return (
      <div className="modal-overlay" style={{ background: 'var(--bg-color)', zIndex: 9999 }}>
        <div className="glass-panel text-center" style={{ padding: '60px' }}>
          <h2>Hata</h2>
          <p>Seçilen güne ait veri bulunamadı.</p>
          <button onClick={onClose} className="btn btn-primary">Kapat</button>
        </div>
      </div>
    );
  }

  const currentWarmup = warmupExercises[warmupIdx];
  const currentExercise = currentStep === 'warmup' ? currentWarmup : exercises[exerciseIdx];



  const handleStepNextRef = useRef();
  const startTimerRef = useRef();

  const handleStepNext = useCallback(() => {
    if (currentStep === 'warmup') {
      if (warmupIdx < warmupExercises.length - 1) {
        setWarmupIdx(prev => prev + 1);
      } else {
        setCurrentStep('exercise');
        setExerciseIdx(0);
      }
    } else if (currentStep === 'exercise') {
      const restVal = currentExercise?.rest;
      const restSec = (restVal !== null && restVal !== undefined && !isNaN(parseInt(restVal))) ? parseInt(restVal) : 60;
      setCurrentStep('rest');
      if (startTimerRef.current) startTimerRef.current(restSec);
    } else if (currentStep === 'rest') {
      if (exerciseIdx < exercises.length - 1) {
        setExerciseIdx(prev => prev + 1);
        setCurrentStep('exercise');
      } else {
        setCurrentStep('finished');
      }
    }
  }, [currentStep, warmupIdx, warmupExercises.length, currentExercise, exercises.length, exerciseIdx]);

  handleStepNextRef.current = handleStepNext;

  const { restTimer, startTimer, stopTimer, skipTimer } = useWorkoutTimer(() => handleStepNextRef.current());
  startTimerRef.current = startTimer;

  // Cleanup timer on day change or unmount
  useEffect(() => {
    return () => stopTimer();
  }, [currentDayIdx, stopTimer]);


  const getImageUrl = (path) => {
    if (!path) return '';
    if (!path.includes('gifs_360x360')) {
        return `http://localhost:8080/exercise-images/${path}`;
    }
    return `http://localhost:8080/gifs/gifs_360x360/${path}`;
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Aktif Antrenman</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 400 }}>{currentDay.dayName}</div>
            </div>
          </div>

          {plan.days.length > 1 && (
            <div style={{ display: 'flex', gap: '15px' }}>
              {plan.days.map((day, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    setCurrentDayIdx(idx);
                    setCurrentStep(warmupExercises.length > 0 ? 'warmup' : 'exercise');
                    setExerciseIdx(0);
                    setWarmupIdx(0);
                    stopTimer();
                  }}
                  style={{ 
                    padding: '8px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, 
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: currentDayIdx === idx ? 'var(--primary)' : 'transparent',
                    color: currentDayIdx === idx ? '#fff' : (completedDays.includes(idx) ? 'var(--secondary)' : 'rgba(255,255,255,0.4)'),
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {completedDays.includes(idx) && <CheckCircle2 size={14} />}
                  GÜN {idx + 1}
                </button>
              ))}
            </div>
          )}
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
        
        <ExerciseDisplay 
          currentStep={currentStep}
          currentWarmup={currentWarmup}
          currentExercise={currentExercise}
          restTimer={restTimer}
          getImageUrl={getImageUrl}
          warmupIdx={warmupIdx}
          warmupExercises={warmupExercises}
          exerciseIdx={exerciseIdx}
          exercises={exercises}
        >
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
        </ExerciseDisplay>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxHeight: '100%', overflow: 'hidden' }}>
          
          <div className="glass-panel" style={{ 
            flex: 1, padding: '40px', overflowY: 'auto', 
            background: 'rgba(255,255,255,0.03)', borderRadius: '40px',
            display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', fontSize: '1.4rem', color: '#fff' }}>
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
                    <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.9, color: '#fff' }}>
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
                onClick={skipTimer} 
                className="btn btn-secondary" 
                style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                Dinlenmeyi Atla <SkipForward size={22} style={{ marginLeft: '10px' }} />
              </button>
            )}

            {currentStep === 'finished' && (
              <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                <button 
                  onClick={onClose} 
                  className="btn btn-primary" 
                  style={{ padding: '20px 60px', fontSize: '1.2rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
                >
                  <CheckCircle2 size={24} style={{ marginRight: '10px' }} /> Antrenmanı Bitir ve Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
