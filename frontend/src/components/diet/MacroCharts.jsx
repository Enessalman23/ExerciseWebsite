import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const MacroBarChart = ({ compareData }) => (
  <div className="glass-panel" style={{ padding: '30px' }}>
    <h3 style={{ marginBottom: '24px', opacity: 0.8 }}>Makro Karşılaştırması</h3>
    <div style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={compareData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
          <Bar dataKey="Alınan" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Hedef" fill="var(--border-color)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const MacroPieChart = ({ macroData }) => (
  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
    <h3 style={{ marginBottom: '24px', opacity: 0.8 }}>Alınan Makrolar</h3>
    <div style={{ height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {macroData.map(m => (
        <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: m.color }}></div>
              <span style={{ fontSize: '0.9rem' }}>{m.name}</span>
           </div>
           <span style={{ fontWeight: 700 }}>{m.value} gr</span>
        </div>
      ))}
    </div>
  </div>
);
