import React from 'react';
import { Zap, Utensils, Plus, Camera } from 'lucide-react';

const NutritionAnalysisForm = ({
  showAddForm,
  analysisQuery,
  setAnalysisQuery,
  handleAnalyzeFood,
  isAnalyzing,
  formData,
  setFormData,
  handleAddMeal,
  handleImageUpload,
  isAnalyzingImage
}) => {
  if (!showAddForm) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', marginBottom: '40px', border: '1px solid var(--primary-glow)' }}>
      {/* AI Search Section */}
      <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          <Zap size={20} color="var(--primary)" className="animate-pulse" /> Akıllı Analiz
        </h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text" className="form-input"
            placeholder="Örn: 2 adet haşlanmış yumurta ve 1 dilim tam buğday ekmeği..."
            value={analysisQuery} onChange={e => setAnalysisQuery(e.target.value)}
            style={{ flex: 1, height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeFood()}
          />

          <button
            type="button"
            onClick={() => document.getElementById('food-image-upload').click()}
            disabled={isAnalyzing || isAnalyzingImage}
            className="btn btn-secondary"
            style={{ height: '56px', width: '56px', minWidth: '56px', padding: 0, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-main)', cursor: 'pointer' }}
            title="Fotoğraf Yükle (AI Yemek Tarayıcı)"
          >
            {isAnalyzingImage ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            ) : (
              <Camera size={20} color="var(--primary)" />
            )}
          </button>
          <input
            type="file"
            id="food-image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={handleAnalyzeFood}
            disabled={isAnalyzing || isAnalyzingImage}
            className="btn btn-secondary"
            style={{ height: '56px', padding: '0 25px', borderRadius: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            {isAnalyzing ? "Analiz Ediliyor..." : "Hemen Hesapla"}
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', marginLeft: '5px' }}>
          Ne yediğinizi yazın veya fotoğrafını yükleyin, besin değerlerini otomatik hesaplayalım.
        </p>
      </div>

      <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
        <Utensils size={20} color="var(--primary)" /> Öğün Detayları
      </h3>

      <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', display: 'block', opacity: 0.6 }}>YEMEK ADI</label>
            <input
              type="text" className="form-input" placeholder="..."
              value={formData.foodName} onChange={e => setFormData({ ...formData, foodName: e.target.value })}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', display: 'block', opacity: 0.6 }}>KALORİ (kcal)</label>
            <input
              type="number" className="form-input" placeholder="0"
              value={formData.calories} onChange={e => setFormData({ ...formData, calories: e.target.value })}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', display: 'block', opacity: 0.6 }}>PROTEİN (g)</label>
            <input
              type="number" className="form-input" placeholder="0"
              value={formData.protein} onChange={e => setFormData({ ...formData, protein: e.target.value })}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', display: 'block', opacity: 0.6 }}>KARB (g)</label>
            <input
              type="number" className="form-input" placeholder="0"
              value={formData.carbs} onChange={e => setFormData({ ...formData, carbs: e.target.value })}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', display: 'block', opacity: 0.6 }}>YAĞ (g)</label>
            <input
              type="number" className="form-input" placeholder="0"
              value={formData.fats} onChange={e => setFormData({ ...formData, fats: e.target.value })}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '56px', width: '100%', borderRadius: '16px', fontSize: '1.1rem' }}>
          <Plus size={22} style={{ marginRight: '10px' }} /> Günlüğe Kaydet
        </button>
      </form>
    </div>
  );
};

export default NutritionAnalysisForm;
