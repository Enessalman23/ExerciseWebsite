import React from 'react';
import { ListOrdered, Info } from 'lucide-react';

const WorkoutPlayerInstructions = ({ currentExercise }) => {
  return (
    <div className="premium-glass-dark" style={{ 
      flex: 1, padding: '40px', overflowY: 'auto', 
      borderRadius: '40px', border: '1px solid var(--glass-border)',
      display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', color: '#fff', fontWeight: 900, margin: 0 }}>
          <ListOrdered size={24} color="var(--primary)" /> UYGULAMA REHBERİ
        </h3>
        <Info size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
      </div>
      
      <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {currentExercise?.instructions && currentExercise.instructions.length > 0 ? (
          currentExercise.instructions.map((step, idx) => (
            <div key={idx} className="animate-fade-in" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ 
                minWidth: '40px', height: '40px', background: 'var(--primary)', 
                borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '1.2rem', fontWeight: 900, color: '#fff', boxShadow: '0 8px 15px var(--primary-glow)'
              }}>
                {idx + 1}
              </div>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {step.replace(/Step:\d+\s*/g, '')}
              </p>
            </div>
          ))
        ) : (
          <div style={{ padding: '60px 40px', textAlign: 'center', opacity: 0.5 }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
               <Info size={50} color="#fff" />
             </div>
             <p style={{ fontSize: '1.2rem', color: '#fff' }}>Şu an için detaylı rehber bulunmuyor. Formuna odaklan!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayerInstructions;
