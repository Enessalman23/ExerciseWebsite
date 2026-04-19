import React from 'react';
import { Apple, X, Info, CheckCircle2, Flame, Utensils } from 'lucide-react';

const DietMealModal = ({ selectedMeal, setSelectedMeal }) => {
  if (!selectedMeal) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedMeal(null)} style={{ zIndex: 9999, backdropFilter: 'blur(12px)' }}>
      <div 
        className="modal-content animate-fade-in" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '550px', 
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0, 
          background: 'var(--surface-color)', 
          borderRadius: '32px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)', 
          padding: '40px 32px',
          position: 'relative'
        }}>
          <button 
            onClick={() => setSelectedMeal(null)} 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(0,0,0,0.2)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px',
              height: '36px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="hover-scale"
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '16px', 
              borderRadius: '20px', 
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <Utensils size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 4px 0', color: '#fff', fontWeight: 800 }}>{selectedMeal.mealName}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                <Flame size={16} />
                <span>{selectedMeal.totalCalories} Kalori</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '16px', 
              color: 'var(--text-main)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontWeight: 700
            }}>
              <Apple size={20} color="var(--primary)" /> İçerik ve Porsiyonlar
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              {selectedMeal.items.map((it, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  background: 'var(--surface-hover)',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s'
                }} className="hover-scale">
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{it}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedMeal.prepTip && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ 
                fontSize: '1.1rem', 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: 'var(--text-main)',
                fontWeight: 700
              }}>
                <Info size={20} color="var(--secondary)" /> Hazırlama Önerisi
              </h4>
              <div style={{ 
                background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)', 
                padding: '24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(14, 165, 233, 0.15)', 
                color: 'var(--text-main)', 
                lineHeight: '1.7',
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {selectedMeal.prepTip}
                </div>
                <Info size={80} color="var(--secondary)" style={{ 
                  position: 'absolute', 
                  bottom: '-20px', 
                  right: '-20px', 
                  opacity: 0.05,
                  zIndex: 0
                }} />
              </div>
            </div>
          )}

          <button 
            onClick={() => setSelectedMeal(null)} 
            className="btn btn-primary hover-scale" 
            style={{ 
              width: '100%', 
              height: '60px', 
              fontSize: '1.1rem', 
              fontWeight: 700,
              borderRadius: '18px',
              boxShadow: '0 10px 25px var(--primary-glow)'
            }}
          >
            Anladım, Teşekkürler
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietMealModal;
