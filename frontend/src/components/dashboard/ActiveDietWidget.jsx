import React from 'react';
import { Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ActiveDietWidget = ({ latestDiet }) => {
  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Apple size={22} color="var(--success)" /> Aktif Diyet</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/diet" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Plan</Link>
          <Link to="/journal" style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 700 }}>Günlük Kaydı</Link>
        </div>
      </div>
      {latestDiet ? (
        <div className="flex items-center gap-6">
            <div style={{ width: '100px', height: '100px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'P', value: latestDiet.targetProtein },
                    { name: 'C', value: latestDiet.targetCarbs },
                    { name: 'F', value: latestDiet.targetFats }
                  ]} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value">
                    <Cell fill="#4f46e5" /><Cell fill="#06b6d4" /><Cell fill="#f59e0b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{latestDiet.calorieTarget} kcal</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hedeflenen günlük enerji alımı.</p>
            </div>
        </div>
      ) : <p style={{ opacity: 0.5 }}>Henüz diyet planın yok.</p>}
    </div>
  );
};

export default ActiveDietWidget;
