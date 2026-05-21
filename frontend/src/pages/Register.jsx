import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, Mail, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.username, formData.password, formData.email);
      showToast('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      let errorMessage = 'Kayıt sırasında bir hata oluştu.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      showToast(errorMessage, 'error');
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
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" 
          alt="Fitness Background" 
          className="auth-image-bg"
        />
        <div className="auth-image-overlay">
          <h2 className="text-glow-white" style={{ fontSize: '3.8rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>
            Yeni Bir Sen <br/><span className="text-glow-primary" style={{ color: 'var(--secondary)' }}>İnşa Et.</span>
          </h2>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '440px', lineHeight: '1.6', color: '#f1f5f9' }}>
            Spor salonuna gitmene gerek yok. Yapay zeka ile her yer senin kişisel spor alanın.
          </p>
        </div>
      </div>

      {/* Sağ Taraf: Form */}
      <div className="split-right">
        <div className="auth-form-container animate-fade-in glass-panel" style={{ padding: '48px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
            <img src="/pwa-512x512.png" alt="EA Logo" style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 8px 25px var(--primary-glow)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
            <h1 className="text-glow" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Kayıt Ol</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Saniyeler içinde hesabını oluştur.</p>
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
                  placeholder="Bir kullanıcı adı seçin"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">E-posta</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  name="email"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '56px', height: '56px' }}
                  placeholder="E-posta adresinizi girin"
                  value={formData.email}
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
                  placeholder="Güçlü bir şifre oluşturun"
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
                <>Hesap Oluştur <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>
            Zaten hesabınız var mı? <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary)', marginLeft: '8px' }}>Giriş Yapın</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
