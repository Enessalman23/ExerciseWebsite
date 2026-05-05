import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Flame } from 'lucide-react';

const CalorieHistoryChart = ({ calorieHistory, healthStats }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flame size={20} color="#f59e0b" /> Kalori Geçmişi (Son 7 Gün)
        </h3>
        {healthStats && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hedef: <strong>{healthStats.tdee} kcal</strong></span>
        )}
      </div>
      <div style={{ height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={calorieHistory.map(d => {
            const dateObj = new Date(d.date + "T00:00:00");
            return {
              ...d,
              DisplayDate: dateObj.toLocaleDateString('tr-TR', { weekday: 'short' }),
              FullDate: dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
            };
          })}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
            <XAxis 
              dataKey="DisplayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }} 
            />
            <YAxis hide domain={[0, dataMax => Math.max(dataMax, healthStats?.tdee || 2000) * 1.1]} />
            <Tooltip 
              cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', background: 'var(--surface-color)' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{payload[0].payload.FullDate}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{payload[0].value} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>kcal</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {healthStats?.tdee && (
              <ReferenceLine 
                y={healthStats.tdee} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                label={{ value: 'Hedef', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 700, offset: 10 }} 
              />
            )}
            <Bar 
              dataKey="calories" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            >
              {calorieHistory.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.calories > (healthStats?.tdee || 2000) ? '#ef4444' : 'var(--primary)'} 
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
