import React from 'react';
import { X } from 'lucide-react';
import { useWorkoutPlayer } from '../hooks/useWorkoutPlayer';
import ExerciseDisplay from './workout/ExerciseDisplay';
import WorkoutPlayerHeader from './workout/WorkoutPlayerHeader';
import WorkoutPlayerInstructions from './workout/WorkoutPlayerInstructions';
import WorkoutPlayerControls from './workout/WorkoutPlayerControls';

const WorkoutPlayer = ({ plan, onClose }) => {
  const player = useWorkoutPlayer(plan, onClose);

  // Safety check FIRST to prevent crashes
  if (!plan || !plan.days || plan.days.length === 0 || !player.currentDay) {
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

  const {
    currentDayIdx,
    setCurrentDayIdx,
    currentDay,
    warmupExercises,
    exercises,
    currentStep,
    setCurrentStep,
    exerciseIdx,
    setExerciseIdx,
    setWarmupIdx,
    warmupIdx,
    completedDays,
    currentWarmup,
    currentExercise,
    getImageUrl,
    progressPercentage,
    isFocused,
    isMuted,
    setIsMuted,
    restTimer,
    skipTimer,
    stopTimer,
    toggleFullScreen,
    handleStepNext
  } = player;

  return (
    <div className="animate-fade-in" style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0,
      width: '100vw', height: '100vh',
      background: '#020617', 
      zIndex: 10000, color: '#fff', display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Cinematic Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>
      
      {/* TOP PROGRESS BAR */}
      <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.03)', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          height: '100%', width: `${progressPercentage}%`, 
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 30px var(--primary-glow)'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
          toggleFullScreen={toggleFullScreen}
          isFocused={isFocused}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />

        {/* MAIN CONTENT AREA */}
        <div style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: isFocused ? '1fr' : '1.4fr 0.6fr', 
          gap: '40px', 
          padding: isFocused ? '40px 100px' : '0 40px 40px', 
          overflow: 'hidden',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
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
              isFocused={isFocused}
            >
              {!isFocused && (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="premium-glass-dark" style={{ padding: '25px 35px', textAlign: 'center', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{currentExercise?.sets}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 800, letterSpacing: '1px', marginTop: '5px' }}>TOPLAM SET</div>
                  </div>
                  <div className="premium-glass-dark" style={{ padding: '25px 35px', textAlign: 'center', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1 }}>{currentExercise?.reps}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 800, letterSpacing: '1px', marginTop: '5px' }}>TEKRAR HEDEFİ</div>
                  </div>
                </div>
              )}
            </ExerciseDisplay>

            {/* Next Exercise Preview (Mini HUD) */}
            {(currentStep !== 'finished' && !isFocused) && (
               <div className="glass-panel" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>SIRADAKİ:</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                    {currentStep === 'warmup' 
                      ? (warmupIdx < warmupExercises.length - 1 ? warmupExercises[warmupIdx+1].exerciseName : exercises[0]?.exerciseName)
                      : (exerciseIdx < exercises.length - 1 ? exercises[exerciseIdx+1].exerciseName : "Antrenman Sonu")}
                  </div>
               </div>
            )}
          </div>

          {!isFocused && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxHeight: '100%', overflow: 'hidden' }}>
              <WorkoutPlayerInstructions currentExercise={currentExercise} />
              
              <div style={{ flex: 1 }}></div>

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
          )}

          {isFocused && (
            <div style={{ 
              position: 'fixed', bottom: '0', left: '0', right: '0', 
              padding: '30px 60px', 
              background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95), transparent)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              zIndex: 100, gap: '40px'
            }}>
               <div style={{ flex: 1 }}></div> {/* Spacer to keep controls centered */}
               
               <div style={{ width: '500px' }}>
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

               <div style={{ display: 'flex', gap: '15px', flex: 1, justifyContent: 'flex-end' }}>
                  <div className="premium-glass-dark" style={{ padding: '15px 25px', textAlign: 'center', borderRadius: '20px', border: '1px solid var(--glass-border)', minWidth: '120px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{currentExercise?.sets}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 800, letterSpacing: '1px', marginTop: '4px' }}>TOPLAM SET</div>
                  </div>
                  <div className="premium-glass-dark" style={{ padding: '15px 25px', textAlign: 'center', borderRadius: '20px', border: '1px solid var(--glass-border)', minWidth: '120px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1 }}>{currentExercise?.reps}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 800, letterSpacing: '1px', marginTop: '4px' }}>TEKRAR</div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
