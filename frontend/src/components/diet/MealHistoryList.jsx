import React from 'react';
import { History, Utensils, Trash2 } from 'lucide-react';

const MealHistoryList = ({ meals, handleDeleteMeal }) => {
  return (
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
  );
};

export default MealHistoryList;
