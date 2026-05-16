import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Target, Users, Loader } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';

const Gamification = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, badgesRes] = await Promise.all([
          axiosClient.get('/api/gamification/leaderboard'),
          axiosClient.get('/api/gamification/badges')
        ]);
        setLeaderboard(leaderboardRes.data);
        setBadges(badgesRes.data);
      } catch (error) {
        console.error("Failed to fetch gamification data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader className="spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1000px' }}>
      
      <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '15px', color: '#fff' }}>
          <Trophy size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Başarımlar & Liderlik</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Puan topla, rozetleri aç ve zirveye yerleş.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }} className="responsive-grid">
        
        {/* LİDERLİK TABLOSU */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.4rem' }}>
            <Users size={24} color="var(--secondary)" /> Liderlik Tablosu
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.map((u, idx) => (
              <div 
                key={u.username} 
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '15px', 
                  borderRadius: '15px', 
                  background: u.username === user?.username ? 'rgba(79, 70, 229, 0.1)' : 'var(--surface-hover)',
                  border: u.username === user?.username ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ width: '40px', fontWeight: 800, fontSize: '1.2rem', color: idx < 3 ? 'var(--secondary)' : 'var(--text-muted)' }}>
                  #{idx + 1}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                      <UserIcon idx={idx} />
                   </div>
                   <span style={{ fontWeight: 600, fontSize: '1.05rem', color: u.username === user?.username ? 'var(--primary)' : 'var(--text-main)' }}>
                     {u.username} {u.username === user?.username && "(Sen)"}
                   </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                  <Star size={18} fill="var(--primary)" /> {u.points}
                </div>
              </div>
            ))}
            
            {leaderboard.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>Henüz kimse puan kazanmamış.</div>
            )}
          </div>
        </div>

        {/* ROZETLER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(14,165,233,0.1))' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Senin Toplam Puanın</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Star size={40} color="var(--secondary)" fill="var(--secondary)" /> 
              {user?.totalPoints || 0}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
             <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.4rem' }}>
              <Medal size={24} color="var(--primary)" /> Rozetlerin
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {badges.map((badge) => (
                <div key={badge.name} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 10px' }}>
                    <Target size={24} color="var(--primary)" />
                  </div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{badge.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badge.description}</p>
                </div>
              ))}
            </div>

            {badges.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>Henüz rozet kazanmadın. Egzersizlere başla!</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

const UserIcon = ({ idx }) => {
  if (idx === 0) return <Trophy size={18} color="#fbbf24" />;
  if (idx === 1) return <Medal size={18} color="#9ca3af" />;
  if (idx === 2) return <Medal size={18} color="#b45309" />;
  return <Star size={18} color="var(--text-muted)" />;
};

export default Gamification;
