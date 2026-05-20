import React, { useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  Activity, Apple, Dumbbell, User, Award,
  ArrowRight, Droplets, ChevronUp, ChevronDown,
  Target, Zap, Clock, Info, ChevronRight, RotateCcw, Flame
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useHealthStats } from '../hooks/useHealthStats';
import CalorieHistoryChart from '../components/dashboard/CalorieHistoryChart';
import AnatomyExplorer from '../components/dashboard/AnatomyExplorer';
import BodyAnalysisWidget from '../components/dashboard/BodyAnalysisWidget';
import ActiveDietWidget from '../components/dashboard/ActiveDietWidget';
import ActiveWorkoutWidget from '../components/dashboard/ActiveWorkoutWidget';
import WaterTrackerWidget from '../components/dashboard/WaterTrackerWidget';
import WorkoutPlayer from '../components/WorkoutPlayer';




const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '80px', maxWidth: '1400px' }}>
      
      {/* HERO SECTION */}
      <div className="premium-glass-dark premium-shadow" style={{ 
        position: 'relative', overflow: 'hidden', borderRadius: '30px', padding: '60px 40px', marginBottom: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Background Image inside Hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: 'url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4
        }}></div>
        {/* Gradient Overlay for better text contrast */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 100%)'
        }}></div>

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
            <Zap size={16} color="var(--secondary)" />
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>DASHBOARD</span>
          </div>
          <h1 className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', lineHeight: 1.2 }}>
            Hoş geldin, <span className="text-glow-primary" style={{ color: 'var(--secondary)' }}>{user?.username}</span>!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.25rem', marginTop: '15px', maxWidth: '500px', lineHeight: 1.6 }}>
            Bugün yeni bir zirveye ulaşmaya hazır mısın? İstatistiklerini takip et, hedeflerine odaklan.
          </p>
        </div>
      </div>

      {/* TOP STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '50px' }} className="responsive-grid">
        
        {/* BMI & TDEE */}
        <div className="hover-glow" style={{ borderRadius: '24px' }}>
          <BodyAnalysisWidget metrics={metrics} healthStats={healthStats} />
        </div>

        {/* WATER TRACKER */}
        <div className="hover-glow" style={{ borderRadius: '24px' }}>
          <WaterTrackerWidget />
        </div>

        {/* CALORIE HISTORY CHART */}
        <div className="hover-glow" style={{ borderRadius: '24px' }}>
          <CalorieHistoryChart calorieHistory={calorieHistory} healthStats={healthStats} />
        </div>
      </div>

      {/* NEW SECTION: INTERACTIVE ANATOMY & DISCOVERY */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 800 }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: '#fff' }}>
            <Zap size={24} />
          </div>
          Etkileşimli Egzersiz <span style={{ color: 'var(--primary)' }}>Keşfi</span>
        </h2>
        
        <AnatomyExplorer 
          viewModel={viewModel}
          setViewModel={setViewModel}
          selectedMuscle={selectedMuscle}
          handleMuscleClick={handleMuscleClick}
          fetchingExercises={fetchingExercises}
          localExercises={localExercises}
          getImageUrl={getImageUrl}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="responsive-grid">
         {/* LATEST DIET WIDGET */}
         <div className="hover-glow" style={{ borderRadius: '24px' }}>
          <ActiveDietWidget latestDiet={latestDiet} />
         </div>

         {/* LATEST WORKOUT WIDGET */}
         <div className="hover-glow" style={{ borderRadius: '24px' }}>
          <ActiveWorkoutWidget latestWorkout={latestWorkout} />
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
