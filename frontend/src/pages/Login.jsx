import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, Activity, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        showToast(`Tekrar hoş geldin, ${formData.username}!`, "success");
        navigate('/dashboard');
      } else {
        showToast('Kullanıcı adı veya şifre hatalı.', "error");
      }
    } catch (err) {
      console.error(err);
      showToast('Giriş yapılırken bir hata oluştu.', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="split-screen-container">
      {/* Sol Taraf: Görsel ve Marka */}
      <div className="split-left">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Fitness Background" 
          className="auth-image-bg"
        />
        <div className="auth-image-overlay">
          <div className="floating" style={{ marginBottom: '30px' }}>
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Activity size={32} color="#fff" />
            </div>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
            Sınırlarını <br/><span style={{ color: 'var(--secondary)' }}>Zorla.</span>
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', maxWidth: '400px', lineHeight: '1.6' }}>
            Yapay zeka destekli kişisel antrenörün ile hedeflerine daha hızlı ulaş. Fitness yolculuğuna bugün başla.
          </p>
        </div>
      </div>

      {/* Sağ Taraf: Form */}
      <div className="split-right">
        <div className="auth-form-container animate-fade-in">
          <div style={{ marginBottom: '40px' }}>
            <h1>Hoş Geldin</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Hesabına giriş yap ve antrenmanına başla.</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Kullanıcı Adı</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="username"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '48px', paddingRight: '20px' }}
                  placeholder="Kullanıcı adını gir"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '10px' }}>
              <label className="input-label">Şifre</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '48px', paddingRight: '20px' }}
                  placeholder="Şifreni gir"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary premium-shadow" disabled={loading} style={{ width: '100%', padding: '16px', marginTop: '10px' }}>
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                <>Giriş Yap <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Hesabın yok mu? <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary)', marginLeft: '5px' }}>Hemen Kayıt Ol</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
