import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Flame } from 'lucide-react';

const CalorieHistoryChart = ({ calorieHistory, healthStats }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', height: '100%', minHeight: '280px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontWeight: 800 }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '10px', color: '#f59e0b' }}>
            <Flame size={20} />
          </div>
          Kalori Geçmişi
        </h3>
        {healthStats && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontWeight: 700 }}>
            Hedef: <span style={{ color: 'var(--text-main)' }}>{healthStats.tdee} kcal</span>
          </div>
        )}
      </header>

      <div style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={calorieHistory.map(d => {
            const dateObj = new Date(d.date + "T00:00:00");
            return {
              ...d,
              DisplayDate: dateObj.toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase(),
              FullDate: dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
            };
          })}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
            <XAxis 
              dataKey="DisplayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.5px' }} 
            />
            <YAxis hide domain={[0, dataMax => Math.max(dataMax, healthStats?.tdee || 2000) * 1.3]} />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 10 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="premium-glass-dark" style={{ padding: '15px 20px', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', minWidth: '160px' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{payload[0].payload.FullDate}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }} className="text-glow-primary">
                        {payload[0].value} <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>kcal</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {healthStats?.tdee && (
              <ReferenceLine 
                y={healthStats.tdee} 
                stroke="var(--secondary)" 
                strokeDasharray="6 6" 
                strokeWidth={2}
                opacity={0.5}
              />
            )}
            <Bar 
              dataKey="calories" 
              radius={[10, 10, 6, 6]} 
              barSize={36}
            >
              {calorieHistory.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.calories > (healthStats?.tdee || 2000) ? 'var(--secondary)' : 'var(--primary)'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CalorieHistoryChart;
