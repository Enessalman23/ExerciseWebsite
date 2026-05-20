import { X, CheckCircle2, Zap, Volume2, VolumeX } from 'lucide-react';

const WorkoutPlayerHeader = ({ 
  plan, currentDay, currentDayIdx, completedDays, 
  setCurrentDayIdx, setCurrentStep, setExerciseIdx, 
  setWarmupIdx, stopTimer, onClose, warmupExercises, 
  toggleFullScreen, isFocused, setIsFocused,
  isMuted, setIsMuted
}) => {
  return (
    <div style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="premium-shadow" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '12px', borderRadius: '14px', boxShadow: '0 8px 15px var(--primary-glow)' }}>
            <Zap size={22} />
          </div>
          {!isFocused && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px' }}>AKTİF ANTRENMAN GÜNÜ</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{currentDay?.dayName}</div>
            </div>
          )}
        </div>

        {(Array.isArray(plan.days) && plan.days.length > 1 && !isFocused) && (
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
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
                  padding: '8px 18px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, 
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: currentDayIdx === idx ? 'var(--primary)' : 'transparent',
                  color: currentDayIdx === idx ? '#fff' : (completedDays.includes(idx) ? 'var(--success)' : 'rgba(255,255,255,0.3)'),
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: currentDayIdx === idx ? '0 5px 15px var(--primary-glow)' : 'none'
                }}
              >
                {completedDays.includes(idx) && <CheckCircle2 size={14} />}
                GÜN {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', 
            borderRadius: '16px', padding: '12px', color: isMuted ? 'var(--text-muted)' : 'var(--primary)', 
            cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          className="hover-scale"
        >
          {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>

        <button onClick={onClose} style={{ 
          background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', 
          borderRadius: '16px', padding: '12px 24px', color: '#f43f5e', 
          fontSize: '0.85rem', fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
          transition: 'all 0.3s ease'
        }} className="hover-scale">
          <X size={20} /> Antrenmanı Bitir
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlayerHeader;
