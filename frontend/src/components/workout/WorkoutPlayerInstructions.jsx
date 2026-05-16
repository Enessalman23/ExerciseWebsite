import React from 'react';
import { ListOrdered, Info } from 'lucide-react';

const WorkoutPlayerInstructions = ({ currentExercise }) => {
  return (
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
  );
};

export default WorkoutPlayerInstructions;
