import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { User, Flame, Info, Calendar, PieChart as PieIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';


const BMI_CATEGORIES = [
  { label: 'Zayıf', color: '#3b82f6', min: 0, max: 18.5 },
  { label: 'Normal', color: '#10b981', min: 18.5, max: 25 },
  { label: 'Fazla Kilolu', color: '#f59e0b', min: 25, max: 30 },
  { label: 'Obez', color: '#ef4444', min: 30, max: 100 }
];

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

  // Live Calculations
  const healthStats = useMemo(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    if (!w || !h) return null;

    const bmi = (w / ((h / 100) ** 2)).toFixed(1);
    const category = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[3];

    let bmr = 0;
    if (formData.gender === 'MALE') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * (formData.age || 25));
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * (formData.age || 25));
    }

    const activityMultipliers = {
      'SEDENTARY': 1.2,
      'LIGHTLY_ACTIVE': 1.375,
      'MODERATELY_ACTIVE': 1.55,
      'VERY_ACTIVE': 1.725,
      'SUPER_ACTIVE': 1.9
    };
    const tdee = Math.round(bmr * (activityMultipliers[formData.activityLevel] || 1.2));

    return { bmi, category, bmr: Math.round(bmr), tdee };
  }, [formData]);

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
      } catch {
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
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1400px' }}>
      <div className="grid-2-1" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>

        {/* LEFT: FORM SECTION */}
        <div className="animate-fade-in">
          <header style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '32px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>
                Fiziksel <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Profil</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Yapay zeka analizine temel teşkil eden verileriniz.</p>
            </div>
          </header>

          <div className="glass-panel" style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><User size={20} color="var(--primary)" /> Kişisel Veriler</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label className="input-label">Yaşınız</label>
                  <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Cinsiyet</label>
                  <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                    <option value="MALE">Erkek</option>
                    <option value="FEMALE">Kadın</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label className="input-label">Kilo (kg)</label>
                  <input type="number" name="weight" step="0.1" className="input-field" value={formData.weight} onChange={handleChange} required placeholder="0.0" />
                </div>
                <div className="input-group">
                  <label className="input-label">Boy (cm)</label>
                  <input type="number" name="height" className="input-field" value={formData.height} onChange={handleChange} required placeholder="0" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Aktivite Seviyesi</label>
                <select name="activityLevel" className="input-field" value={formData.activityLevel} onChange={handleChange}>
                  <option value="SEDENTARY">Hareketsiz</option>
                  <option value="LIGHTLY_ACTIVE">Hafif Hareketli</option>
                  <option value="MODERATELY_ACTIVE">Orta Derece</option>
                  <option value="VERY_ACTIVE">Çok Hareketli</option>
                  <option value="SUPER_ACTIVE">Aşırı Hareketli</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Hedefiniz</label>
                <select name="goal" className="input-field" value={formData.goal} onChange={handleChange}>
                  <option value="HYPERTROPHY">Kas Geliştirme</option>
                  <option value="FAT_LOSS">Yağ Yakımı</option>
                  <option value="STRENGTH">Güç Kazanımı</option>
                  <option value="ENDURANCE">Dayanıklılık</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label className="input-label">Diyet Kısıtlamaları</label>
                  <input type="text" name="dietaryRestrictions" className="input-field" value={formData.dietaryRestrictions} onChange={handleChange} placeholder="Yok" />
                </div>
                <div className="input-group">
                  <label className="input-label">Sakatlıklar</label>
                  <input type="text" name="injuries" className="input-field" value={formData.injuries} onChange={handleChange} placeholder="Yok" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary premium-shadow" disabled={loading} style={{ height: '56px', fontSize: '1.1rem', marginTop: '10px' }}>
                {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: LIVE ANALYSIS & PERFORMANCE SECTION */}
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          <div className="sticky-card" style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>Fiziksel Analiz</h3>

            {!healthStats ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', opacity: 0.5, borderStyle: 'dashed' }}>
                <Info size={40} style={{ marginBottom: '15px' }} />
                <p style={{ color: 'var(--text-main)' }}>Verilerinizi girmeye başladığınızda analiz burada görünecek.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* BMI & Calories cards (Simplified for brevity in this block) */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>VÜCUT KİTLE ENDEKSİ</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: healthStats.category.color }}>{healthStats.bmi}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>DURUM</div>
                    <div style={{ fontWeight: 800, color: healthStats.category.color }}>{healthStats.category.label}</div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Flame size={20} color="#f43f5e" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>GÜNLÜK HEDEF</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{healthStats.tdee} kcal</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE ANALYSIS SECTION */}
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '20px' }}>Antrenman Analizi</h3>
            <WorkoutPerformanceAnalysis />
          </div>
        </div>

      </div>
    </div>
  );
};

const WorkoutPerformanceAnalysis = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosClient.get('/api/workouts/history');
        setHistory(res.data || []);
      } catch {
        console.error("Failed to fetch history for analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const stats = useMemo(() => {
    if (!history.length) return null;

    const muscleDist = {};
    const weeklyFreq = { 'Pzt': 0, 'Sal': 0, 'Çar': 0, 'Per': 0, 'Cum': 0, 'Cmt': 0, 'Paz': 0 };
    const dayMap = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    history.forEach(item => {
      // 1. Frequency
      const date = new Date(item.completedAt);
      const dayName = dayMap[date.getDay()];
      weeklyFreq[dayName]++;

      // 2. Muscles
      try {
        const plan = JSON.parse(item.workoutPlanJson);
        const days = plan.days || (Array.isArray(plan) ? plan : []);
        days.forEach(day => {
          day.exercises?.forEach(ex => {
            const m = ex.targetMuscle || 'Genel';
            muscleDist[m] = (muscleDist[m] || 0) + 1;
          });
        });
      } catch {
        // Ignored
      }
    });

    const muscleData = Object.entries(muscleDist).map(([name, value]) => ({ name, value }));
    const freqData = Object.entries(weeklyFreq).map(([name, value]) => ({ name, value }));

    return { muscleData, freqData, total: history.length };
  }, [history]);

  if (loading) return <div className="spinner" style={{ margin: '20px auto' }}></div>;
  if (!stats) return <div style={{ opacity: 0.5, fontSize: '0.8rem', textAlign: 'center', padding: '20px' }}>Henüz analiz edilecek antrenman verisi yok.</div>;

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Weekly Frequency */}
      <div className="glass-panel" style={{ padding: '20px', height: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
          <Calendar size={14} color="var(--primary)" /> HAFTALIK FREKANS
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.freqData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Distribution */}
      <div className="glass-panel" style={{ padding: '20px', height: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontSize: '0.8rem', fontWeight: 700 }}>
          <PieIcon size={14} color="var(--secondary)" /> BÖLGESEL DAĞILIM
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.muscleData}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {stats.muscleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '15px',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800 }}>TOPLAM TAMAMLANAN</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{stats.total}</div>
      </div>
    </div>
  );
};



export default Metrics;
