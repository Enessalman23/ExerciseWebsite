import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, Mail, Activity, ChevronRight } from 'lucide-react';
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
          <div className="floating" style={{ marginBottom: '30px' }}>
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Activity size={32} color="#fff" />
            </div>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
            Yeni Bir Sen <br/><span style={{ color: 'var(--secondary)' }}>İnşa Et.</span>
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', maxWidth: '400px', lineHeight: '1.6' }}>
            Spor salonuna gitmene gerek yok. Yapay zeka ile her yer senin kişisel spor alanın.
          </p>
        </div>
      </div>

      {/* Sağ Taraf: Form */}
      <div className="split-right">
        <div className="auth-form-container animate-fade-in">
          <div style={{ marginBottom: '40px' }}>
            <h1>Kayıt Ol</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Saniyeler içinde hesabını oluştur.</p>
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
                  placeholder="Bir kullanıcı adı seç"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">E-posta</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  name="email"
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '48px', paddingRight: '20px' }}
                  placeholder="E-posta adresini gir"
                  value={formData.email}
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
                  placeholder="Güçlü bir şifre oluştur"
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
                <>Hesap Oluştur <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Zaten hesabın var mı? <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary)', marginLeft: '5px' }}>Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
