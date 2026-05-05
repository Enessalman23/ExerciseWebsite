import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Apple, Activity, Calculator, MessageSquare, Hamburger   } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Antrenmanlar', path: '/workouts', icon: <Dumbbell size={20} /> },
    { name: 'Diyet Planı', path: '/diet', icon: <Apple size={20} /> },
    { name: 'Beslenme Günlüğü', path: '/journal', icon: <Hamburger  size={20} /> },
    { name: 'AI Antrenör', path: '/coach', icon: <MessageSquare size={20} /> },
    { name: 'Kalori (BMR)', path: '/bmr', icon: <Calculator size={20} /> },
    { name: 'Profilim', path: '/metrics', icon: <Activity size={20} /> },
  ];

  return (
    <div className="sidebar" style={{
      width: '260px',
      background: 'var(--surface-color)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px 16px'
    }}>
      <div style={{ padding: '0 12px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: '#fff' }}>
          <Dumbbell size={24} />
        </div>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>BahoFitness</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(item => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              fontWeight: isActive ? '600' : '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            })}
          >
             {item.icon}
             <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '16px', background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-main)' }}>Pro Plan Aktif</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yapay zeka asistanına sınırsız erişiminiz var.</p>
      </div> */}
    </div>
  );
};

export default Sidebar;
