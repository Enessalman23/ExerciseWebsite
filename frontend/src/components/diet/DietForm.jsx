import React from 'react';
import { Plus } from 'lucide-react';
import { DIET_MEAL_OPTIONS } from '../../constants/workoutConstants.jsx';

const DietForm = ({ 
  showForm, 
  setShowForm, 
  formData, 
  setFormData, 
  handleSubmit, 
  generationLoading 
}) => {
  if (!showForm) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginBottom: '40px', borderLeft: '4px solid var(--primary)' }}>
      <h2 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>Yapay Zeka Destekli Beslenme</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>Fiziksel özellikleriniz, boyunuz, kilonuz ve diyet geçmişiniz hesaba katılarak size en uygun beslenme planı oluşturulacaktır.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div className="input-group">
          <label className="input-label">Program İsmi (Örn: Definasyon, Yaz Hazırlığı)</label>
          <input type="text" name="planName" className="input-field" placeholder="Diyetinize bir isim verin..." value={formData.planName} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label className="input-label">Diyet Hedefi</label>
          <select name="goal" className="input-field" value={formData.goal} onChange={handleChange}>
              <option value="FAT_LOSS">Kilo Verme (Yağ Yakımı)</option>
              <option value="HYPERTROPHY">Kilo Alma (Kas Geliştirme)</option>
              <option value="MAINTENANCE">Kiloyu Koruma</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label">Günlük Öğün Sayısı</label>
          <select name="mealsPerDay" className="input-field" value={formData.mealsPerDay} onChange={handleChange}>
              {DIET_MEAL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Alerjiler veya Sevmediğiniz Gıdalar (İsteğe Bağlı)</label>
          <textarea name="allergies" className="input-field" placeholder="Örn: Fıstık alerjim var, brokoli sevmem, laktozsuz olmalı..." value={formData.allergies} onChange={handleChange} rows={3} style={{ resize: 'none' }} />
        </div>

        <div className="flex gap-4" style={{ marginTop: '10px' }}>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>İptal Et</button>
          <button type="submit" className="btn btn-primary" disabled={generationLoading} style={{ flex: 2 }}>
            {generationLoading ? <div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: '#fff' }}></div> : 'Yapay Zeka ile Liste Oluştur ⚡'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietForm;
