import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Dumbbell, PlayCircle, Calendar, Activity, Award, Flame, Target
} from 'lucide-react';
import WorkoutPlayer from '../components/WorkoutPlayer';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { safeParseJson } from '../utils/jsonUtils';

// New Sub-components
import WorkoutWizard from '../components/workout/WorkoutWizard';
import WorkoutHistory from '../components/workout/WorkoutHistory';

const Workouts = () => {
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



  const getLatestPlan = () => {
    if (historyItems.length === 0) return null;
    const latest = historyItems[0];
    return { ...latest, data: safeParseJson(latest.workoutPlanJson, "CORRUPTED") };
  };

  const latestPlan = getLatestPlan();

  if (activeSession) {
    return (
      <WorkoutPlayer 
          plan={activeSession} 
          onClose={() => {
            setActiveSession(null);
            fetchHistory(); // Refresh history when closing
          }} 
      />
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px', paddingBottom: '80px', maxWidth: '1600px' }}>
      
      {/* CINEMATIC HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        height: '320px', 
        borderRadius: '32px', 
        overflow: 'hidden', 
        marginBottom: '40px',
        boxShadow: 'var(--shadow)'
      }}>
        {/* Background Layer */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.5)'
        }}></div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.2) 0%, rgba(9,9,11,0.9) 100%), linear-gradient(to right, rgba(9,9,11,0.8) 0%, transparent 60%)'
        }}></div>

        {/* Content Overlay */}
        <div style={{ position: 'relative', height: '100%', padding: '40px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <div className="animate-slide-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#fff', padding: '5px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '1px' }}>
                <Activity size={12} /> AI PERFORMANCE HUB
              </div>
              <h1 className="text-glow" style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>
                SINIRLARINI <br/> 
                <span style={{ color: 'var(--primary)' }}>YENİDEN TANIMLA.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '450px', marginTop: '16px', lineHeight: 1.5 }}>
                Bilimsel temelli algoritmalarla hazırlanan, tamamen sana özel profesyonel antrenman deneyimi.
              </p>
           </div>
        </div>

        {/* Floating Stats Cards */}
        <div style={{ position: 'absolute', bottom: '30px', right: '40px', display: 'flex', gap: '15px' }} className="hide-on-mobile">
           <div className="premium-glass-dark" style={{ padding: '15px 24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Toplam Program</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{historyItems.length}</div>
           </div>
           <div className="premium-glass-dark" style={{ padding: '15px 24px', borderRadius: '20px', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.1)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '2px' }}>Aktif Seri</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 3 <Flame size={20} color="var(--primary)" fill="var(--primary)" />
              </div>
           </div>
        </div>
      </section>
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
          parseWorkoutJson={(json) => safeParseJson(json, "CORRUPTED")}
        />
      </div>


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
