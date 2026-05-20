import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Zap, CheckCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AchievementSystem = () => {
  const [activeAchievement, setActiveAchievement] = useState(null);

  useEffect(() => {
    const handleAchievement = async (e) => {
      const achievement = e.detail;
      setActiveAchievement(achievement);
      
      // Persist to backend if title is provided
      try {
        if (achievement.title) {
          await axiosClient.post('/api/gamification/award-badge', achievement.title);
        }
      } catch (err) {
        console.error("Failed to persist achievement:", err);
      }

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setActiveAchievement(null);
      }, 5000);
    };

    window.addEventListener('app-achievement', handleAchievement);
    return () => window.removeEventListener('app-achievement', handleAchievement);
  }, []);

  if (!activeAchievement) return null;

  return (
    <div 
      className="animate-slide-up"
      style={{ 
        position: 'fixed', 
        bottom: '40px', 
        right: '40px', 
        zIndex: 10000,
        width: '320px',
      }}
    >
      <div 
        className="premium-glass-dark"
        style={{ 
          padding: '24px', 
          borderRadius: '24px', 
          border: '2px solid var(--primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px var(--primary-glow)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'var(--bg-color)', /* Use background color instead of hardcoded black */
          borderImage: 'linear-gradient(to right, var(--primary), var(--secondary)) 1'
        }}
      >
        <div 
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '18px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 10px 20px var(--primary-glow)'
          }}
        >
          {activeAchievement.type === 'trophy' && <Trophy size={32} />}
          {activeAchievement.type === 'star' && <Star size={32} />}
          {activeAchievement.type === 'award' && <Award size={32} />}
          {activeAchievement.type === 'zap' && <Zap size={32} />}
          {activeAchievement.type === 'check' && <CheckCircle size={32} />}
        </div>

        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
             BAŞARI KAZANILDI!
          </div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>{activeAchievement.title}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{activeAchievement.description}</p>
        </div>
      </div>
    </div>
  );
};

export const triggerAchievement = (data) => {
  window.dispatchEvent(new CustomEvent('app-achievement', { detail: data }));
};

export default AchievementSystem;
