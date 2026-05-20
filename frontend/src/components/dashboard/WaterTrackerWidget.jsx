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
    <div className="glass-panel hover-glow" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '280px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 800 }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '8px', borderRadius: '10px', color: '#0ea5e9' }}>
            <Droplet size={20} />
          </div>
          Su Takibi
        </h3>
        <button onClick={resetGlasses} className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }} title="Sıfırla">
          <RotateCcw size={14} />
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '30px' }}>
        
        {/* Animated Water Cup */}
        <div style={{ 
          width: '80px', height: '120px', 
          border: '2px solid rgba(14, 165, 233, 0.3)', 
          borderRadius: '12px 12px 30px 30px',
          position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', 
            height: `${fillPercentage}%`,
            background: 'linear-gradient(to top, #0ea5e9 0%, #38bdf8 100%)',
            transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: 0.9,
            boxShadow: '0 -4px 15px rgba(14, 165, 233, 0.5)'
          }}>
          </div>
          <div style={{ position: 'absolute', top: 0, left: '15%', width: '15%', height: '100%', background: 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 100%)', borderRadius: '40px' }}></div>
        </div>

        {/* Info & Controls */}
        <div style={{ flex: 1 }}>
          <div className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>
            {glasses} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {maxGlasses}</span>
          </div>
          <div style={{ margin: '12px 0 24px 0', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
             Hedef: <span style={{ color: '#0ea5e9' }}>{maxGlasses * 250}ml</span>
          </div>

          <button 
            onClick={addGlass}
            disabled={glasses >= maxGlasses}
            className="btn btn-primary premium-shadow" 
            style={{ 
              width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700,
              background: glasses >= maxGlasses ? 'var(--success)' : 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}
          >
            {glasses >= maxGlasses ? 'Tamamlandı! ✨' : <><Plus size={18} /> Su Ekle</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTrackerWidget;
