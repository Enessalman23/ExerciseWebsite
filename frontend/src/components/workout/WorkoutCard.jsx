import React from 'react';
import { 
  Award, PlayCircle, ChevronDown, ChevronUp, Trash2, Calendar, Layout, ArrowUpRight, CheckCircle2, Activity
} from 'lucide-react';

const WorkoutCard = ({ 
  item, 
  idx, 
  expandedPlan, 
  setExpandedPlan, 
  setActiveSession, 
  handleDeleteWorkout
}) => {
  const planData = JSON.parse(item.workoutPlanJson);
  const isExpanded = expandedPlan === item.workoutPlanId;
  const isCorrupted = planData === "CORRUPTED";
  
  return (
    <div 
       className={`workout-card animate-fade-in hover-glow ${isExpanded ? 'expanded' : ''}`}
       style={{ 
         borderLeft: idx === 0 ? '6px solid var(--primary)' : '1px solid var(--border-color)',
         animationDelay: `${idx * 0.1}s`,
         background: 'var(--surface-color)',
         borderRadius: '24px',
         marginBottom: '16px'
       }}
     >
      <div className="flex items-center justify-between" style={{ padding: '32px 40px' }}>
         <div style={{ flex: 1, display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div className="glass-panel" style={{ 
              width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              background: idx === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: idx === 0 ? '0 15px 30px var(--primary-glow)' : 'none'
            }}>
               <Award size={idx === 0 ? 40 : 32} color={idx === 0 ? '#fff' : 'var(--text-muted)'} className={idx === 0 ? 'floating' : ''} />
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? 'var(--success)' : 'var(--text-muted)' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {(() => {
                      const d = new Date(item.createdAt);
                      return isNaN(d.getTime()) ? 'YENİ SİSTEM' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                    })()}
                  </span>
               </div>
               <h3 className="text-glow" style={{ fontSize: '1.8rem', margin: '0 0 14px 0', fontWeight: 900, letterSpacing: '-1px' }}>{item.planName || 'İsimsiz Program'}</h3>
               <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="workout-badge workout-badge-secondary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem' }}>
                    <Calendar size={14} style={{ marginRight: '8px' }} /> {planData?.days?.length || 0} ANTRENMAN GÜNÜ
                  </div>
                  {idx === 0 && (
                    <div className="workout-badge workout-badge-primary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', boxShadow: '0 5px 15px var(--primary-glow)' }}>
                      <Activity size={14} style={{ marginRight: '8px' }} /> AKTİF PERFORMANS PLANI
                    </div>
                  )}
               </div>
            </div>
         </div>
         
         <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {!isCorrupted && (
              <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (planData && planData !== "CORRUPTED") {
                      const sessionData = planData.days ? planData : { days: planData };
                      if (Array.isArray(sessionData.days)) {
                        try {
                          if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen().catch(() => {});
                          }
                        } catch (err) {}
                        setActiveSession({ ...sessionData, workoutPlanId: item.workoutPlanId }); 
                      }
                    }
                  }} 
                  className="btn btn-primary" 
                  style={{ height: '56px', padding: '0 30px', borderRadius: '18px', fontSize: '1rem', fontWeight: 800 }}
               >
                  <PlayCircle size={22} /> BAŞLAT
               </button>
            )}
            <button 
              onClick={() => setExpandedPlan(isExpanded ? null : item.workoutPlanId)} 
              className="btn-secondary hover-scale" 
              style={{ width: '56px', height: '56px', borderRadius: '18px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
            >
               {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(item.workoutPlanId); }} 
              className="hover-glow-error hover-scale" 
              style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
            >
               <Trash2 size={22} />
            </button>
         </div>
      </div>

      {isExpanded && !isCorrupted && planData && (
         <div className="animate-fade-in" style={{ padding: '0 30px 30px', borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '30px' }}>
                {planData.days?.map((day, dIdx) => {
                  const storageKey = `completed_days_${item.workoutPlanId}`;
                  const saved = localStorage.getItem(storageKey);
                  const completedDays = saved ? JSON.parse(saved) : [];
                  const isCompleted = completedDays.includes(dIdx);

                  return (
                    <div key={dIdx} className="glass-panel" style={{ 
                      padding: '24px', 
                      background: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'var(--glass-bg)', 
                      border: isCompleted ? '2px solid var(--success)' : '1px solid var(--glass-border)',
                      position: 'relative',
                      borderRadius: '24px',
                      boxShadow: isCompleted ? '0 10px 30px rgba(16, 185, 129, 0.1)' : 'var(--shadow)'
                    }}>
                      <div style={{ fontWeight: 800, marginBottom: '20px', color: isCompleted ? 'var(--success)' : 'var(--primary)', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isCompleted ? <CheckCircle2 size={18} /> : <Layout size={18} />} 
                          {day.dayName.toUpperCase()}
                        </span>
                       <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (planData && planData !== "CORRUPTED") {
                              const sessionData = planData.days ? planData : { days: planData };
                              if (Array.isArray(sessionData.days)) {
                                // Trigger Fullscreen
                                try {
                                  if (document.documentElement.requestFullscreen) {
                                    document.documentElement.requestFullscreen().catch(() => {});
                                  }
                                } catch (err) {}
                                setActiveSession({ ...sessionData, startDayIdx: dIdx, workoutPlanId: item.workoutPlanId }); 
                              }
                            }
                          }}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '10px' }}
                       >
                          BAŞLAT
                       </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                       {day.exercises?.map((ex, eIdx) => (
                         <div key={eIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{ex.exerciseName}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{ex.targetMuscle}</span>
                             </div>
                             <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--secondary)' }}>{ex.sets}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px', fontWeight: 600 }}>set</span>
                             </div>
                         </div>
                       ))}
                    </div>
                 </div>
                    );
                })}
            </div>
         </div>
      )}
    </div>
  );
};

export default WorkoutCard;
