import React from 'react';
import { Camera, RefreshCw, Info, AlertTriangle, CheckCircle2, Dumbbell, Award } from 'lucide-react';
import { useAiPoseCoach } from '../hooks/useAiPoseCoach';

const AiPoseCoach = () => {
  const {
    videoRef,
    canvasRef,
    isCameraActive,
    loading,
    error,
    feedback,
    reps,
    activeExercise,
    sessionSummary,
    startCamera,
    stopCamera,
    handleExerciseChange,
    setSessionSummary,
    setReps
  } = useAiPoseCoach();

  const exerciseTips = {
    squat: "Tam derinlik için kalçanızın diz hizanızın altına indiğinden emin olun. (Diz açısı < 85°)",
    pushup: "Göğsünüzün yere iyice yaklaştığından ve kollarınızın tam açıldığından emin olun.",
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1000px' }}>
      
      <header style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '15px', color: '#fff' }}>
          <Camera size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>AI Kamera Koçu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Gerçek zamanlı yapay zeka form analizi ve sayacı</p>
        </div>
      </header>

      {/* Exercise Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {['squat', 'pushup'].map((ex) => (
          <button 
            key={ex}
            onClick={() => handleExerciseChange(ex)}
            className={`btn ${activeExercise === ex ? 'btn-primary premium-shadow' : 'btn-secondary'}`}
            style={{ minWidth: '120px', textTransform: 'capitalize' }}
          >
            <Dumbbell size={16} /> {ex === 'pushup' ? 'Şınav' : 'Squat'}
          </button>
        ))}
      </div>

      {error && (
        <div className="toast toast-error animate-slide-in" style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <div className="toast-icon"><AlertTriangle size={20} /></div>
          <div className="toast-message">{error}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }} className="responsive-grid">
        
        {/* Camera Area */}
        <div className="glass-panel" style={{ overflow: 'hidden', position: 'relative', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
          
          {/* Always render video and canvas to preserve refs */}
          <video 
            ref={videoRef} 
            style={{ display: 'none' }} 
            playsInline
          />
          <canvas 
            ref={canvasRef}
            width="640" 
            height="480" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              display: isCameraActive ? 'block' : 'none'
            }}
          />

          {!isCameraActive && (
            <div style={{ textAlign: 'center', padding: '40px', position: 'absolute' }}>
              <Camera size={60} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>Kamerayı Etkinleştir</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '300px', margin: '0 auto 30px' }}>
                Yapay zekanın vücut formunuzu analiz edebilmesi için kamera izni gereklidir. Görüntüler hiçbir yere kaydedilmez.
              </p>
              <button onClick={startCamera} disabled={loading} className="btn btn-primary">
                {loading ? <RefreshCw className="spin" size={20} /> : <Camera size={20} />} Kamerayı Aç
              </button>
            </div>
          )}

          {isCameraActive && (
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
               <button onClick={stopCamera} className="btn btn-secondary" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none' }}>
                  Kapat
               </button>
            </div>
          )}

          {(!isCameraActive && sessionSummary) && (
            <div className="animate-slide-up" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.9)', zIndex: 10 }}>
               <div className="premium-glass-dark" style={{ padding: '40px', borderRadius: '32px', textAlign: 'center', border: '2px solid var(--primary)', maxWidth: '400px' }}>
                  <div style={{ background: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px var(--primary-glow)' }}>
                     <Award size={40} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>Seans Tamamlandı!</h2>
                  <div style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '30px' }}>
                     <span style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 800 }}>{sessionSummary.exercise}</span> seansında 
                     <span style={{ fontSize: '2rem', display: 'block', fontWeight: 900, color: '#fff', margin: '10px 0' }}>{sessionSummary.reps} Tekrar</span>
                     yaptın.
                  </div>
                  <button onClick={() => { setSessionSummary(null); setReps(0); }} className="btn btn-primary" style={{ width: '100%' }}>
                     Yeni Seans Başlat
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Feedback Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(14,165,233,0.1))' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'capitalize' }}>
               {activeExercise === 'pushup' ? 'Şınav' : activeExercise === 'situp' ? 'Mekik' : 'Squat'} Sayacı
            </h3>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>
              {reps}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px', flex: 1 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '1.2rem', color: 'var(--primary)' }}>
              <Info size={24} /> Canlı Geri Bildirim
            </h3>
            
            <div style={{ 
              padding: '20px', borderRadius: '15px', 
              background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
              fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)',
              display: 'flex', alignItems: 'center', gap: '10px', minHeight: '100px'
            }}>
              {isCameraActive ? (
                <>
                  <CheckCircle2 color="var(--success)" size={24} style={{ flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.4 }}>{feedback}</span>
                </>
              ) : (
                 "Analiz için kamerayı açın."
              )}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 169, 68, 0.1)', borderRadius: '10px', borderLeft: '4px solid var(--warning)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>İpucu:</strong> {exerciseTips[activeExercise]}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiPoseCoach;
