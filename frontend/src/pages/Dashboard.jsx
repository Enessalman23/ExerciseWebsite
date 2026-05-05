import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Activity, Apple, Dumbbell, User, Award,
  ArrowRight, Droplets, ChevronUp, ChevronDown,
  Target, Zap, Clock, Info, ChevronRight, RotateCcw, Flame
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Skeleton from '../components/Skeleton';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import { useHealthStats } from '../hooks/useHealthStats';
import CalorieHistoryChart from '../components/dashboard/CalorieHistoryChart';
import AnatomyExplorer from '../components/dashboard/AnatomyExplorer';




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

  const healthStats = useHealthStats(metrics);
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
        const sortedHistory = (hRes.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
        setCalorieHistory(sortedHistory);
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

  const getImageUrl = (path) => {
    if (!path) return '';
    if (!path.includes('gifs_360x360')) {
        return `http://localhost:8080/exercise-images/${path}`;
    }
    return `http://localhost:8080/gifs/gifs_360x360/${path}`;
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1400px' }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>Hoş geldin, {user?.username}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '5px' }}>Bugün yeni bir zirveye ulaşmaya hazır mısın?</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
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
        <CalorieHistoryChart calorieHistory={calorieHistory} healthStats={healthStats} />
      </div>

      {/* NEW SECTION: INTERACTIVE ANATOMY & DISCOVERY */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Zap size={28} color="var(--secondary)" /> Etkileşimli Egzersiz Keşfi
      </h2>
      
      <AnatomyExplorer 
        viewModel={viewModel}
        setViewModel={setViewModel}
        selectedMuscle={selectedMuscle}
        handleMuscleClick={handleMuscleClick}
        fetchingExercises={fetchingExercises}
        localExercises={localExercises}
        setDetailExercise={setDetailExercise}
        getImageUrl={getImageUrl}
      />

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
