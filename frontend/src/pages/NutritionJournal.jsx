import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  Plus, Trash2, Apple, Zap, Target, 
  ChevronRight, PieChart as PieIcon, 
  ChevronDown, ChevronUp, History, Info,
  Flame, Droplets, Utensils
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useToast } from '../context/ToastContext';

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

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!formData.foodName || !formData.calories) {
      showToast("Lütfen isim ve kalori girin.", "info");
      return;
    }
    try {
      await axiosClient.post('/api/meals', formData);
      showToast("Öğün başarıyla kaydedildi.", "success");
      setFormData({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
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
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Beslenme Günlüğü</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '5px' }}>Günlük makrolarını takip et, hedefine ulaş.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ height: '54px', padding: '0 30px', borderRadius: '16px' }}
        >
          {showAddForm ? <Utensils size={20} /> : <Plus size={20} />} 
          {showAddForm ? "Vazgeç" : "Öğün Ekle"}
        </button>
      </header>

      {showAddForm && (
        <div className="glass-panel animate-fade-in" style={{ padding: '30px', marginBottom: '40px', border: '1px solid var(--primary-glow)' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Utensils size={20} color="var(--primary)" /> Yeni Öğün Girişi
          </h3>
          <form onSubmit={handleAddMeal} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr', gap: '15px', alignItems: 'end' }}>
             <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>YEMEK ADI</label>
                <input 
                  type="text" className="form-input" placeholder="Örn: Izgara Tavuk"
                  value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})}
                  style={{ width: '100%', height: '48px' }}
                />
             </div>
             <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>KALORİ</label>
                <input 
                  type="number" className="form-input" placeholder="kcal"
                  value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})}
                  style={{ width: '100%', height: '48px' }}
                />
             </div>
             <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>PROTEİN</label>
                <input 
                  type="number" className="form-input" placeholder="gr"
                  value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})}
                  style={{ width: '100%', height: '48px' }}
                />
             </div>
             <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>KARB</label>
                <input 
                  type="number" className="form-input" placeholder="gr"
                  value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})}
                  style={{ width: '100%', height: '48px' }}
                />
             </div>
             <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>YAĞ</label>
                <input 
                  type="number" className="form-input" placeholder="gr"
                  value={formData.fats} onChange={e => setFormData({...formData, fats: e.target.value})}
                  style={{ width: '100%', height: '48px' }}
                />
             </div>
             <button type="submit" className="btn btn-primary" style={{ height: '48px', width: '100%', borderRadius: '12px' }}>
                <Plus size={20} />
             </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: '30px' }} className="responsive-grid">
        
        {/* Progress & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '24px', opacity: 0.8 }}>Makro Karşılaştırması</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                    <Bar dataKey="Alınan" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Hedef" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '24px', opacity: 0.8 }}>Öğün Geçmişi (Bugün)</h3>
              {meals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                   <History size={40} style={{ margin: '0 auto 15px' }} />
                   <p>Bugün henüz bir şey kaydetmedin.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {meals.map(meal => (
                     <div key={meal.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                           <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
                              <Utensils size={20} />
                           </div>
                           <div>
                              <div style={{ fontWeight: 700 }}>{meal.foodName}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '15px', marginTop: '4px' }}>
                                 <span>{meal.calories} kcal</span>
                                 <span>P: {meal.protein}g</span>
                                 <span>K: {meal.carbs}g</span>
                                 <span>Y: {meal.fats}g</span>
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteMeal(meal.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', opacity: 0.6 }}
                        >
                          <Trash2 size={20} />
                        </button>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Macros Pie Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '24px', opacity: 0.8 }}>Alınan Makrolar</h3>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {macroData.map(m => (
                  <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: m.color }}></div>
                        <span style={{ fontSize: '0.9rem' }}>{m.name}</span>
                     </div>
                     <span style={{ fontWeight: 700 }}>{m.value} gr</span>
                  </div>
                ))}
              </div>
           </div>

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
