import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Apple, Activity, Calculator, MessageSquare, Trophy, Camera, Scan, Utensils } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Antrenmanlar', path: '/workouts', icon: <Dumbbell size={20} /> },
    { name: 'Diyet Planı', path: '/diet', icon: <Apple size={20} /> },
    { name: 'Beslenme Günlüğü', path: '/journal', icon: <Utensils size={20} /> },
    { name: 'AI Antrenör', path: '/coach', icon: <MessageSquare size={20} /> },
    { name: 'AI Şef', path: '/recipe', icon: <Apple size={20} /> },
    { name: 'AI Form Koçu', path: '/ai-pose-coach', icon: <Scan size={20} /> },
    { name: 'Gelişim Fotoları', path: '/progress-photos', icon: <Camera size={20} /> },
    { name: 'Kalori (BMR)', path: '/bmr', icon: <Calculator size={20} /> },
    { name: 'Profilim', path: '/metrics', icon: <Activity size={20} /> },
  ];

  return (
    <aside className="sidebar-container" style={{
      padding: '24px 12px 24px 24px',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel" style={{
        width: '260px',
        height: 'calc(100vh - 48px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 15px',
        borderRadius: '30px',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ padding: '0 15px', marginBottom: '30px' }}>
          <h2 className="text-glow" style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '1px' }}>
            MENU
          </h2>
          <div style={{ width: '40px', height: '3px', background: 'var(--primary)', borderRadius: '2px', marginTop: '8px' }}></div>
        </div>

        <nav style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px',
          overflowY: 'auto',
          paddingRight: '5px',
          flex: 1
        }} className="custom-scrollbar">
          {navItems.map(item => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? '800' : '500',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'var(--transition)'
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '20px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Destek Hattı</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Hemen Soru Sor</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
