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
    <div className="navbar" style={{
      height: '70px',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'relative',
      zIndex: 10
    }}>
      <div>
        <div className="navbar-logo-mobile" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <img src="/pwa-192x192.png" alt="EA Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', boxShadow: '0 4px 10px var(--primary-glow)' }} />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Asistanı</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="navbar-actions">
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{
            width: '40px',
            height: '40px',
            padding: '0',
            borderRadius: '12px',
          }}
          title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="navbar-profile-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px var(--primary-glow)'
          }}>
            <User size={16} />
          </div>
          <span className="navbar-username" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.username || 'Kullanıcı'}</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
          className="hover-glow-error"
        >
          <LogOut size={16} /> <span className="navbar-logout-text">Çıkış</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
