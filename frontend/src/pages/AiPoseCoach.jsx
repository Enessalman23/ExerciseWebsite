import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Info, AlertTriangle, CheckCircle2, Dumbbell, Award, History } from 'lucide-react';
import { useVoiceGuidance } from '../hooks/useVoiceGuidance';

const AiPoseCoach = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('Kamera bekleniyor...');
  const [reps, setReps] = useState(0);
  
  // Exercise Selection & State
  const [activeExercise, setActiveExercise] = useState('squat'); // squat, pushup, situp
  const [movementState, setMovementState] = useState('up'); // 'up' or 'down'
  const [sessionSummary, setSessionSummary] = useState(null);
  const { speak } = useVoiceGuidance();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
    if (reps > 0) {
      setSessionSummary({
        exercise: activeExercise,
        reps: reps,
        time: new Date().toLocaleTimeString()
      });
      speak(`Seans bitti. ${reps} tekrar yaptın. Harika iş!`);
    }
  };

  // Ref for handling stale closures in MediaPipe callbacks
  const stateRef = useRef({
    activeExercise: 'squat',
    movementState: 'up',
    lastRepTime: 0,
    angleBuffer: []
  });

  // Keep ref in sync with state
  useEffect(() => {
    stateRef.current.activeExercise = activeExercise;
  }, [activeExercise]);

  const handleExerciseChange = (exercise) => {
    setActiveExercise(exercise);
    setReps(0);
    stateRef.current.movementState = exercise === 'situp' ? 'down' : 'up';
    stateRef.current.lastRepTime = 0;
    stateRef.current.angleBuffer = [];
    setFeedback('Hazırlanılıyor...');
  };

  // Calculate angle between three points (e.g., hip, knee, ankle)
  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  };

  // Smooth angle using Simple Moving Average to prevent noise/flickering
  const getSmoothedAngle = (angle) => {
    const buffer = stateRef.current.angleBuffer;
    buffer.push(angle);
    if (buffer.length > 5) buffer.shift(); // Keep last 5 frames
    const sum = buffer.reduce((acc, val) => acc + val, 0);
    return sum / buffer.length;
  };

  const registerRep = () => {
    const now = Date.now();
    // 800ms cooldown prevent double counts from micro-movements
    if (now - stateRef.current.lastRepTime > 800) {
      setReps(prev => {
        const newReps = prev + 1;
        if (newReps % 5 === 0) speak(`${newReps} tekrar oldu, harika gidiyorsun!`);
        return newReps;
      });
      stateRef.current.lastRepTime = now;
    }
  };

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        initMediaPipe();
      }
    } catch (err) {
      console.error(err);
      setError("Kamera izni alınamadı veya kamera bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  const initMediaPipe = () => {
    if (!window.Pose) {
      setError("MediaPipe yüklenemedi. Lütfen internet bağlantınızı kontrol edin.");
      return;
    }

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    if (videoRef.current && window.Camera) {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  };

  const onResults = (results) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw Video Frame to Canvas
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.poseLandmarks) {
      if (window.drawConnectors && window.POSE_CONNECTIONS) {
        window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS,
                       { color: '#00FF00', lineWidth: 4 });
      }
      if (window.drawLandmarks) {
        window.drawLandmarks(canvasCtx, results.poseLandmarks,
                      { color: '#FF0000', lineWidth: 2 });
      }
      
      // Route to active exercise algorithm using ref to avoid stale closures
      const currentEx = stateRef.current.activeExercise;
      if (currentEx === 'squat') analyzeSquat(results.poseLandmarks);
      else if (currentEx === 'pushup') analyzePushup(results.poseLandmarks);
      else if (currentEx === 'situp') analyzeSitup(results.poseLandmarks);
      
    } else {
      setFeedback("Vücut tespit edilemedi. Lütfen tam olarak kameraya girin.");
    }
    canvasCtx.restore();
  };

  const getBestSide = (landmarks, leftIndices, rightIndices) => {
    const leftVis = (landmarks[leftIndices[0]].visibility + landmarks[leftIndices[1]].visibility + landmarks[leftIndices[2]].visibility) / 3;
    const rightVis = (landmarks[rightIndices[0]].visibility + landmarks[rightIndices[1]].visibility + landmarks[rightIndices[2]].visibility) / 3;
    
    // Daha affedici visibility sınırı (0.3)
    if (leftVis < 0.3 && rightVis < 0.3) return null;
    return leftVis > rightVis ? leftIndices : rightIndices;
  };

  // --- SQUAT ALGORITHM ---
  const analyzeSquat = (landmarks) => {
    const indices = getBestSide(landmarks, [23, 25, 27], [24, 26, 28]); // Hip, Knee, Ankle

    if (!indices) {
       setFeedback("Lütfen bacaklarınızın kamerada tam göründüğünden emin olun.");
       return;
    }

    const hip = landmarks[indices[0]];
    const knee = landmarks[indices[1]];
    const ankle = landmarks[indices[2]];

    const rawAngle = calculateAngle(hip, knee, ankle);
    const angle = getSmoothedAngle(rawAngle);
    const mState = stateRef.current.movementState;
    
    // Nizami squat eşikleri (Daha dar aralık: >165 ve <85)
    if (angle > 165) {
      if (mState === 'down') {
        registerRep();
        stateRef.current.movementState = 'up';
      }
      setFeedback("Pozisyon iyi, aşağı çökebilirsin.");
    } else if (angle < 85) {
      if (mState === 'up') {
        stateRef.current.movementState = 'down';
      }
      setFeedback("Harika! Şimdi yukarı kalk.");
    } else {
      setFeedback(mState === 'up' ? "Daha aşağı in..." : "Yukarı doğru it...");
    }
  };

  // --- PUSH-UP (ŞINAV) ALGORITHM ---
  const analyzePushup = (landmarks) => {
    const indices = getBestSide(landmarks, [11, 13, 15], [12, 14, 16]); // Shoulder, Elbow, Wrist

    if (!indices) {
       setFeedback("Kollarınızın (omuz, dirsek, bilek) kamerada göründüğünden emin olun.");
       return;
    }

    const shoulder = landmarks[indices[0]];
    const elbow = landmarks[indices[1]];
    const wrist = landmarks[indices[2]];

    const rawAngle = calculateAngle(shoulder, elbow, wrist);
    const angle = getSmoothedAngle(rawAngle);
    const mState = stateRef.current.movementState;
    
    // Nizami şınav eşikleri (Daha dar aralık: >165 ve <80)
    if (angle > 165) {
      if (mState === 'down') {
        registerRep();
        stateRef.current.movementState = 'up';
      }
      setFeedback("Gövdeni yere doğru indir.");
    } else if (angle < 80) {
      if (mState === 'up') {
        stateRef.current.movementState = 'down';
      }
      setFeedback("Mükemmel! Kendini yukarı it.");
    } else {
      setFeedback(mState === 'up' ? "Daha aşağı in..." : "Yukarı doğru it...");
    }
  };

  // --- SIT-UP (MEKİK) ALGORITHM ---
  const analyzeSitup = (landmarks) => {
    // Shoulder, Hip, Knee
    const indices = getBestSide(landmarks, [11, 23, 25], [12, 24, 26]); 

    if (!indices) {
       setFeedback("Gövdenizin ve dizlerinizin kamerada göründüğünden emin olun.");
       return;
    }

    const shoulder = landmarks[indices[0]];
    const hip = landmarks[indices[1]];
    const knee = landmarks[indices[2]];

    const rawAngle = calculateAngle(shoulder, hip, knee);
    const angle = getSmoothedAngle(rawAngle);
    const mState = stateRef.current.movementState;
    
    // Nizami mekik eşikleri
    if (angle > 130) {
      if (mState === 'up') {
        registerRep();
        stateRef.current.movementState = 'down';
      }
      setFeedback("Geriye doğru yat.");
    } else if (angle < 60) {
      if (mState === 'down') {
        stateRef.current.movementState = 'up';
      }
      setFeedback("Harika! Şimdi yavaşça yat.");
    } else {
      setFeedback(mState === 'down' ? "Yukarı kalk..." : "Aşağı in...");
    }
  };

  const exerciseTips = {
    squat: "Tam derinlik için kalçanızın diz hizanızın altına indiğinden emin olun. (Diz açısı < 85°)",
    pushup: "Göğsünüzün yere iyice yaklaştığından ve kollarınızın tam açıldığından emin olun.",
    situp: "Sırtınızın yere değdiğinden ve kalkarken dizlerinize yaklaştığınızdan emin olun.",
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
        {['squat', 'pushup', 'situp'].map((ex) => (
          <button 
            key={ex}
            onClick={() => handleExerciseChange(ex)}
            className={`btn ${activeExercise === ex ? 'btn-primary premium-shadow' : 'btn-secondary'}`}
            style={{ minWidth: '120px', textTransform: 'capitalize' }}
          >
            <Dumbbell size={16} /> {ex === 'pushup' ? 'Şınav' : ex === 'situp' ? 'Mekik' : 'Squat'}
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
