import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const BodyAnalysisWidget = ({ metrics, healthStats }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', position: 'relative', overflow: 'hidden', height: '100%', minHeight: '280px' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'rotate(-15deg)' }}>
        <Activity size={200} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontWeight: 800 }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', color: '#fff' }}>
              <Activity size={20} />
            </div>
            Vücut Analizi
          </h3>
          {metrics && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Son Güncelleme: Bugün</span>}
        </header>

        {!metrics ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1rem' }}>Vücut istatistiklerinizi henüz oluşturmadınız.</p>
            <Link to="/metrics" className="btn btn-primary premium-shadow" style={{ width: '100%' }}>Profilini Tamamla</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>BMI Endeksi</div>
              <div className="text-glow" style={{ fontSize: '2.8rem', fontWeight: 900, color: healthStats?.category?.color, lineHeight: 1.1 }}>{healthStats?.bmi}</div>
              <div style={{ display: 'inline-block', marginTop: '12px', padding: '4px 12px', background: `${healthStats?.category?.color || '#ccc'}20`, color: healthStats?.category?.color, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {healthStats?.category?.label}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Günlük kalori</div>
              <div className="text-glow" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1.1 }}>{healthStats?.tdee}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '12px' }}>
                Bazal: <span style={{ color: 'var(--text-main)' }}>{healthStats?.bmr} kcal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BodyAnalysisWidget);
