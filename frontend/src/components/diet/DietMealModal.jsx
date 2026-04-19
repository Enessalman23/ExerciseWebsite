import React from 'react';
import { Apple, X, Info } from 'lucide-react';

const DietMealModal = ({ selectedMeal, setSelectedMeal }) => {
  if (!selectedMeal) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
      <div className="modal-content glass-panel" style={{ padding: '32px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setSelectedMeal(null)} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
           <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px', borderRadius: '16px', color: 'var(--primary)' }}>
              <Apple size={32} />
           </div>
           <div>
              <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{selectedMeal.mealName}</h2>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>{selectedMeal.totalCalories} Kalori</span>
           </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
           <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>İçerikler</h4>
           <div style={{ background: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '16px' }}>
              <ul style={{ margin: 0, paddingLeft: '24px', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {selectedMeal.items.map((it, idx) => <li key={idx}>{it}</li>)}
              </ul>
           </div>
        </div>

        {selectedMeal.prepTip && (
          <div>
             <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} color="var(--primary)" /> Hazırlama Önerisi
             </h4>
             <div style={{ background: 'rgba(79, 70, 229, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(79, 70, 229, 0.1)', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{selectedMeal.prepTip}"
             </div>
          </div>
        )}

        <button onClick={() => setSelectedMeal(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '30px' }}>Anladım</button>
      </div>
    </div>
  );
};

export default DietMealModal;
