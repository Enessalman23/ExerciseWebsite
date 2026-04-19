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
    <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden', border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-color)', transition: 'all 0.3s' }}>
      
      {/* HEADER */}
      <div 
        style={{ padding: '24px', background: isExpanded ? 'rgba(79, 70, 229, 0.03)' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setExpandedPlan(isExpanded ? null : plan.dietPlanId)}
      >
        <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <CheckCircle size={18} color="var(--success)" /> {plan.planName || `Plan #${historyCount - index}`}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {new Date(plan.createdAt || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{plan.targetDailyCalories} kcal</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Günlük Hedef</div>
            </div>
            <button 
                onClick={(e) => handleDeletePlan(e, plan.dietPlanId)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                title="Planı Sil"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      {/* DETAILS BODY */}
      {isExpanded && (
        <div style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border-color)' }}>
            
            {planData ? (
              <>
                {/* MACROS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', margin: '24px 0' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Protein</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{plan.targetProtein}g</div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Karbonhidrat</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{plan.targetCarbs}g</div>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Yağ</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{plan.targetFats}g</div>
                    </div>
                </div>

                 {/* WATER INTAKE */}
                {planData.waterIntakeL && (
                  <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', background: 'rgba(6, 182, 212, 0.05)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                     <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px', color: '#fff' }}>
                        <Droplets size={24} />
                     </div>
                     <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 'bold' }}>GÜNLÜK SU HEDEFİ</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{planData.waterIntakeL} Litre / Gün</div>
                     </div>
                  </div>
                )}

                {/* MEALS LIST */}
                <h5 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} /> Öğün Detayları (Detay için tıkla)
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {planData.meals && planData.meals.map((meal, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="glass-panel" 
                          onClick={() => setSelectedMeal(meal)}
                          style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}
                        >
                            <div className="flex justify-between items-center" style={{ marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                                <h6 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', fontWeight: '700' }}>{meal.mealName}</h6>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{meal.totalCalories} kcal</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5', opacity: 0.8 }}>
                                {meal.items && meal.items.slice(0, 3).map((item, iIdx) => (
                                    <li key={iIdx} style={{marginBottom: '4px'}}>{item}</li>
                                ))}
                                {meal.items?.length > 3 && <li style={{listStyle: 'none', color: 'var(--primary)', fontWeight: '600'}}>+{meal.items.length - 3} daha...</li>}
                            </ul>
                        </div>
                    ))}
                </div>
              </>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <Info size={40} color="var(--error)" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ color: 'var(--error)', marginBottom: '8px' }}>Veri Okunamadı</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bu diyet planının formatı bozulmuş veya eski bir sürüm.</p>
              </div>
            )}

        </div>
      )}
    </div>
  );
};

export default DietCard;
