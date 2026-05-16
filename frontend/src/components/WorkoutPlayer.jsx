import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import ExerciseDisplay from './workout/ExerciseDisplay';
import WorkoutPlayerHeader from './workout/WorkoutPlayerHeader';
import WorkoutPlayerInstructions from './workout/WorkoutPlayerInstructions';
import WorkoutPlayerControls from './workout/WorkoutPlayerControls';

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
      <WorkoutPlayerHeader
        plan={plan}
        currentDay={currentDay}
        currentDayIdx={currentDayIdx}
        completedDays={completedDays}
        setCurrentDayIdx={setCurrentDayIdx}
        setCurrentStep={setCurrentStep}
        setExerciseIdx={setExerciseIdx}
        setWarmupIdx={setWarmupIdx}
        stopTimer={stopTimer}
        onClose={onClose}
        warmupExercises={warmupExercises}
      />

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
          
          <WorkoutPlayerInstructions currentExercise={currentExercise} />
          
          <WorkoutPlayerControls
            currentStep={currentStep}
            warmupIdx={warmupIdx}
            warmupExercises={warmupExercises}
            handleStepNext={handleStepNext}
            skipTimer={skipTimer}
            onClose={onClose}
            currentDayName={currentDay?.dayName}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
