import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const BodyAnalysisWidget = ({ metrics, healthStats }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}>
        <Activity size={150} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <Activity size={20} color="var(--primary)" /> Vücut Analizi
        </h3>
        {!metrics ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Başlamak için profilini tamamla.</p>
            <Link to="/metrics" className="btn btn-primary" style={{ marginTop: '15px' }}>Profil Oluştur</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: healthStats?.category.color, lineHeight: 1 }}>{healthStats?.bmi}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Vücut Kitle Endeksi</div>
              <div style={{ display: 'inline-block', marginTop: '10px', padding: '4px 12px', background: `${healthStats?.category.color}15`, color: healthStats?.category.color, borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                {healthStats?.category.label}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{healthStats?.tdee}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Günlük Kalori Hedefi</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '10px' }}>Basal Metabolizma: {healthStats?.bmr} kcal</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyAnalysisWidget;
