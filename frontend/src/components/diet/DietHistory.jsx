import React from 'react';
import { Apple } from 'lucide-react';
import Skeleton from '../Skeleton';
import DietCard from './DietCard';

const DietHistory = ({ 
  history, 
  loading, 
  generationLoading, 
  expandedPlan, 
  setExpandedPlan, 
  handleDeletePlan, 
  setSelectedMeal,
  parseDietJson 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>Rapor Geçmişi</h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'var(--surface-color)', padding: '4px 12px', borderRadius: '12px' }}>Toplam {history.length} Plan</span>
      </div>
      
      {loading || generationLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {[1,2,3].map(i => (
              <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Skeleton width="40px" height="40px" />
                      <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        <Skeleton width="150px" />
                        <Skeleton width="100px" height="15px" />
                      </div>
                    </div>
                    <Skeleton width="80px" height="40px" />
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <Skeleton height="80px" /><Skeleton height="80px" /><Skeleton height="80px" />
                 </div>
              </div>
           ))}
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <Apple size={64} color="var(--primary)" style={{ margin: '0 auto 20px', opacity: 0.2 }} />
          <h3 style={{ marginBottom: '8px' }}>Henüz Bir Beslenme Planınız Yok</h3>
          <p style={{ color: 'var(--text-muted)' }}>Yukarıdaki "Yeni Plan Oluştur" butonuna tıklayarak yapay zeka asistanınıza anında beslenme planı yazdırabilirsiniz.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {history.map((plan, index) => (
            <DietCard 
              key={plan.dietPlanId}
              plan={plan}
              index={index}
              historyCount={history.length}
              expandedPlan={expandedPlan}
              setExpandedPlan={setExpandedPlan}
              handleDeletePlan={handleDeletePlan}
              setSelectedMeal={setSelectedMeal}
              parseDietJson={parseDietJson}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DietHistory;
