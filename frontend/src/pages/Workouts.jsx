import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Dumbbell, PlayCircle, Calendar, Activity, Award, Flame, Target
} from 'lucide-react';
import WorkoutPlayer from '../components/WorkoutPlayer';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';

// New Sub-components
import WorkoutWizard from '../components/workout/WorkoutWizard';
import WorkoutHistory from '../components/workout/WorkoutHistory';

const Workouts = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generationLoading, setGenerationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    goal: '',
    level: 'Orta',
    daysPerWeek: 3,
    extraInformation: '',
    gender: 'Erkek',
    equipments: [],
    focusMuscles: [],
    planName: '',
    disclaimerAccepted: false
  });

  const [activeSession, setActiveSession] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const { showToast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, planId: null });

  // Wizard State
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep === 0 && !formData.goal) {
      showToast("Lütfen önce bir hedef seçin.", "info");
      return;
    }
    if (currentStep < totalSteps - 1) setCurrentStep(curr => curr + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/ai/my-workouts');
      setHistoryItems(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Antrenmanlar güncellenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal) {
      showToast("Lütfen bir antrenman hedefi belirtin.", "info");
      return;
    }
    if (!formData.disclaimerAccepted) {
      showToast("Lütfen önce güvenlik uyarısını kabul edin.", "warning");
      return;
    }
    setGenerationLoading(true);
    try {
      const payload = {
        ...formData,
        daysPerWeek: parseInt(formData.daysPerWeek)
      };
      await axiosClient.post('/api/ai/generate-workout', payload);
      setFormData(prev => ({...prev, goal: '', focusMuscles: [], planName: '' }));
      showToast("Özel programınız başarıyla oluşturuldu!", "success");
      setCurrentStep(0); // Reset wizard
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Yapay zeka şu an meşgul. Lütfen az sonra tekrar deneyin.", "error");
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleDeleteWorkout = (id) => {
    setDeleteConfirm({ isOpen: true, planId: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.planId;
    setDeleteConfirm({ isOpen: false, planId: null });
    try {
      await axiosClient.delete(`/api/ai/workout/${id}`);
      showToast("Program başarıyla silindi.", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Silme işlemi başarısız oldu.", "error");
    }
  };

  const parseWorkoutJson = (jsonString) => {
    try {
      if (!jsonString || jsonString.trim() === "") return null;
      return JSON.parse(jsonString);
    } catch (e) {
      return "CORRUPTED";
    }
  };

  const getLatestPlan = () => {
    if (historyItems.length === 0) return null;
    const latest = historyItems[0];
    return { ...latest, data: parseWorkoutJson(latest.workoutPlanJson) };
  };

  const latestPlan = getLatestPlan();

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1400px' }}>
      
      {/* HEADER & HERO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '60px' }} className="responsive-grid">
        <header>
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div className="glow-effect" style={{ background: 'var(--primary)', padding: '14px', borderRadius: '18px', color: '#fff', boxShadow: '0 10px 25px var(--primary-glow)' }}>
              <Dumbbell size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>Antrenman Merkezi</h1>
              <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                   <Activity size={16} color="var(--primary)" /> AI Destekli
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                   <Award size={16} color="var(--secondary)" /> Premium Planlar
                </span>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', lineHeight: '1.6', marginTop: '20px' }}>
            Kişisel hedeflerinize ve ekipmanlarınıza göre optimize edilmiş, bilimsel temelli antrenman programlarıyla sınırlarını zorla.
          </p>
        </header>

        {latestPlan && latestPlan.data !== "CORRUPTED" && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid var(--primary-glow)' }}>
             <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
               <Flame size={120} color="var(--primary)" />
             </div>
             <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Aktif Programın</div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>AI Özel Gelişim Planı</h3>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                   <div className="workout-badge workout-badge-primary" style={{ padding: '6px 14px' }}>
                      <Calendar size={14} style={{ marginRight: '6px' }} /> {latestPlan.data?.days?.length || 0} Günlük
                   </div>
                   <div className="workout-badge workout-badge-secondary" style={{ padding: '6px 14px' }}>
                      <Target size={14} style={{ marginRight: '6px' }} /> {latestPlan.data?.days?.[0]?.exercises?.length || 0} Hareket
                   </div>
                </div>

                <button 
                  onClick={() => latestPlan.data && setActiveSession(latestPlan.data)}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '54px', fontSize: '1.1rem', boxShadow: '0 15px 30px var(--primary-glow)' }}
                >
                  <PlayCircle size={22} /> Hemen Başla
                </button>
             </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: '48px', alignItems: 'start' }} className="responsive-grid">
        
        {/* LEFT PANEL: SMART GENERATOR WIZARD */}
        <WorkoutWizard 
          currentStep={currentStep}
          totalSteps={totalSteps}
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          generationLoading={generationLoading}
        />

        {/* RIGHT PANEL: PROGRAM HISTORY */}
        <WorkoutHistory 
          historyItems={historyItems}
          loading={loading}
          fetchHistory={fetchHistory}
          expandedPlan={expandedPlan}
          setExpandedPlan={setExpandedPlan}
          setActiveSession={setActiveSession}
          handleDeleteWorkout={handleDeleteWorkout}
          parseWorkoutJson={parseWorkoutJson}
        />
      </div>

      {activeSession && (
        <WorkoutPlayer 
            plan={activeSession} 
            onClose={() => setActiveSession(null)} 
        />
      )}

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        title="Antrenman Programını Sil"
        message="Bu özel programı silmek istediğine emin misin? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, planId: null })}
      />
    </div>
  );
};

export default Workouts;
