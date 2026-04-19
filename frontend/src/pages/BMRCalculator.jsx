import React, { useState } from 'react';
import { Calculator, Activity, Flame, Heart } from 'lucide-react';

const BMRCalculator = () => {
  const [formData, setFormData] = useState({
    gender: 'MALE',
    age: 25,
    weight: 70,
    height: 175,
    activity: 1.2, // Sedentary
  });

  const [results, setResults] = useState(null);

  const calculateBMR = (e) => {
    e.preventDefault();
    const { gender, age, weight, height, activity } = formData;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'MALE') {
        bmr += 5;
    } else {
        bmr -= 161;
    }
    
    const tdee = bmr * activity;
    
    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let bmiStatus = "";
    let bmiColor = "";
    
    if (bmi < 18.5) {
        bmiStatus = "Zayıf";
        bmiColor = "#F59E0B"; // Amber
    } else if (bmi >= 18.5 && bmi < 24.9) {
        bmiStatus = "Normal Kilolu";
        bmiColor = "#10B981"; // Emerald
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiStatus = "Fazla Kilolu";
        bmiColor = "#F59E0B"; // Amber
    } else if (bmi >= 30 && bmi < 34.9) {
        bmiStatus = "1. Derece Obez";
        bmiColor = "#EF4444"; // Red
    } else if (bmi >= 35 && bmi < 39.9) {
        bmiStatus = "2. Derece Obez";
        bmiColor = "#DC2626"; // Darker Red
    } else {
        bmiStatus = "3. Derece Obez (Morbid)";
        bmiColor = "#991B1B"; // Safest Red
    }
    
    setResults({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        cut: Math.round(tdee - 500),
        bulk: Math.round(tdee + 500),
        bmi: bmi.toFixed(1),
        bmiStatus,
        bmiColor
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || e.target.value });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '40px', maxWidth: '1000px' }}>
      <header className="flex items-center gap-4" style={{ marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}>
          <Calculator size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>BMR ve Kalori Hesaplayıcı</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Bazal Metabolizma Hızınızı ve günlük kalori ihtiyacınızı bilimsel olarak hesaplayın.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="responsive-grid">
        {/* Form Column */}
        <div className="glass-panel" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="var(--primary)" /> Vücut Verileriniz
            </h2>
            <form onSubmit={calculateBMR} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="input-group">
                    <label className="input-label">Cinsiyet</label>
                    <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                        <option value="MALE">Erkek</option>
                        <option value="FEMALE">Kadın</option>
                    </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <div className="input-group">
                        <label className="input-label">Yaş</label>
                        <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} min="10" max="100" required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Boy (cm)</label>
                        <input type="number" name="height" className="input-field" value={formData.height} onChange={handleChange} min="100" max="250" required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Kilo (kg)</label>
                        <input type="number" name="weight" className="input-field" value={formData.weight} onChange={handleChange} min="30" max="200" required />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Hareket Seviyesi</label>
                    <select name="activity" className="input-field" value={formData.activity} onChange={handleChange}>
                        <option value="1.2">Masa başı / Hareketsiz</option>
                        <option value="1.375">Haftada 1-3 gün hafif spor</option>
                        <option value="1.55">Haftada 3-5 gün orta spor</option>
                        <option value="1.725">Haftada 6-7 gün ağır spor</option>
                        <option value="1.9">Profesyonel sporcu / Çok ağır fiziksel iş</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem', padding: '14px' }}>
                    Şimdi Hesapla ⚡
                </button>
            </form>
        </div>

        {/* Results Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {results ? (
                <>
                <div className="glass-panel animate-fade-in" style={{ padding: '30px', background: 'linear-gradient(145deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.02) 100%)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>BAZAL METABOLİZMA HIZI (BMR)</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1', color: 'var(--text-main)' }}>{results.bmr}</span>
                        <span style={{ color: 'var(--text-muted)' }}>kcal / gün</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                        <Heart size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Hiçbir şey yapmadan, sadece yatarken hayatta kalmak için vücudunuzun yaktığı kalori miktarıdır. (Mifflin-St Jeor Formülü)
                    </p>
                </div>
                
                {/* BMI PANEL */}
                <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: `4px solid ${results.bmiColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>VÜCUT KİTLE İNDEKSİ (BMI)</h3>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: results.bmiColor }}>
                                Kategori: {results.bmiStatus}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>{results.bmi}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel animate-fade-in" style={{ padding: '30px' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>GÜNLÜK KALORİ İHTİYACI (TDEE)</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1', color: 'var(--primary)' }}>{results.tdee}</span>
                        <span style={{ color: 'var(--text-muted)' }}>kcal / gün</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>KİLO VERME (-500)</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{results.cut} <span style={{fontSize:'0.9rem', fontWeight:'normal'}}>kcal</span></div>
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>KİLO ALMA (+500)</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{results.bulk} <span style={{fontSize:'0.9rem', fontWeight:'normal'}}>kcal</span></div>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', opacity: 0.6 }}>
                    <Flame size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h3 style={{ marginBottom: '8px', textAlign: 'center' }}>Hesaplama Bekleniyor</h3>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px' }}>
                        Sol taraftaki bilgilerinizi doldurup hesapla butonuna bastığınızda sonuçlar burada belirecektir.
                    </p>
                </div>
            )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
            .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  );
};

export default BMRCalculator;
