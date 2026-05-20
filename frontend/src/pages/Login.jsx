import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { showToast, showAlert } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        showToast(`Tekrar hoş geldin, ${formData.username}!`, "success");
        navigate('/dashboard');
      } else {
        showAlert('Giriş Başarısız', 'Kullanıcı adı veya şifre hatalı.', "error");
      }
    } catch (err) {
      console.error(err);
      showAlert('Sistem Hatası', 'Giriş yapılırken bir hata oluştu.', "error");
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
          <h2 className="text-glow-white" style={{ fontSize: '3.8rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>
            Sınırlarını <br/><span className="text-glow-primary" style={{ color: 'var(--secondary)' }}>Zorla.</span>
          </h2>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '440px', lineHeight: '1.6', color: '#f1f5f9' }}>
            Yapay zeka destekli kişisel antrenörün ile hedeflerine daha hızlı ulaş. Fitness yolculuğuna bugün başla.
          </p>
        </div>
      </div>

      {/* Sağ Taraf: Form */}
      <div className="split-right">
        <div className="auth-form-container animate-fade-in glass-panel" style={{ padding: '48px', borderRadius: '32px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 className="text-glow" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Hoş Geldin</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Hesabına giriş yap ve antrenmanına başla.</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="input-group">
              <label className="input-label">Kullanıcı Adı</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="username"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '56px', height: '56px' }}
                  placeholder="Kullanıcı adınızı girin"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Şifre</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '56px', height: '56px' }}
                  placeholder="Şifrenizi girin"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary premium-shadow" disabled={loading} style={{ width: '100%', height: '60px', marginTop: '12px', fontSize: '1.1rem' }}>
              {loading ? (
                <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
              ) : (
                <>Giriş Yap <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>
            Hesabınız yok mu? <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary)', marginLeft: '8px' }}>Hemen Kayıt Olun</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
