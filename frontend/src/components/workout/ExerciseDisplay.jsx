import React from 'react';
import { Clock, Dumbbell, Award, Zap } from 'lucide-react';

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
  children
}) => {
  const [localImageIdx, setLocalImageIdx] = React.useState(0);

  const images = (currentStep === 'warmup' ? currentWarmup?.images : currentExercise?.images) || [];

  React.useEffect(() => {
    setLocalImageIdx(0);
    if (images.length > 1) {
      const interval = setInterval(() => {
        setLocalImageIdx(prev => (prev + 1) % images.length);
      }, 1500); // 1.5 seconds for a smoother GIF-like feel
      return () => clearInterval(interval);
    }
  }, [currentExercise?.exerciseId, currentWarmup?.exerciseId, currentStep, images.length]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflow: 'hidden' }}>
      
      <div className="glass-panel" style={{ 
        flex: 1, position: 'relative', borderRadius: '40px', overflow: 'hidden', 
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        {currentStep === 'warmup' && currentWarmup && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            {(currentWarmup.images?.length > 0 || currentWarmup.gifUrl) ? (
              <img 
                src={currentWarmup.images?.length > 0 ? getImageUrl(currentWarmup.images[localImageIdx]) : getImageUrl(currentWarmup.gifUrl)} 
                alt={currentWarmup.exerciseName}
                style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', background: '#fff', padding: '20px' }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=ISINMA+GÖRSELİ"; }}
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
            {(currentExercise.images?.length > 0 || currentExercise.gifUrl) ? (
              <img 
                src={currentExercise.images?.length > 0 ? getImageUrl(currentExercise.images[localImageIdx]) : getImageUrl(currentExercise.gifUrl)} 
                alt={currentExercise.exerciseName}
                style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', background: '#fff', padding: '20px' }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=Görsel+Yükleniyor..."; }}
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
            <h2 style={{ fontSize: '4rem', marginTop: '30px', color: 'var(--primary)'}}>YIKTIN GEÇTİN!</h2>
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
              <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
              <span style={{ fontSize: '1.2rem', opacity: 0.7, color: '#fff' }}>{currentStep === 'warmup' ? `Isınma ${warmupIdx + 1} / ${warmupExercises.length}` : `Egzersiz ${exerciseIdx + 1} / ${exercises.length}`}</span>
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;
