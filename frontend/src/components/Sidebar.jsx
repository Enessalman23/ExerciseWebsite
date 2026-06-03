import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Apple, Activity, Calculator, MessageSquare, Camera, Scan, Utensils, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const sections = [
    {
      title: 'Pano',
      items: [
        { name: 'Ana Sayfa', path: '/dashboard', icon: <Home size={18} /> },
        { name: 'Profilim', path: '/metrics', icon: <Activity size={18} /> },
      ]
    },
    {
      title: 'Kişisel Takip',
      items: [
        { name: 'Antrenmanlar', path: '/workouts', icon: <Dumbbell size={18} /> },
        { name: 'Diyet Planı', path: '/diet', icon: <Apple size={18} /> },
        { name: 'Beslenme Günlüğü', path: '/journal', icon: <Utensils size={18} /> },
        { name: 'Gelişim Fotoları', path: '/progress-photos', icon: <Camera size={18} /> },
      ]
    },
    {
      title: 'AI Araçlar',
      items: [
        { name: 'AI Antrenör', path: '/coach', icon: <MessageSquare size={18} /> },
        { name: 'AI Form Koçu', path: '/ai-pose-coach', icon: <Scan size={18} /> },
        { name: 'Kalori (BMR)', path: '/bmr', icon: <Calculator size={18} /> },
      ]
    }
  ];

  if (user?.role === 'ADMIN') {
    sections.push({
      title: 'Yönetim',
      items: [
        { name: 'Admin Paneli', path: '/admin', icon: <ShieldAlert size={18} /> }
      ]
    });
  }

  return (
    <aside className="sidebar-glass" style={{ zIndex: 100 }}>
      <div style={{ padding: '0 10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/pwa-192x192.png" alt="EA Logo" style={{ width: '40px', height: '40px', borderRadius: '12px', boxShadow: '0 4px 15px var(--primary-glow)' }} />
        <div>
          <h2 className="text-glow" style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 900, letterSpacing: '0.5px', margin: 0, lineHeight: 1.1 }}>
            EGZERSİZ
          </h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>Asistanı</span>
        </div>
      </div>

      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingRight: '5px',
        flex: 1
      }} className="custom-scrollbar">
        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: '8px' }}>
            <div className="sidebar-section-header">{section.title}</div>
            <div className="sidebar-nav-list">
              {section.items.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div 
        onClick={() => navigate('/coach')}
        className="sidebar-support-card"
      >
        <div className="sidebar-support-card-title">Destek Hattı</div>
        <div className="sidebar-support-card-text">Hemen Soru Sor</div>
      </div>
    </aside>
  );
};

export default Sidebar;
