import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Apple, Utensils, Activity } from 'lucide-react';

const MobileBottomNav = () => {
  const navItems = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <Home size={22} /> },
    { name: 'Antrenman', path: '/workouts', icon: <Dumbbell size={22} /> },
    { name: 'Diyet', path: '/diet', icon: <Apple size={22} /> },
    { name: 'Günlük', path: '/journal', icon: <Utensils size={22} /> },
    { name: 'Profil', path: '/metrics', icon: <Activity size={22} /> },
  ];

  return (
    <div className="mobile-bottom-nav-wrapper">
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
          >
            {({ isActive }) => (
              <div className="mobile-nav-item-inner">
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-text">{item.name}</span>
                {isActive && <span className="active-dot"></span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .mobile-bottom-nav-wrapper {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 12px 20px 24px; /* Added bottom padding for safe area on modern phones */
          background: linear-gradient(to top, rgba(2, 6, 23, 0.95) 40%, rgba(2, 6, 23, 0.6) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
        }

        .mobile-bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
        }

        .mobile-nav-item {
          text-decoration: none;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .mobile-nav-item-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          position: relative;
          padding: 6px 0;
          width: 100%;
        }

        .mobile-nav-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-nav-text {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2px;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        /* Active Nav Link Styles */
        .mobile-nav-item.active {
          color: var(--primary);
        }

        .mobile-nav-item.active .mobile-nav-icon {
          transform: translateY(-5px) scale(1.15);
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .mobile-nav-item.active .mobile-nav-text {
          color: var(--primary);
          font-weight: 800;
        }

        /* Fluid glowing bottom dot */
        .active-dot {
          position: absolute;
          bottom: -4px;
          width: 5px;
          height: 5px;
          background-color: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--primary);
          animation: dot-pulse 2s infinite;
        }

        @keyframes dot-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 1; box-shadow: 0 0 15px var(--primary); }
          100% { transform: scale(1); opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav-wrapper {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileBottomNav;
