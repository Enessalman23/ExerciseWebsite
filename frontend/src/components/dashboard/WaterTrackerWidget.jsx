import React, { useState, useEffect } from 'react';
import { Droplet, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const WaterTrackerWidget = () => {
  const [glasses, setGlasses] = useState(0);
  const maxGlasses = 8;
  const { showToast } = useToast();

  useEffect(() => {
    // Basic local storage persistence for demo purposes
    const today = new Date().toDateString();
    const saved = localStorage.getItem('water_tracker_' + today);
    if (saved) {
      setGlasses(parseInt(saved, 10));
    }
  }, []);

  const addGlass = () => {
    if (glasses < maxGlasses) {
      const newVal = glasses + 1;
      setGlasses(newVal);
      const today = new Date().toDateString();
      localStorage.setItem('water_tracker_' + today, newVal);
      
      if (newVal === maxGlasses) {
        showToast("Tebrikler! Günlük su hedefini tamamladın! 🎉", "success");
      }
    }
  };

  const resetGlasses = () => {
    setGlasses(0);
    const today = new Date().toDateString();
    localStorage.removeItem('water_tracker_' + today);
  };

  const fillPercentage = (glasses / maxGlasses) * 100;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
          <Droplet color="#0ea5e9" /> Su Takibi
        </h3>
        <button onClick={resetGlasses} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Sıfırla">
          <RotateCcw size={16} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Animated Water Cup */}
        <div style={{ 
          width: '70px', height: '100px', 
          border: '3px solid rgba(14, 165, 233, 0.3)', 
          borderRadius: '0 0 15px 15px',
          position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', 
            height: `${fillPercentage}%`,
            background: 'linear-gradient(to top, #0ea5e9, #38bdf8)',
            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0.8
          }}>
            {/* Wave animation effect can be added here with SVG if needed */}
          </div>
        </div>

        {/* Info & Controls */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {glasses} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {maxGlasses} Bardak</span>
          </div>
          <p style={{ margin: '5px 0 15px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Hedef: 2 Litre
          </p>

          <button 
            onClick={addGlass}
            disabled={glasses >= maxGlasses}
            className="btn btn-primary" 
            style={{ 
              width: '100%', padding: '10px', fontSize: '0.9rem',
              background: glasses >= maxGlasses ? 'var(--success)' : 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
            }}
          >
            <Plus size={16} /> {glasses >= maxGlasses ? 'Hedef Tamamlandı!' : 'Su İç'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTrackerWidget;
