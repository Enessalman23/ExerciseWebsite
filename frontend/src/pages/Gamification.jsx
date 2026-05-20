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
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '80px', maxWidth: '1000px' }}>
      
      {/* HERO SECTION */}
      <header className="premium-glass-dark premium-shadow" style={{ 
        position: 'relative', overflow: 'hidden', borderRadius: '32px', padding: '60px 40px', marginBottom: '50px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Background Image inside Hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: 'url("https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2
        }}></div>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.95) 100%)'
        }}></div>

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '10px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            padding: '16px', borderRadius: '20px', marginBottom: '24px', 
            boxShadow: '0 10px 25px var(--primary-glow)' 
          }}>
            <Trophy size={32} color="#fff" />
          </div>
          
          <h1 className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-1.5px' }}>
            Başarımlar & <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Liderlik</span>
          </h1>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px', margin: '20px auto' }}></div>
          
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', margin: '0 auto' }}>
            Puan topla, rozetleri aç ve zirveye yerleş. Gerçek rekabet şimdi başlıyor.
          </p>
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
