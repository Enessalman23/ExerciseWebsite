import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import { Apple, Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { safeParseJson } from '../utils/jsonUtils';

// New Sub-components
import DietForm from '../components/diet/DietForm';
import DietHistory from '../components/diet/DietHistory';
import DietMealModal from '../components/diet/DietMealModal';

const Diet = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    mealsPerDay: 3,
    allergies: '',
    goal: 'FAT_LOSS'
  });
  const [generationLoading, setGenerationLoading] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { showToast } = useToast();
  
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, planId: null });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get('/api/diet/my-plans');
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerationLoading(true);
    try {
      await axiosClient.post('/api/diet/generate-plan', formData);
      setShowForm(false);
      setFormData({ planName: '', mealsPerDay: 3, allergies: '', goal: 'FAT_LOSS' });
      showToast("Özel beslenme planınız başarıyla oluşturuldu!", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Diyet planı oluşturulamadı. Lütfen tekrar deneyin.", "error");
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleDeletePlan = async (e, id) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, planId: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.planId;
    setDeleteConfirm({ isOpen: false, planId: null });
    try {
      await axiosClient.delete(`/api/diet/${id}`);
      showToast("Beslenme planı başarıyla silindi.", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Silme işlemi başarısız oldu.", "error");
    }
  };



  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '80px', maxWidth: '1200px' }}>
      <header className="flex justify-between items-center" style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            &larr;
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              padding: '12px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 20px var(--primary-glow)'
            }}>
                <Apple size={32} color="#fff" />
            </div>
            <div>
              <h1 className="text-glow" style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>Beslenme Planı</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Hedeflerine uygun, yapay zeka tarafından hazırlanan menüler</p>
            </div>
          </div>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary premium-shadow" 
            style={{ padding: '14px 24px', fontSize: '1rem' }}
          >
            <Plus size={20} /> Yeni Plan Oluştur
          </button>
        )}
      </header>

      <DietForm 
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        generationLoading={generationLoading}
      />

      <DietHistory 
        history={history}
        loading={loading}
        generationLoading={generationLoading}
        expandedPlan={expandedPlan}
        setExpandedPlan={setExpandedPlan}
        handleDeletePlan={handleDeletePlan}
        setSelectedMeal={setSelectedMeal}
        parseDietJson={safeParseJson}
      />

      <DietMealModal 
        selectedMeal={selectedMeal}
        setSelectedMeal={setSelectedMeal}
      />

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        title="Diyet Planını Sil"
        message="Bu beslenme planını kalıcı olarak silmek istediğinize emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, planId: null })}
      />
    </div>
  );
};

export default Diet;
