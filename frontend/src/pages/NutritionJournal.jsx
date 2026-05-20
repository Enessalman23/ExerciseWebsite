import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Apple, Target, ChevronRight, Flame, Droplets, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import NutritionAnalysisForm from '../components/diet/NutritionAnalysisForm';
import { MacroBarChart, MacroPieChart } from '../components/diet/MacroCharts';
import MealHistoryList from '../components/diet/MealHistoryList';

const NutritionJournal = () => {
  const [meals, setMeals] = useState([]);
  const [targetDiet, setTargetDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mealsRes, dietRes] = await Promise.all([
        axiosClient.get('/api/meals'),
        axiosClient.get('/api/diet/my-plans')
      ]);
      setMeals(mealsRes.data || []);
      if (dietRes.data && dietRes.data.length > 0) {
        setTargetDiet(dietRes.data[0]);
      }
    } catch (err) {
      console.error(err);
      showToast("Veriler yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const sums = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const handleAnalyzeFood = async () => {
    if (!analysisQuery.trim()) {
      showToast("Lütfen ne yediğinizi yazın.", "info");
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await axiosClient.post('/api/ai/nutrition-analyze', { query: analysisQuery });
      const data = res.data;
      if (data.error) {
        showToast(data.error, "error");
      } else {
        setFormData({
          foodName: data.foodName,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats
        });
        showToast("Besin değerleri hesaplandı!", "success");
      }
    } catch (err) {
      showToast("Analiz sırasında bir hata oluştu.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMeal = async (e) => {
    if (e) e.preventDefault();
    if (!formData.foodName || formData.calories === '') {
      showToast("Lütfen isim ve kalori girin.", "info");
      return;
    }
    try {
      await axiosClient.post('/api/meals', formData);
      showToast("Öğün başarıyla kaydedildi.", "success");
      setFormData({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
      setAnalysisQuery('');
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      showToast("Kayıt sırasında hata oluştu.", "error");
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axiosClient.delete(`/api/meals/${id}`);
      showToast("Öğün silindi.", "success");
      fetchData();
    } catch (err) {
      showToast("Silme başarısız.", "error");
    }
  };

  const macroData = [
    { name: 'Protein', value: sums.protein, color: '#4f46e5' },
    { name: 'Karbonhidrat', value: sums.carbs, color: '#0ea5e9' },
    { name: 'Yağ', value: sums.fats, color: '#f59e0b' },
  ];

  const compareData = [
    { name: 'Kalori', Alınan: sums.calories, Hedef: targetDiet?.targetDailyCalories || 2000 },
    { name: 'Protein', Alınan: sums.protein, Hedef: targetDiet?.targetProtein || 150 },
    { name: 'Karbonhidrat', Alınan: sums.carbs, Hedef: targetDiet?.targetCarbs || 250 },
    { name: 'Yağ', Alınan: sums.fats, Hedef: targetDiet?.targetFats || 70 },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1200px' }}>
      {/* HERO SECTION */}
      <header className="premium-glass-dark premium-shadow" style={{ 
        position: 'relative', overflow: 'hidden', borderRadius: '30px', padding: '50px 40px', marginBottom: '50px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        {/* Background Image inside Hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: 'url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3
        }}></div>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)'
        }}></div>

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
            <Apple size={32} color="var(--primary)" />
          </div>
          
          <h1 className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-1px' }}>
            Beslenme <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Günlüğü</span>
          </h1>
          
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', marginTop: '15px', marginBottom: '25px' }}>
            Günlük makrolarını takip et, hedefine ulaş. Her öğün seni zirveye bir adım daha yaklaştırır.
          </p>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ height: '54px', padding: '0 30px', borderRadius: '16px', fontSize: '1.1rem', boxShadow: '0 10px 20px var(--primary-glow)' }}
          >
            <Plus size={20} /> 
            {showAddForm ? "Vazgeç" : "Öğün Ekle"}
          </button>
        </div>
      </header>

      <NutritionAnalysisForm 
        showAddForm={showAddForm}
        analysisQuery={analysisQuery}
        setAnalysisQuery={setAnalysisQuery}
        handleAnalyzeFood={handleAnalyzeFood}
        isAnalyzing={isAnalyzing}
        formData={formData}
        setFormData={setFormData}
        handleAddMeal={handleAddMeal}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: '30px' }} className="responsive-grid">
        
        {/* Progress & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <MacroBarChart compareData={compareData} />
           <MealHistoryList meals={meals} handleDeleteMeal={handleDeleteMeal} />
        </div>

        {/* Macros Pie Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <MacroPieChart macroData={macroData} />

           <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', opacity: 0.05 }}>
                 <Info size={100} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Hedef Özeti</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '5px' }}>{sums.calories}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Toplam Tüketilen Kalori</div>
              
              <div className="intensity-bar" style={{ marginBottom: '10px' }}>
                <div className="intensity-fill" style={{ width: `${Math.min(100, (sums.calories / Math.max(1, targetDiet?.targetDailyCalories || 2000)) * 100)}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Günlük hedefin {(sums.calories / Math.max(1, targetDiet?.targetDailyCalories || 2000) * 100).toFixed(1)}% kadarı tamamlandı.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default NutritionJournal;
