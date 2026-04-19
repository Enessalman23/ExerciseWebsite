import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, Apple, Dumbbell, User, Award, 
  ArrowRight, Droplets, ChevronUp, ChevronDown,
  Target, Zap, Clock, Info, ChevronRight, RotateCcw, Flame
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Model from 'react-body-highlighter';
import Skeleton from '../components/Skeleton';
import ExerciseDetailModal from '../components/ExerciseDetailModal';



const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [latestDiet, setLatestDiet] = useState(null);
  const [latestWorkout, setLatestWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calorieHistory, setCalorieHistory] = useState([]);

  // Interactive Anatomy State
  const [viewModel, setViewModel] = useState('anterior');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [localExercises, setLocalExercises] = useState([]);
  const [fetchingExercises, setFetchingExercises] = useState(false);

  const BMI_CATEGORIES = [
    { label: 'Zayıf', color: '#3b82f6', min: 0, max: 18.5 },
    { label: 'Normal', color: '#10b981', min: 18.5, max: 25 },
    { label: 'Fazla Kilolu', color: '#f59e0b', min: 25, max: 30 },
    { label: 'Obez', color: '#ef4444', min: 30, max: 100 }
  ];

  const calculateHealthStats = (m) => {
    if (!m || !m.weight || !m.height) return null;
    const bmi = (m.weight / ((m.height / 100) ** 2)).toFixed(1);
    const categorySize = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[3];
    
    let bmr = 0;
    if (m.gender === 'MALE') {
      bmr = 88.362 + (13.397 * m.weight) + (4.799 * m.height) - (5.677 * (m.age || 25));
    } else {
      bmr = 447.593 + (9.247 * m.weight) + (3.098 * m.height) - (4.330 * (m.age || 25));
    }

    const activityMultipliers = {
      'SEDENTARY': 1.2,
      'LIGHTLY_ACTIVE': 1.375,
      'MODERATELY_ACTIVE': 1.55,
      'VERY_ACTIVE': 1.725,
      'SUPER_ACTIVE': 1.9
    };
    const tdee = Math.round(bmr * (activityMultipliers[m.activityLevel] || 1.2));
    
    return { bmi, category: categorySize, bmr: Math.round(bmr), tdee };
  };

  const healthStats = calculateHealthStats(metrics);
  const [detailExercise, setDetailExercise] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, dRes, wRes, hRes] = await Promise.all([
          axiosClient.get('/api/metrics'),
          axiosClient.get('/api/diet/my-plans'),
          axiosClient.get('/api/ai/my-workouts'),
          axiosClient.get('/api/meals/history')
        ]);
        setMetrics(mRes.data);
        if (dRes.data && dRes.data.length > 0) setLatestDiet(dRes.data[0]);
        if (wRes.data && wRes.data.length > 0) setLatestWorkout(wRes.data[0]);
        setCalorieHistory(hRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMuscleClick = async (data) => {
    const muscle = data.muscle;
    
    // Toggle logic: If clicking the same muscle, deselect it
    if (muscle === selectedMuscle) {
      setSelectedMuscle(null);
      setLocalExercises([]);
      return;
    }

    setSelectedMuscle(muscle);
    setFetchingExercises(true);
    try {
      const res = await axiosClient.get(`/api/exercises?muscle=${muscle}`);
      setLocalExercises(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingExercises(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1400px' }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>Hoş geldin, {user?.username}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '5px' }}>Bugün yeni bir zirveye ulaşmaya hazır mısın?</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Level badge removed */}
        </div>
      </header>

      {/* TOP STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '40px' }} className="responsive-grid">
        
        {/* BMI & TDEE */}
        <div className="glass-panel animate-fade-in" style={{ padding: '30px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.03 }}>
            <Activity size={150} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <Activity size={20} color="var(--primary)" /> Vücut Analizi
            </h3>
            {!metrics ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Başlamak için profilini tamamla.</p>
                <Link to="/metrics" className="btn btn-primary" style={{ marginTop: '15px' }}>Profil Oluştur</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: healthStats?.category.color, lineHeight: 1 }}>{healthStats?.bmi}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Vücut Kitle Endeksi</div>
                  <div style={{ display: 'inline-block', marginTop: '10px', padding: '4px 12px', background: `${healthStats?.category.color}15`, color: healthStats?.category.color, borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {healthStats?.category.label}
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{healthStats?.tdee}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Günlük Kalori Hedefi</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '10px' }}>Basal Metabolizma: {healthStats?.bmr} kcal</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CALORIE HISTORY CHART */}
        <div className="glass-panel animate-fade-in" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={20} color="#f59e0b" /> Kalori Geçmişi (Son 7 Gün)
            </h3>
            {healthStats && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hedef: <strong>{healthStats.tdee} kcal</strong></span>
            )}
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieHistory.map(d => ({
                ...d,
                DisplayDate: new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'short' })
              }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="DisplayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 700 }}
                />
                <Bar 
                  dataKey="calories" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NEW SECTION: INTERACTIVE ANATOMY & DISCOVERY */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Zap size={28} color="var(--secondary)" /> Etkileşimli Egzersiz Keşfi
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', marginBottom: '40px' }} className="responsive-grid">
        
        {/* Left: The Model */}
        <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '600px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', width: '100%', justifyContent: 'center' }}>
            <button 
              onClick={() => setViewModel('anterior')} 
              className={`btn ${viewModel === 'anterior' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Ön Görünüm
            </button>
            <button 
              onClick={() => setViewModel('posterior')} 
              className={`btn ${viewModel === 'posterior' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Arka Görünüm
            </button>
          </div>
          
          <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Model 
              type={viewModel} 
              onClick={handleMuscleClick}
              data={selectedMuscle ? [{ name: selectedMuscle, muscles: [selectedMuscle] }] : []}
              highlightedColors={['#4f46e5', '#818cf8']}
              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {selectedMuscle ? (
              <>Seçilen: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedMuscle.toUpperCase()}</span></>
            ) : "İncelemek istediğin bir kas grubuna tıkla."}
          </p>
        </div>

        {/* Right: Exercise List */}
        <div className="glass-panel" style={{ padding: '30px', overflowY: 'auto', maxHeight: '680px' }}>
          {!selectedMuscle ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.3 }}>
               <Target size={80} />
               <h3 style={{ marginTop: '20px' }}>Keşfetmeye Başla</h3>
               <p>Kas haritasından bir bölge seçerek profesyonel hareketleri gör.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedMuscle.toUpperCase()} Hareketleri</h3>
                <span className="workout-badge workout-badge-primary">{localExercises.length} Egzersiz</span>
              </div>

              {fetchingExercises ? (
                <Skeleton count={5} height={100} style={{ marginBottom: '15px' }} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {localExercises.map((ex, idx) => (
                    <div key={idx} className="glass-panel hover-scale" style={{ padding: '20px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                          <div style={{ flex: 1 }}>
                             <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)' }}>{ex.name}</h4>
                             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {ex.equipments?.map((eq, eIdx) => (
                                  <span key={eIdx} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{eq}</span>
                                ))}
                             </div>
                          </div>
                          {ex.gifUrl && (
                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                               <img 
                                src={`http://localhost:8080/gifs/gifs_360x360/${ex.gifUrl}`} 
                                alt={ex.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                               />
                            </div>
                          )}
                       </div>
                       <button 
                        onClick={() => setDetailExercise(ex)}
                        className="btn btn-secondary" 
                        style={{ width: '100%', marginTop: '15px', fontSize: '0.8rem', padding: '8px' }}
                       >
                          Nasıl Yapılır? <ChevronRight size={14} />
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="responsive-grid">
         {/* LATEST DIET WIDGET */}
         <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Apple size={22} color="var(--success)" /> Aktif Diyet</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/diet" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Plan</Link>
                <Link to="/journal" style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 700 }}>Günlük Kaydı</Link>
              </div>
            </div>
            {latestDiet ? (
              <div className="flex items-center gap-6">
                 <div style={{ width: '100px', height: '100px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'P', value: latestDiet.targetProtein },
                          { name: 'C', value: latestDiet.targetCarbs },
                          { name: 'F', value: latestDiet.targetFats }
                        ]} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value">
                          <Cell fill="#4f46e5" /><Cell fill="#06b6d4" /><Cell fill="#f59e0b" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{latestDiet.calorieTarget} kcal</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hedeflenen günlük enerji alımı.</p>
                 </div>
              </div>
            ) : <p style={{ opacity: 0.5 }}>Henüz diyet planın yok.</p>}
         </div>

         {/* LATEST WORKOUT WIDGET */}
         <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Dumbbell size={22} color="var(--primary)" /> Aktif Program</h3>
              <Link to="/workouts" style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 700 }}>Başlat</Link>
            </div>
            {latestWorkout ? (
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Program {latestWorkout.id}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Haftalık disiplinine devam et!</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                   <span className="workout-badge workout-badge-secondary">Hazır</span>
                   <span className="workout-badge workout-badge-primary">Sıradaki: Göğüs</span>
                </div>
              </div>
            ) : <p style={{ opacity: 0.5 }}>Henüz programın yok.</p>}
         </div>
      </div>
      {detailExercise && (
        <ExerciseDetailModal 
          exercise={detailExercise} 
          onClose={() => setDetailExercise(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
