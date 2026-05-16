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
      height: '80px',
      background: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div>
        {/* Placeholder for left side elements like breadcrumbs if needed */}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button 
           onClick={toggleTheme}
           style={{ 
             background: 'var(--surface-hover)', 
             border: 'none', 
             color: 'var(--text-main)', 
             padding: '8px', 
             borderRadius: '50%', 
             cursor: 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             transition: 'var(--transition)'
           }}
           title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
            <User size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.username || 'Kullanıcı'}</span>
          </div>

          {/* Language Toggle */}
          <button 
           onClick={() => {
             import('i18next').then(i18n => {
               i18n.default.changeLanguage(i18n.default.language === 'tr' ? 'en' : 'tr');
             });
           }}
           style={{ 
             background: 'var(--surface-hover)', 
             border: '1px solid var(--border-color)', 
             color: 'var(--text-main)', 
             padding: '4px 8px', 
             borderRadius: '8px', 
             cursor: 'pointer',
             fontWeight: '600',
             transition: 'var(--transition)'
           }}
          >
            EN/TR
          </button>

        <button 
          onClick={handleLogout} 
          style={{ 
            background: 'rgba(239, 68, 68, 0.05)', 
            border: '1px solid rgba(239, 68, 68, 0.1)', 
            color: 'var(--error)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            marginLeft: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={16} /> Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Navbar;
