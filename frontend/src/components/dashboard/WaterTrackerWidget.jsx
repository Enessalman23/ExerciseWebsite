import React, { useState } from 'react';
import { Droplet, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const WaterTrackerWidget = () => {
  const targetMl = 3000; // 3 Liters target
  const [ml, setMl] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('water_tracker_ml_' + today);
    return saved ? parseInt(saved, 10) : 0;
  });
  const { showToast } = useToast();

  const addWater = (amount) => {
    if (ml < targetMl) {
      const newVal = Math.min(targetMl, ml + amount);
      setMl(newVal);
      const today = new Date().toDateString();
      localStorage.setItem('water_tracker_ml_' + today, newVal);

      if (newVal === targetMl) {
        showToast("Harika! Günlük su hedefini tamamladın! 💦🎉", "success");
      } else {
        showToast(`+${amount}ml su eklendi!`, "success");
      }
    }
  };

  const resetWater = () => {
    setMl(0);
    const today = new Date().toDateString();
    localStorage.removeItem('water_tracker_ml_' + today);
  };

  const fillPercentage = (ml / targetMl) * 100;

  return (
    <div className="glass-panel hover-glow" style={{ 
      padding: '30px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      minHeight: '340px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic CSS Wave Animation Styles */}
      <style>{`
        @keyframes rotate-wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .liquid-container {
          width: 90px;
          height: 140px;
          border: 3px solid rgba(14, 165, 233, 0.4);
          border-radius: 16px 16px 32px 32px;
          position: relative;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.6);
          boxShadow: inset 0 8px 20px rgba(0,0,0,0.6);
          display: flex;
          align-items: flex-end;
        }
        .water-wave {
          position: absolute;
          width: 220px;
          height: 220px;
          left: calc(50% - 110px);
          background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
          border-radius: 38% 42% 40% 45%;
          animation: rotate-wave 8s linear infinite;
          transition: bottom 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 2;
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
        }
        .water-wave-back {
          position: absolute;
          width: 230px;
          height: 230px;
          left: calc(50% - 115px);
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(56, 189, 248, 0.4) 100%);
          border-radius: 40% 38% 44% 42%;
          animation: rotate-wave 12s linear infinite;
          transition: bottom 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }
        .glass-reflection {
          position: absolute;
          top: 0;
          left: 10%;
          width: 15%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 100%);
          border-radius: 40px;
          z-index: 5;
          pointer-events: none;
        }
        .quick-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .quick-btn:hover {
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateY(-2px);
          color: #38bdf8;
        }
      `}</style>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 800 }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '8px', borderRadius: '10px', color: '#0ea5e9' }}>
            <Droplet size={20} />
          </div>
          Su Takibi
        </h3>
        <button 
          onClick={resetWater} 
          className="btn-secondary" 
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }} 
          title="Sıfırla"
        >
          <RotateCcw size={14} />
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '25px' }}>
        {/* REDESIGNED WAVE GLASS */}
        <div className="liquid-container">
          <div className="water-wave-back" style={{ bottom: ml === 0 ? '-250px' : `calc(${fillPercentage}% - 230px)` }}></div>
          <div className="water-wave" style={{ bottom: ml === 0 ? '-240px' : `calc(${fillPercentage}% - 220px)` }}></div>
          <div className="glass-reflection"></div>
        </div>

        {/* CONTROLS & READOUT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {ml} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {targetMl} ml</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
              Bugün: <span style={{ color: '#0ea5e9' }}>{((ml / targetMl) * 100).toFixed(0)}% tamamlandı</span>
            </div>
          </div>

          {/* QUICK ADD BUTTONS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="quick-btn" onClick={() => addWater(250)}>+250ml</button>
            <button className="quick-btn" onClick={() => addWater(500)}>+500ml</button>
            <button className="quick-btn" onClick={() => addWater(750)}>+750ml</button>
          </div>

          <button
            onClick={() => addWater(250)}
            disabled={ml >= targetMl}
            className="btn btn-primary premium-shadow"
            style={{
              width: '100%', 
              padding: '12px', 
              fontSize: '0.95rem', 
              fontWeight: 700,
              marginTop: '5px',
              background: ml >= targetMl ? 'var(--success)' : 'linear-gradient(135deg, #0ea5e9, #2563eb)'
            }}
          >
            {ml >= targetMl ? 'Hedefe Ulaşıldı! 💦' : <><Plus size={16} /> Hızlı Bardak Ekle</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTrackerWidget;
