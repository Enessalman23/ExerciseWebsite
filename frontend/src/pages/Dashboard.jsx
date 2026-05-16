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
import Skeleton from '../components/Skeleton';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }} className="responsive-grid">
        
        {/* BMI & TDEE */}
        <BodyAnalysisWidget metrics={metrics} healthStats={healthStats} />

        {/* WATER TRACKER */}
        <WaterTrackerWidget />

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
         <ActiveDietWidget latestDiet={latestDiet} />

         {/* LATEST WORKOUT WIDGET */}
         <ActiveWorkoutWidget latestWorkout={latestWorkout} />
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
