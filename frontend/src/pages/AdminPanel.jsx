import React, { useEffect, useState, useMemo } from 'react';
import { Users, Dumbbell, Apple, Utensils, Shield, Trash2, Edit2, ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores user ID during backend operations
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { showToast } = useToast();

  // Sort: 1. 'admin' username first, 2. Other ADMIN roles next, 3. Rest by ID
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (a.username === 'admin') return -1;
      if (b.username === 'admin') return 1;
      if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
      if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
      return a.id - b.id;
    });
  }, [users]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosClient.get('/api/admin/stats'),
        axiosClient.get('/api/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error(err);
      showToast("Admin verileri yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setActionLoading(userId);
    try {
      await axiosClient.put(`/api/admin/users/${userId}/role`, { role: nextRole });
      showToast("Kullanıcı rolü başarıyla güncellendi.", "success");
      // Update local state directly for responsive interaction
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    } catch (err) {
      console.error(err);
      showToast("Rol güncellenirken hata oluştu.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const triggerUserDeleteConfirm = (userId, username) => {
    if (username === 'admin') {
      showToast("Ana yönetici hesabı silinemez!", "error");
      return;
    }
    setUserToDelete({ id: userId, username });
    setShowConfirm(true);
  };

  const handleConfirmUserDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(userToDelete.id);
    try {
      await axiosClient.delete(`/api/admin/users/${userToDelete.id}`);
      showToast("Kullanıcı hesabı silindi.", "success");
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      // Refresh stats
      const statsRes = await axiosClient.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      showToast("Kullanıcı silinirken hata oluştu.", "error");
    } finally {
      setActionLoading(null);
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleCancelUserDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '80px', maxWidth: '1200px' }}>
      
      {/* HERO SECTION */}
      <div className="premium-glass-dark premium-shadow" style={{
        position: 'relative', overflow: 'hidden', borderRadius: '30px', padding: '50px 40px', marginBottom: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: 'url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25
        }}></div>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)'
        }}></div>
        <div style={{ zIndex: 1 }}>
          <h1 className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#fff' }}>
            Yönetici <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Paneli</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginTop: '12px', maxWidth: '500px', lineHeight: 1.6 }}>
            Sistem kaynaklarını ve kayıtlı kullanıcı hesaplarını buradan kontrol edebilirsiniz.
          </p>
        </div>
        <button 
          onClick={fetchData} 
          className="btn btn-secondary hover-scale"
          style={{ zIndex: 1, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '16px' }}
        >
          <RefreshCw size={18} /> Yenile
        </button>
      </div>

      {/* STATISTICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }} className="responsive-grid">
        
        {/* Total Users */}
        <div className="glass-panel hover-glow" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Toplama Üye</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>{stats?.totalUsers || 0}</div>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '14px', color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Total Workouts */}
        <div className="glass-panel hover-glow" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Üretilen Program</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>{stats?.totalWorkouts || 0}</div>
            </div>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '12px', borderRadius: '14px', color: 'var(--secondary)' }}>
              <Dumbbell size={24} />
            </div>
          </div>
        </div>

        {/* Total Diets */}
        <div className="glass-panel hover-glow" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Üretilen Diyet</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>{stats?.totalDiets || 0}</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '14px', color: '#10b981' }}>
              <Apple size={24} />
            </div>
          </div>
        </div>

        {/* Total Meals Logged */}
        <div className="glass-panel hover-glow" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Günlük Tüketim</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>{stats?.totalMeals || 0}</div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '14px', color: '#f59e0b' }}>
              <Utensils size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* USER MANAGEMENT BOARD */}
      <div className="glass-panel" style={{ padding: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--primary)" /> Sistem Kullanıcıları
          </h3>
          <span className="workout-badge workout-badge-primary" style={{ padding: '6px 14px', borderRadius: '10px' }}>
            {users.length} Kayıtlı Kullanıcı
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.7 }}>
                <th style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>ID</th>
                <th style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>KULLANICI ADI</th>
                <th style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>E-POSTA</th>
                <th style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800 }}>ROL</th>
                <th style={{ padding: '15px 10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, textAlign: 'center' }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Kayıtlı kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '18px 10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>#{item.id}</td>
                    <td style={{ padding: '18px 10px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.username}</td>
                    <td style={{ padding: '18px 10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.email}</td>
                    <td style={{ padding: '18px 10px' }}>
                      <span className={`workout-badge ${item.role === 'ADMIN' ? 'workout-badge-primary' : 'workout-badge-secondary'}`} style={{ 
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 
                      }}>
                        {item.role}
                      </span>
                    </td>
                    <td style={{ padding: '18px 10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      
                      {/* Toggle Role Button */}
                      <button
                        onClick={() => handleRoleToggle(item.id, item.role)}
                        disabled={actionLoading === item.id || item.username === 'admin'}
                        className="btn-secondary"
                        style={{ 
                          padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
                          opacity: item.username === 'admin' ? 0.3 : 1, cursor: item.username === 'admin' ? 'not-allowed' : 'pointer'
                        }}
                        title="Rolü Değiştir"
                      >
                        <ShieldAlert size={14} /> Rol Değiştir
                      </button>

                      {/* Delete User Button */}
                      <button
                        onClick={() => triggerUserDeleteConfirm(item.id, item.username)}
                        disabled={actionLoading === item.id || item.username === 'admin'}
                        style={{ 
                          padding: '8px 12px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)',
                          color: '#f43f5e', cursor: item.username === 'admin' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
                          opacity: item.username === 'admin' ? 0.3 : 1
                        }}
                        className="hover-glow-error"
                        title="Kullanıcıyı Sil"
                      >
                        <Trash2 size={14} /> Hesabı Sil
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmDialog 
        isOpen={showConfirm}
        title="Kullanıcıyı Sil?"
        message={`"${userToDelete?.username || ''}" isimli kullanıcının hesabı ve tüm verileri sistemden kalıcı olarak silinecektir. Bu işlemi geri alamazsınız!`}
        onConfirm={handleConfirmUserDelete}
        onCancel={handleCancelUserDelete}
        confirmText="Evet, Sil 🗑️"
        cancelText="Vazgeç"
      />
    </div>
  );
};

export default AdminPanel;
