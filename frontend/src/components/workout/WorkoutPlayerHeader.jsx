import React from 'react';
import { X, CheckCircle2, Zap } from 'lucide-react';

const WorkoutPlayerHeader = ({ plan, currentDay, currentDayIdx, completedDays, setCurrentDayIdx, setCurrentStep, setExerciseIdx, setWarmupIdx, stopTimer, onClose, warmupExercises }) => {
  return (
    <div style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Aktif Antrenman</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 400 }}>{currentDay?.dayName}</div>
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
  );
};

export default WorkoutPlayerHeader;
