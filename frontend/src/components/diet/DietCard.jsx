import React from 'react';
import { 
  CheckCircle, Clock, Trash2, Droplets, Info 
} from 'lucide-react';

const DietCard = ({ 
  plan, 
  index, 
  historyCount, 
  expandedPlan, 
  setExpandedPlan, 
  handleDeletePlan, 
  setSelectedMeal,
  parseDietJson 
}) => {
  const planData = parseDietJson(plan.generatedPlanJson);
  const isExpanded = expandedPlan === plan.dietPlanId;
  
  return (
    <div className="glass-panel animate-fade-in hover-glow" style={{ padding: '0', overflow: 'hidden', border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '24px' }}>
      
      {/* HEADER */}
      <div 
        style={{ padding: '28px', background: isExpanded ? 'rgba(99, 102, 241, 0.05)' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setExpandedPlan(isExpanded ? null : plan.dietPlanId)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '14px', 
              background: isExpanded ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isExpanded ? '#fff' : 'var(--success)',
              transition: 'all 0.3s'
            }}>
              <CheckCircle size={24} />
            </div>
            <div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 700 }}>
                   {plan.planName || `Plan #${historyCount - index}`}
                </h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Clock size={14} /> {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Bilinmeyen Tarih'}
                </span>
            </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
                <div className="text-glow-primary" style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)' }}>{plan.targetDailyCalories} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>kcal</span></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Günlük Hedef</div>
            </div>
            <button 
                onClick={(e) => handleDeletePlan(e, plan.dietPlanId)}
                className="hover-glow-error"
                style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                title="Planı Sil"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {/* DETAILS BODY */}
      {isExpanded && (
        <div style={{ padding: '0 28px 32px 28px', borderTop: '1px solid var(--border-color)' }}>
            
            {planData ? (
              <>
                {/* MACROS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', margin: '32px 0' }}>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Protein</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{plan.targetProtein}<span style={{fontSize: '0.9rem', opacity: 0.6, marginLeft: '2px'}}>g</span></div>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Karb</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{plan.targetCarbs}<span style={{fontSize: '0.9rem', opacity: 0.6, marginLeft: '2px'}}>g</span></div>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.2)', background: 'rgba(244, 63, 94, 0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yağ</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{plan.targetFats}<span style={{fontSize: '0.9rem', opacity: 0.6, marginLeft: '2px'}}>g</span></div>
                    </div>
                </div>

                 {/* WATER INTAKE */}
                {planData.waterIntakeL && (
                  <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px', background: 'rgba(14, 165, 233, 0.05)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                     <div style={{ background: 'var(--secondary)', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px var(--secondary-glow)' }}>
                        <Droplets size={24} />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '800', letterSpacing: '1px' }}>GÜNLÜK SU HEDEFİ</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{planData.waterIntakeL} <span style={{fontSize: '1rem', opacity: 0.7}}>Litre / Gün</span></div>
                     </div>
                  </div>
                )}

                {/* MEALS LIST */}
                <h5 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                  <Info size={20} color="var(--primary)" /> Öğün Detayları
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {planData.meals && planData.meals.map((meal, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="glass-panel hover-glow" 
                          onClick={() => setSelectedMeal(meal)}
                          style={{ border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div className="flex justify-between items-center" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <h6 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '800' }}>{meal.mealName}</h6>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>{meal.totalCalories} kcal</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', opacity: 0.9 }}>
                                {meal.items && meal.items.slice(0, 3).map((item, iIdx) => (
                                    <li key={iIdx} style={{marginBottom: '6px'}}>{item}</li>
                                ))}
                                {meal.items?.length > 3 && <li style={{listStyle: 'none', color: 'var(--primary)', fontWeight: '700', marginTop: '8px', fontSize: '0.85rem'}}>+{meal.items.length - 3} daha fazla içerik...</li>}
                            </ul>
                        </div>
                    ))}
                </div>
              </>
            ) : (
              <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '48px', borderRadius: '24px', border: '1px solid rgba(244, 63, 94, 0.2)', textAlign: 'center', marginTop: '32px' }}>
                <Info size={48} color="#f43f5e" style={{ margin: '0 auto 20px' }} />
                <h4 style={{ color: '#f43f5e', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>Veri Okunamadı</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>Bu diyet planının formatı bozulmuş veya eski bir sürüm olabilir.</p>
              </div>
            )}

        </div>
      )}
    </div>
  );
};

export default DietCard;
