import React, { useMemo } from 'react';
import { Target, Dumbbell, Flame, Zap, Award, Info } from 'lucide-react';

const GOAL_DATA = {
  HYPERTROPHY: {
    title: "Kas & Hacim Gelişimi 🏋️‍♂️",
    color: "var(--primary)",
    icon: <Dumbbell size={24} color="#fff" />,
    quote: "Büyük hedefler, büyük disiplin gerektirir. Kas gelişimi mutfakta başlar, salonda şekillenir.",
    tips: [
      "Günlük protein hedefini tutturduğundan emin ol.",
      "Antrenmanlarında kaldırdığın ağırlıkları zamanla kademeli olarak artır.",
      "Kaslarının en verimli şekilde dinlenip büyümesi için uyku düzenine dikkat et; en az 7-8 saat uyu."
    ]
  },
  FAT_LOSS: {
    title: "Kilo Verme & Yağ Yakımı 🔥",
    color: "#f43f5e", // Rose
    icon: <Flame size={24} color="#fff" />,
    quote: "Sabır ve istikrar, en inatçı yağları bile eritir. Her gün attığın küçük adımlar büyük fark yaratır.",
    tips: [
      "Kalori açığı oluşturmaya odaklan; yediklerini Beslenme Günlüğü'ne dürüstçe kaydet.",
      "Günlük adım sayını artır (en az 10.000 adım). Gün içindeki hareketlilik metabolizmanı canlı tutar.",
      "Kas kaybını önlemek için antrenmanlarını aksatma ve protein içeren gıdaları tüketmeye dikkat et."
    ]
  },
  STRENGTH: {
    title: "Güç & Performans ⚡",
    color: "#eab308", // Yellow
    icon: <Zap size={24} color="#fff" />,
    quote: "Güç, fiziksel kapasiteden değil, boyun eğmeyen bir iradeden gelir. Sınırlarını zorla!",
    tips: [
      "Squat, Bench Press, Deadlift gibi temel güç egzersizlerinde hareket formunun kusursuz olmasına odaklan.",
      "Setler arasında tam toparlanma ve maksimum güç üretimi için 2-3 dakika dinlenmekten çekinme.",
      "Vücuduna yeterli enerjiyi sağlamak ve performansını yüksek tutmak için beslenmeni ihmal etme."
    ]
  },
  ENDURANCE: {
    title: "Dayanıklılık & Kondisyon 🏃‍♂️",
    color: "#10b981", // Emerald
    icon: <Award size={24} color="#fff" />,
    quote: "Rüzgar ne kadar sert eserse essin, yoluna devam edenler hedefine ulaşır. Dayanıklılık zihinde başlar.",
    tips: [
      "Akciğer ve kalp kondisyonunu geliştirmek için haftalık uzun, yavaş tempolu koşu, bisiklet veya yürüyüş seansları ekle.",
      "Vücudunun su ve mineral dengesini korumak için bol su tüketimine dikkat et.",
      "Dinlenme günlerini ihmal etme; kaslarını dinlendirecek hafif yürüyüşler veya esneme hareketleri yap."
    ]
  }
};

const AiTipCard = ({ metrics }) => {
  const goalKey = metrics?.goal || 'HYPERTROPHY';
  
  const currentGoal = useMemo(() => {
    return GOAL_DATA[goalKey] || GOAL_DATA.HYPERTROPHY;
  }, [goalKey]);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '30px', position: 'relative', overflow: 'hidden', height: '100%', minHeight: '280px' }}>
      
      {/* Background Subtle Icon Glow */}
      <div style={{ 
        position: 'absolute', 
        top: '-15%', 
        right: '-5%', 
        opacity: 0.05, 
        transform: 'rotate(15deg) scale(1.5)', 
        color: currentGoal.color,
        pointerEvents: 'none'
      }}>
        {currentGoal.icon}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        <div>
          <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              background: currentGoal.color, 
              padding: '10px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${currentGoal.color}30`
            }}>
              {currentGoal.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>Günlük Tavsiye</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Hedef: <span style={{ color: currentGoal.color, fontWeight: 800 }}>{currentGoal.title}</span>
              </span>
            </div>
          </header>

          {/* Inspirational Quote */}
          <p style={{ 
            fontStyle: 'italic', 
            color: 'var(--text-main)', 
            fontSize: '0.95rem', 
            lineHeight: 1.6, 
            opacity: 0.9,
            marginBottom: '20px',
            borderLeft: `3px solid ${currentGoal.color}`,
            paddingLeft: '12px'
          }}>
            "{currentGoal.quote}"
          </p>

          {/* Tips List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentGoal.tips.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: currentGoal.color, 
                  marginTop: '7px', 
                  flexShrink: 0 
                }}></div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginTop: '20px', 
          paddingTop: '15px', 
          borderTop: '1px solid var(--glass-border)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          opacity: 0.8
        }}>
          <Info size={12} color={currentGoal.color} />
          <span>Fiziksel profil hedeflerine göre her gün optimize edilir.</span>
        </div>

      </div>
    </div>
  );
};

export default React.memo(AiTipCard);
