import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDark = theme === 'dark';

  return (
    <div className="navbar">
      <div>
        <div className="navbar-logo-mobile" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <img src="/pwa-192x192.png" alt="EA Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', boxShadow: '0 4px 10px var(--primary-glow)' }} />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Asistanı</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="navbar-actions">
        <button
          onClick={toggleTheme}
          className="navbar-theme-toggle"
          title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="navbar-profile-box">
          <div className="navbar-avatar">
            <User size={15} />
          </div>
          <span className="navbar-user-text">{user?.username || 'Kullanıcı'}</span>
        </div>

        <button
          onClick={handleLogout}
          className="navbar-logout-btn"
        >
          <LogOut size={16} /> 
          <span className="navbar-logout-text">Çıkış</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
