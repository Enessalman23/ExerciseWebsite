import React from 'react';
import { History, RotateCcw, RefreshCcw, Dumbbell } from 'lucide-react';
import WorkoutCard from './WorkoutCard';

const WorkoutHistory = ({ 
  historyItems, 
  loading, 
  fetchHistory, 
  expandedPlan, 
  setExpandedPlan, 
  setActiveSession, 
  handleDeleteWorkout,
  parseWorkoutJson
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ 
               background: 'linear-gradient(135deg, var(--secondary), #38bdf8)', 
               padding: '12px', borderRadius: '18px', color: '#fff',
               boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)'
             }}>
               <History size={24} />
             </div>
             <div>
               <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>Program Geçmişi</h2>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Son hazırlanan 10 program listeleniyor</p>
             </div>
           </div>
           <button 
             onClick={fetchHistory} 
             className={`btn btn-secondary hover-scale ${loading ? 'animate-spin' : ''}`}
             style={{ borderRadius: '16px', width: '56px', height: '56px', padding: 0 }}
           >
             <RotateCcw size={22} />
           </button>
        </div>

       {loading && historyItems.length === 0 ? (
         <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <RefreshCcw size={48} className="animate-spin" style={{ opacity: 0.2, margin: '0 auto' }} />
            <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Antrenman geçmişi taranıyor...</p>
         </div>
       ) : historyItems.length === 0 ? (
         <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', opacity: 0.6, border: '2px dashed var(--border-color)' }}>
            <div style={{ background: 'var(--bg-color)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
               <Dumbbell size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Henüz Program Yok</h3>
            <p style={{ maxWidth: '300px', margin: '12px auto' }}>Hedeflerine yönelik ilk yapay zeka programını hemen şimdi oluştur.</p>
         </div>
       ) : (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           {historyItems.map((item, idx) => (
             <WorkoutCard 
               key={item.workoutPlanId}
               item={item}
               idx={idx}
               expandedPlan={expandedPlan}
               setExpandedPlan={setExpandedPlan}
               setActiveSession={setActiveSession}
               handleDeleteWorkout={handleDeleteWorkout}
               parseWorkoutJson={parseWorkoutJson}
             />
           ))}
         </div>
       )}
    </div>
  );
};

export default WorkoutHistory;
