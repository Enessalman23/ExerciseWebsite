import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const { register } = useContext(AuthContext);
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
      let errorMessage = 'An error occurred during registration.';
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
    <div className="container flex justify-center items-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div className="text-center mb-4">
          <h1 style={{ marginBottom: '10px' }}>Join AI Fitness</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create an account to track your progress</p>
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
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                className="input-field" 
                style={{ width: '100%', paddingLeft: '48px' }}
                placeholder="Enter your email"
                value={formData.email}
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={loading} style={{ width: '100%', padding: '16px' }}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4" style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
