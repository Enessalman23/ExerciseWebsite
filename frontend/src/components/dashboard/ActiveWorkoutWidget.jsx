import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveWorkoutWidget = ({ latestWorkout }) => {
  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Dumbbell size={22} color="var(--primary)" /> Aktif Program</h3>
        <Link to="/workouts" style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 700 }}>Başlat</Link>
      </div>
      {latestWorkout ? (
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Program {latestWorkout.id}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Haftalık disiplinine devam et!</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <span className="workout-badge workout-badge-secondary">Hazır</span>
              <span className="workout-badge workout-badge-primary">Sıradaki: Göğüs</span>
          </div>
        </div>
      ) : <p style={{ opacity: 0.5 }}>Henüz programın yok.</p>}
    </div>
  );
};

export default ActiveWorkoutWidget;
