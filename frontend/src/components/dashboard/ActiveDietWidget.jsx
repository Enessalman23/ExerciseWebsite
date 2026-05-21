import React from 'react';
import { Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ActiveDietWidget = ({ latestDiet }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', height: '100%', minHeight: '280px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--success)' }}>
            <Apple size={22} />
          </div>
          Aktif Diyet
        </h3>
        <Link to="/journal" className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>Günlük</Link>
      </header>

      {latestDiet ? (
        <div className="flex items-center gap-8">
          <div style={{ width: '120px', height: '120px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'P', value: latestDiet.targetProtein },
                  { name: 'C', value: latestDiet.targetCarbs },
                  { name: 'F', value: latestDiet.targetFats }
                ]} cx="50%" cy="50%" innerRadius={38} outerRadius={54} paddingAngle={6} dataKey="value" stroke="none">
                  <Cell fill="var(--primary)" /><Cell fill="var(--secondary)" /><Cell fill="#f59e0b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>MACRO</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>HEDEF KALORİ</div>
            <div className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{latestDiet.calorieTarget} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>KCAL</span></div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 4px' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{latestDiet.targetProtein}g</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', margin: '0 auto 4px' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{latestDiet.targetCarbs}g</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', margin: '0 auto 4px' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{latestDiet.targetFats}g</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5 }}>
          <Apple size={48} style={{ marginBottom: '15px' }} />
          <p style={{ fontSize: '0.95rem', margin: 0 }}>Henüz aktif bir diyet planın yok.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveDietWidget;
