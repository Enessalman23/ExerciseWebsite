import React from 'react';
import { 
  Award, PlayCircle, ChevronDown, ChevronUp, Trash2, Calendar, Layout, ArrowUpRight 
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
       className={`workout-card animate-fade-in ${isExpanded ? 'expanded' : ''}`}
       style={{ 
         borderLeft: idx === 0 ? '6px solid var(--primary)' : '1px solid var(--border-color)',
         animationDelay: `${idx * 0.1}s`
       }}
     >
      <div className="flex items-center justify-between" style={{ padding: '28px' }}>
         <div style={{ flex: 1, display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="glass-panel" style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
               <Award size={32} color={idx === 0 ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('tr-TR')}</span>
               </div>
               <h3 style={{ fontSize: '1.4rem', margin: '0 0 10px 0' }}>{item.planName}</h3>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="workout-badge workout-badge-secondary">
                    <Calendar size={14} style={{ marginRight: '4px' }} /> {planData?.days?.length || 0} GÜN
                  </div>
                  {idx === 0 && <div className="workout-badge workout-badge-primary">SON OLUŞTURULAN</div>}
               </div>
            </div>
         </div>
         
         <div style={{ display: 'flex', gap: '12px' }}>
            {!isCorrupted && (
              <button 
                  onClick={(e) => { e.stopPropagation(); setActiveSession(planData); }} 
                   className="btn btn-primary glow-effect" 
                  style={{ padding: '12px 24px' }}
               >
                  <PlayCircle size={20} /> Başlat
               </button>
            )}
            <button onClick={() => setExpandedPlan(isExpanded ? null : item.workoutPlanId)} className="btn btn-secondary" style={{ padding: '12px' }}>
               {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(item.workoutPlanId); }} className="btn btn-secondary" style={{ color: 'var(--error)', padding: '12px' }}>
               <Trash2 size={24} />
            </button>
         </div>
      </div>

      {isExpanded && !isCorrupted && planData && (
         <div className="animate-fade-in" style={{ padding: '0 28px 28px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '24px' }}>
               {planData.days?.map((day, dIdx) => (
                 <div key={dIdx} className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--primary)', fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                       {day.dayName.toUpperCase()}
                       <Layout size={16} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {day.exercises?.map((ex, eIdx) => (
                         <div key={eIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                               <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ex.exerciseName}</span>
                               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ex.targetMuscle}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                               <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>{ex.sets}</span>
                               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '4px' }}>set</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
               <button onClick={() => setActiveSession(planData)} className="btn btn-primary" style={{ padding: '10px 30px', borderRadius: '12px' }}>
                  Bu Programa Başla <ArrowUpRight size={18} style={{ marginLeft: '8px' }} />
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default WorkoutCard;
