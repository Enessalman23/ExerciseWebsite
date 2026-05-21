import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Apple, Info, ShieldAlert, Coffee, Flame, Activity } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import NutritionAnalysisForm from '../components/diet/NutritionAnalysisForm';
import { MacroBarChart, MacroPieChart } from '../components/diet/MacroCharts';
import MealHistoryList from '../components/diet/MealHistoryList';

const NutritionJournal = () => {
  const [meals, setMeals] = useState([]);
  const [targetDiet, setTargetDiet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    sodium: 0,
    potassium: 0,
    calcium: 0,
    caffeine: 0,
    vitaminC: 0,
    iron: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [mealsRes, dietRes] = await Promise.all([
        axiosClient.get('/api/meals'),
        axiosClient.get('/api/diet/my-plans')
      ]);
      setMeals(mealsRes.data || []);
      if (dietRes.data && dietRes.data.length > 0) {
        setTargetDiet(dietRes.data[0]);
      }
    } catch {
      showToast("Veriler yüklenemedi.", "error");
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sums = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fats: acc.fats + (meal.fats || 0),
    sodium: acc.sodium + (meal.sodium || 0),
    potassium: acc.potassium + (meal.potassium || 0),
    calcium: acc.calcium + (meal.calcium || 0),
    caffeine: acc.caffeine + (meal.caffeine || 0),
    vitaminC: acc.vitaminC + (meal.vitaminC || 0),
    iron: acc.iron + (meal.iron || 0)
  }), { 
    calories: 0, protein: 0, carbs: 0, fats: 0, 
    sodium: 0, potassium: 0, calcium: 0, caffeine: 0, vitaminC: 0, iron: 0 
  });

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
          foodName: data.foodName || '',
          calories: data.calories !== undefined ? data.calories : 0,
          protein: data.protein !== undefined ? data.protein : 0,
          carbs: data.carbs !== undefined ? data.carbs : 0,
          fats: data.fats !== undefined ? data.fats : 0,
          sodium: data.sodium !== undefined ? data.sodium : 0,
          potassium: data.potassium !== undefined ? data.potassium : 0,
          calcium: data.calcium !== undefined ? data.calcium : 0,
          caffeine: data.caffeine !== undefined ? data.caffeine : 0,
          vitaminC: data.vitaminC !== undefined ? data.vitaminC : 0,
          iron: data.iron !== undefined ? data.iron : 0
        });
        showToast("Besin değerleri hesaplandı!", "success");
      }
    } catch {
      showToast("Analiz sırasında bir hata oluştu.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Lütfen sadece resim dosyası seçin.", "error");
      return;
    }

    setIsAnalyzingImage(true);
    showToast("Görsel yükleniyor ve analiz ediliyor...", "info");

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const res = await axiosClient.post('/api/ai/nutrition-analyze-image', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = res.data;
      if (data.error) {
        showToast(data.error, "error");
      } else {
        setFormData({
          foodName: data.foodName || '',
          calories: data.calories !== undefined ? data.calories : 0,
          protein: data.protein !== undefined ? data.protein : 0,
          carbs: data.carbs !== undefined ? data.carbs : 0,
          fats: data.fats !== undefined ? data.fats : 0,
          sodium: data.sodium !== undefined ? data.sodium : 0,
          potassium: data.potassium !== undefined ? data.potassium : 0,
          calcium: data.calcium !== undefined ? data.calcium : 0,
          caffeine: data.caffeine !== undefined ? data.caffeine : 0,
          vitaminC: data.vitaminC !== undefined ? data.vitaminC : 0,
          iron: data.iron !== undefined ? data.iron : 0
        });
        showToast("Yemek görseli başarıyla analiz edildi!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Görsel analiz edilemedi. Lütfen tekrar deneyin.", "error");
    } finally {
      setIsAnalyzingImage(false);
      e.target.value = '';
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
      setFormData({ 
        foodName: '', calories: '', protein: '', carbs: '', fats: '',
        sodium: 0, potassium: 0, calcium: 0, caffeine: 0, vitaminC: 0, iron: 0 
      });
      setAnalysisQuery('');
      setShowAddForm(false);
      fetchData();
    } catch {
      showToast("Kayıt sırasında hata oluştu.", "error");
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axiosClient.delete(`/api/meals/${id}`);
      showToast("Öğün silindi.", "success");
      fetchData();
    } catch {
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

  // Daily Micro-Nutrient Limits & Targets
  const microsList = [
    { name: 'Kafein', key: 'caffeine', unit: 'mg', limit: 400, type: 'limit', desc: 'Günlük güvenli sınır (400 mg)', color: '#a8a29e', alertColor: '#ef4444' },
    { name: 'Sodyum', key: 'sodium', unit: 'mg', limit: 2300, type: 'limit', desc: 'Günlük maksimum sınır (2300 mg)', color: '#38bdf8', alertColor: '#f97316' },
    { name: 'Potasyum', key: 'potassium', unit: 'mg', limit: 3500, type: 'target', desc: 'Günlük önerilen hedef (3500 mg)', color: '#4f46e5', alertColor: '#10b981' },
    { name: 'Kalsiyum', key: 'calcium', unit: 'mg', limit: 1000, type: 'target', desc: 'Günlük önerilen hedef (1000 mg)', color: '#06b6d4', alertColor: '#10b981' },
    { name: 'C Vitamini', key: 'vitaminC', unit: 'mg', limit: 90, type: 'target', desc: 'Günlük önerilen hedef (90 mg)', color: '#fbbf24', alertColor: '#10b981' },
    { name: 'Demir', key: 'iron', unit: 'mg', limit: 18, type: 'target', desc: 'Günlük önerilen hedef (18 mg)', color: '#ec4899', alertColor: '#10b981' },
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
            Günlük makrolarını ve mikro besin değerlerini takip et, hedefine sağlıklı adımlarla ulaş.
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
        handleImageUpload={handleImageUpload}
        isAnalyzingImage={isAnalyzingImage}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="responsive-grid">
        
        {/* Progress & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <MacroBarChart compareData={compareData} />
           <MealHistoryList meals={meals} handleDeleteMeal={handleDeleteMeal} />
        </div>

        {/* Macros & Micros Analysis Side Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <MacroPieChart macroData={macroData} />

           {/* PREMIUM DETAILED MICRO-NUTRIENT TRACKER */}
           <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} color="var(--primary)" /> Mikro Besin Analizi
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {microsList.map((m) => {
                  const currentVal = sums[m.key] || 0;
                  const percent = Math.min(100, (currentVal / m.limit) * 100);
                  const isExceeded = m.type === 'limit' && currentVal > m.limit;
                  const color = isExceeded ? m.alertColor : m.color;

                  return (
                    <div key={m.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                          {m.key === 'caffeine' && <Coffee size={14} color={color} />}
                          {m.name}
                        </span>
                        <span style={{ color: isExceeded ? m.alertColor : 'var(--text-muted)' }}>
                          {currentVal} / {m.limit} {m.unit}
                        </span>
                      </div>
                      
                      {/* Interactive Custom Progress Bar */}
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ 
                          width: `${percent}%`, 
                          height: '100%', 
                          background: color, 
                          borderRadius: '4px',
                          transition: 'width 1s ease-in-out',
                          boxShadow: isExceeded ? `0 0 10px ${m.alertColor}` : 'none'
                        }}></div>
                      </div>

                      {/* Warnings or Descriptions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.8 }}>
                        <span>{m.desc}</span>
                        {isExceeded && (
                          <span style={{ color: m.alertColor, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldAlert size={11} /> Sınır Aşıldı!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>

           {/* Total Calories Summary */}
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
