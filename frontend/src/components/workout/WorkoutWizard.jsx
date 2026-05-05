import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, RefreshCcw, Zap, Brain, Activity, Loader2, Sparkles, Target, ShieldAlert, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { GOAL_OPTIONS, equipmentsList, EXPERIENCE_LEVELS } from '../../constants/workoutConstants.jsx';

const LoadingOverlay = ({ isVisible }) => {
  const [messageIdx, setMessageIdx] = useState(0);
  const messages = [
    "Yapay Zeka hedeflerinizi analiz ediyor...",
    "Kas grupları için en iyi egzersizler seçiliyor...",
    "Size özel set ve tekrar sayıları belirleniyor...",
    "Programınız optimize ediliyor, az kaldı!"
  ];

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setMessageIdx(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{ 
      position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.9)', 
      backdropFilter: 'blur(10px)', zIndex: 100, borderRadius: '24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px', textAlign: 'center'
    }} className="animate-fade-in">
      <div style={{ position: 'relative', marginBottom: '40px' }}>
         <div className="animate-spin" style={{ 
           width: '100px', height: '100px', border: '4px solid var(--primary)', 
           borderTopColor: 'transparent', borderRadius: '50%',
           boxShadow: '0 0 30px var(--primary-glow)'
         }}></div>
         <Sparkles size={32} color="var(--secondary)" className="animate-pulse" style={{ 
           position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' 
         }} />
      </div>
      
      <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Brain color="var(--primary)" /> Programın Hazırlanıyor
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '300px', height: '3em' }}>
        {messages[messageIdx]}
      </p>

      <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '40px', overflow: 'hidden' }}>
         <div className="loading-bar-animation" style={{ 
           height: '100%', width: '100%', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' 
         }}></div>
      </div>
    </div>
  );
};

const WorkoutWizard = ({ 
  currentStep, 
  totalSteps, 
  formData, 
  setFormData, 
  nextStep, 
  prevStep, 
  handleSubmit, 
  generationLoading 
}) => {
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEquipmentToggle = (eq) => {
    setFormData(prev => {
      const isSelected = prev.equipments.includes(eq);
      return {
        ...prev,
        equipments: isSelected 
          ? prev.equipments.filter(e => e !== eq) 
          : [...prev.equipments, eq]
      };
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '40px', position: 'relative', minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
       <LoadingOverlay isVisible={generationLoading} />
       
       <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
          {/* <Brain size={32} color="var(--primary)" className="animate-pulse" /> */}
       </div>
       
       {/* Progress Bar */}
       <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 700, opacity: 0.6 }}>
             <span>ADIM {currentStep + 1} / {totalSteps}</span>
             <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% TAMAMLANDI</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
             <div style={{ 
                width: `${((currentStep + 1) / totalSteps) * 100}%`, 
                height: '100%', 
                background: 'var(--primary)', 
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 15px var(--primary-glow)' 
              }} />
          </div>
       </div>

       <div style={{ flex: 1 }} className="animate-fade-in" key={currentStep}>
          {/* STEP 0: GOAL SELECTION */}
          {currentStep === 0 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Hedefin Nedir?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Sana en uygun antrenman tarzını belirleyelim.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {GOAL_OPTIONS.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => setFormData({...formData, goal: opt.id})}
                    className={`glass-panel pointer hover-scale ${formData.goal === opt.id ? 'active-card' : ''}`}
                    style={{ 
                      padding: '24px', 
                      border: formData.goal === opt.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.goal === opt.id ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      margin: '0 auto 16px', color: formData.goal === opt.id ? 'var(--primary)' : 'var(--text-muted)'
                    }}>
                      {opt.icon}
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{opt.title}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: EXPERIENCE & FREQUENCY */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Seviye ve Sıklık</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Deneyimini ve haftalık ayıracağın süreyi seç.</p>
              
              <div style={{ marginBottom: '32px' }}>
                 <label style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>DENEYİM SEVİYESİ</label>
                 <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                   {EXPERIENCE_LEVELS.map(lvl => (
                     <button 
                       key={lvl} type="button"
                       onClick={() => setFormData({...formData, level: lvl})}
                       style={{ 
                         flex: 1, padding: '12px', fontSize: '0.9rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                         background: formData.level === lvl ? 'var(--primary)' : 'transparent',
                         color: formData.level === lvl ? '#fff' : 'var(--text-muted)',
                         transition: 'all 0.2s', fontWeight: 600
                       }}
                     >
                       {lvl}
                     </button>
                   ))}
                 </div>
              </div>

              <div>
                 <label style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>HAFTADA KAÇ GÜN?</label>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <input 
                      type="range" min="1" max="7" 
                      style={{ flex: 1, accentColor: 'var(--primary)' }}
                      value={formData.daysPerWeek} 
                      onChange={(e) => setFormData({...formData, daysPerWeek: e.target.value})} 
                    />
                    <div style={{ 
                      width: '60px', height: '60px', background: 'var(--primary)', color: '#fff', 
                      borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                       <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formData.daysPerWeek}</span>
                       <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>GÜN</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* STEP 2: EQUIPMENT */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Ekipmanların</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Erişimin olan spor aletlerini işaretle.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                 {equipmentsList.map(eq => (
                   <div 
                     key={eq} 
                     onClick={() => handleEquipmentToggle(eq)}
                     className={`glass-panel pointer ${formData.equipments.includes(eq) ? 'active-tag' : ''}`}
                     style={{ 
                       padding: '12px 20px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 600,
                       border: '1px solid var(--border-color)',
                       background: formData.equipments.includes(eq) ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                       color: formData.equipments.includes(eq) ? '#fff' : 'var(--text-main)',
                       transition: 'all 0.2s'
                     }}
                   >
                     {eq}
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* STEP 3: EXTRAS */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Sana Özel Detaylar</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Eklemek istediğin özel bir bilgi var mı?</p>
              <textarea 
                 name="extraInformation" className="form-input" rows="8" 
                 placeholder="Sakatlık, odaklanmak istediğin bölge veya özel durumlarını buraya yazabilirsin..."
                 style={{ borderRadius: '20px', padding: '20px', fontSize: '1rem', background: 'rgba(255,255,255,0.02)' }}
                 value={formData.extraInformation} onChange={handleChange}
               ></textarea>
            </div>
          )}

          {/* STEP 4: SUMMARY */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Harika Gözüküyor!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>İşte senin için hazırladığımız planın özeti:</p>
              
              <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.6 }}>Hedef:</span>
                       <span style={{ fontWeight: 700 }}>{formData.goal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.6 }}>Deneyim:</span>
                       <span style={{ fontWeight: 700 }}>{formData.level}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.6 }}>Sıklık:</span>
                       <span style={{ fontWeight: 700 }}>{formData.daysPerWeek} Gün / Hafta</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.6 }}>Ekipman:</span>
                       <span style={{ fontWeight: 700, textAlign: 'right' }}>{formData.equipments.length > 0 ? formData.equipments.length + ' adet seçili' : 'Vücut Ağırlığı'}</span>
                    </div>
                 </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                 <label style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>PROGRAMA İSİM VER (OPSİYONEL)</label>
                 <input 
                   type="text" 
                   className="form-input"
                   placeholder="Örn: Sahil Hazırlık, Kış Programı..."
                   style={{ height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}
                   value={formData.planName}
                   onChange={(e) => setFormData({...formData, planName: e.target.value})}
                 />
              </div>
            </div>
          )}
          
          {/* STEP 5: SAFETY & DISCLAIMER */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                 <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                    <ShieldAlert size={32} />
                 </div>
                 <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Güvenlik ve Sorumluluk</h2>
              </div>
              
              <div className="glass-panel" style={{ 
                padding: '24px', 
                background: 'rgba(239, 68, 68, 0.03)', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                marginBottom: '32px'
              }}>
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <AlertTriangle color="#ef4444" size={24} style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#fca5a5' }}>
                      <strong>ÖNEMLİ:</strong> Herhangi bir egzersiz programına başlamadan önce bir doktora danışmanız şiddetle tavsiye edilir. Sakatlık, hamilelik veya kronik rahatsızlık durumlarında antrenman yapmayınız.
                    </p>
                 </div>
                 
                 <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <p>Antrenman yaparken vücudunuzu dinleyin. Keskin bir ağrı veya baş dönmesi hissederseniz hemen durun.</p>
                    <p style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '12px' }}>
                      * Bu yapay zeka tarafından oluşturulan bir rehberdir. Egzersizlerin uygulanması sırasında oluşabilecek sakatlık veya sağlık problemlerinden platformumuz ve geliştiricilerimiz sorumlu tutulamaz.
                    </p>
                 </div>
              </div>

              <label className="glass-panel pointer hover-scale" style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                border: formData.disclaimerAccepted ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: formData.disclaimerAccepted ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
              }}>
                 <input 
                   type="checkbox" 
                   checked={formData.disclaimerAccepted}
                   onChange={(e) => setFormData({...formData, disclaimerAccepted: e.target.checked})}
                   style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                 />
                 <span style={{ fontSize: '1rem', fontWeight: 600 }}>
                   Okudum, anladım ve sorumluluğu kabul ediyorum.
                 </span>
              </label>
            </div>
          )}
        </div>

       {/* Navigation Buttons */}
       <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
          {currentStep > 0 && (
            <button onClick={prevStep} className="btn btn-secondary" style={{ flex: 1, height: '56px' }}>
               Geri Dön
            </button>
          )}
          
          {currentStep < totalSteps - 1 ? (
            <button onClick={nextStep} className="btn btn-primary" style={{ flex: 2, height: '56px' }}>
               Devam Et <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={generationLoading || !formData.disclaimerAccepted} 
              className="btn btn-primary" 
              style={{ 
                flex: 2, height: '56px', 
                boxShadow: formData.disclaimerAccepted ? '0 10px 25px var(--primary-glow)' : 'none',
                opacity: formData.disclaimerAccepted ? 1 : 0.5,
                cursor: formData.disclaimerAccepted ? 'pointer' : 'not-allowed'
              }}
            >
               {generationLoading ? (
                 <><RefreshCcw size={24} className="animate-spin" /> Hazırlanıyor</>
               ) : (
                 <><Zap size={24} /> Programı Oluştur</>
               )}
            </button>
          )}
       </div>
    </div>
  );
};

export default WorkoutWizard;
