import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useContext(AuthContext);
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
      showToast('Giriş yapılırken bir hata oluştu. Sunucu bağlantısını kontrol edin.', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div className="text-center mb-4">
          <h1 style={{ marginBottom: '10px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your fitness journey</p>
        </div>
        


        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="username"
                className="input-field" 
                style={{ width: '100%', paddingLeft: '48px' }}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '10px' }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                className="input-field" 
                style={{ width: '100%', paddingLeft: '48px' }}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={loading} style={{ width: '100%', padding: '16px' }}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4" style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
