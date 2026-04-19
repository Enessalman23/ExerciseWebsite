import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

const Metrics = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'MALE',
    weight: '',
    height: '',
    activityLevel: 'SEDENTARY',
    goal: 'HYPERTROPHY',
    dietaryRestrictions: '',
    injuries: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosClient.get('/api/metrics');
        if (res.data) {
          setFormData({
            age: res.data.age || 25,
            gender: res.data.gender || 'MALE',
            weight: res.data.weight || '',
            height: res.data.height || '',
            activityLevel: res.data.activityLevel || 'SEDENTARY',
            goal: res.data.goal || 'HYPERTROPHY',
            dietaryRestrictions: res.data.dietaryRestrictions || '',
            injuries: res.data.injuries || ''
          });
        }
      } catch (err) {
        console.log("No existing metrics or failed to fetch");
      } finally {
        setFetching(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axiosClient.post('/api/metrics', {
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietaryRestrictions: formData.dietaryRestrictions,
        injuries: formData.injuries
      });
      showToast('Profiliniz başarıyla kaydedildi!', "success");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Kaydedilemedi. Lütfen bilgilerinizi kontrol ediniz.', "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center mt-4"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px', maxWidth: '600px' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '8px' }}>Fiziksel Profiliniz</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Bu bilgiler, yapay zekanın size özel antrenman programları hazırlamasını sağlar.</p>



        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Yaşınız</label>
              <input type="number" name="age" min="10" className="input-field" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Cinsiyet</label>
              <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                <option value="MALE">Erkek</option>
                <option value="FEMALE">Kadın</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Kilo (kg)</label>
              <input type="number" name="weight" step="0.1" className="input-field" value={formData.weight} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Boy (cm)</label>
              <input type="number" name="height" className="input-field" value={formData.height} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Günlük Aktivite Seviyeniz</label>
            <select name="activityLevel" className="input-field" value={formData.activityLevel} onChange={handleChange}>
              <option value="SEDENTARY">Hareketsiz (Masa başı iş, sıfır spor)</option>
              <option value="LIGHTLY_ACTIVE">Hafif Hareketli (Hafif yürüyüş vb.)</option>
              <option value="MODERATELY_ACTIVE">Orta Derece Hareketli (Haftada 3-5 gün spor)</option>
              <option value="VERY_ACTIVE">Çok Hareketli (Haftada 6-7 gün spor)</option>
              <option value="SUPER_ACTIVE">Aşırı Hareketli (Profesyonel Atlet/İşçi)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Ana Hedefiniz</label>
            <select name="goal" className="input-field" value={formData.goal} onChange={handleChange}>
              <option value="HYPERTROPHY">Kas Geliştirmek (Hipertrofi)</option>
              <option value="FAT_LOSS">Yağ Yakmak / Zayıflamak</option>
              <option value="STRENGTH">Kuvvet / Güç Artışı</option>
              <option value="ENDURANCE">Dayanıklılık Kondisyon Artışı</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Diyet Kısıtlamaları (Opsiyonel)</label>
            <input type="text" name="dietaryRestrictions" className="input-field" placeholder="Örn: Vegan, Çölyak, Süt alerjisi" value={formData.dietaryRestrictions || ''} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label">Mevcut Sakatlıklar (Opsiyonel)</label>
            <input type="text" name="injuries" className="input-field" placeholder="Örn: Bel fıtığı, sağ omuz yırtığı" value={formData.injuries || ''} onChange={handleChange} />
          </div>

          <div className="flex gap-4" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '14px' }}>
              {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Profili Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Metrics;
