import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveWorkoutWidget = ({ latestWorkout }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', height: '100%', minHeight: '280px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'rotate(15deg)' }}>
        <Dumbbell size={180} />
      </div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
            <Dumbbell size={22} />
          </div>
          Aktif Program
        </h3>
        <Link to="/workouts" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>BAŞLAT</Link>
      </header>

      {latestWorkout ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>MEVCUT PLAN</div>
          <div className="text-glow" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.2 }}>{latestWorkout.planName || `Antrenman #${latestWorkout.workoutPlanId}`}</div>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 500 }}>Sınırlarını zorlamak için hazır mısın?</p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
              <div className="workout-badge workout-badge-secondary" style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700 }}>HAZIR</div>
              <div className="workout-badge workout-badge-primary" style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700 }}>BUGÜN: FULL BODY</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5 }}>
           <Dumbbell size={48} style={{ marginBottom: '15px' }} />
           <p style={{ fontSize: '0.95rem', margin: 0 }}>Henüz aktif bir programın yok.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkoutWidget;
