import { useRef, useState, useEffect, useCallback } from 'react';
import { useVoiceGuidance } from './useVoiceGuidance';

export const useAiPoseCoach = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('Kamera bekleniyor...');
  const [reps, setReps] = useState(0);
  
  // Exercise Selection & State
  const [activeExercise, setActiveExercise] = useState('squat'); // squat, pushup, situp
  const [sessionSummary, setSessionSummary] = useState(null);
  const { speak } = useVoiceGuidance();

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

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
    if (reps > 0) {
      setSessionSummary({
        exercise: stateRef.current.activeExercise,
        reps: reps,
        time: new Date().toLocaleTimeString()
      });
      speak(`Session finished. You completed ${reps} reps. Great job!`);
    }
  }, [reps, speak]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    return () => {
      // Clean up camera on unmount
      if (currentVideo && currentVideo.srcObject) {
        const tracks = currentVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleExerciseChange = useCallback((exercise) => {
    setActiveExercise(exercise);
    setReps(0);
    stateRef.current.movementState = exercise === 'situp' ? 'down' : 'up';
    stateRef.current.lastRepTime = 0;
    stateRef.current.angleBuffer = [];
    setFeedback('Hazırlanılıyor...');
  }, []);

  // Calculate angle between three points (e.g., hip, knee, ankle)
  const calculateAngle = useCallback((a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }, []);

  // Smooth angle using Simple Moving Average to prevent noise/flickering
  const getSmoothedAngle = useCallback((angle) => {
    const buffer = stateRef.current.angleBuffer;
    buffer.push(angle);
    if (buffer.length > 5) buffer.shift(); // Keep last 5 frames
    const sum = buffer.reduce((acc, val) => acc + val, 0);
    return sum / buffer.length;
  }, []);

  const registerRep = useCallback(() => {
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
  }, [speak]);

  const getBestSide = useCallback((landmarks, leftIndices, rightIndices) => {
    const leftVis = (landmarks[leftIndices[0]].visibility + landmarks[leftIndices[1]].visibility + landmarks[leftIndices[2]].visibility) / 3;
    const rightVis = (landmarks[rightIndices[0]].visibility + landmarks[rightIndices[1]].visibility + landmarks[rightIndices[2]].visibility) / 3;
    
    if (leftVis < 0.3 && rightVis < 0.3) return null;
    return leftVis > rightVis ? leftIndices : rightIndices;
  }, []);

  // --- SQUAT ALGORITHM ---
  const analyzeSquat = useCallback((landmarks) => {
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
    
    // Hip angle check to ensure the user is standing vertically and not sitting down or bending forward excessively
    const shoulderIndex = indices[0] === 23 ? 11 : 12;
    const shoulder = landmarks[shoulderIndex];
    const hipAngle = calculateAngle(shoulder, hip, knee);

    if (angle > 165) {
      if (hipAngle < 130) {
        setFeedback("Lütfen tam doğrulun (Gövdenizi dikleştirin).");
        return;
      }
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
  }, [getBestSide, calculateAngle, getSmoothedAngle, registerRep]);

  // --- PUSH-UP (ŞINAV) ALGORITHM ---
  const analyzePushup = useCallback((landmarks) => {
    const indices = getBestSide(landmarks, [11, 13, 15], [12, 14, 16]); // Shoulder, Elbow, Wrist

    if (!indices) {
       setFeedback("Kollarınızın (omuz, dirsek, bilek) kamerada göründüğünden emin olun.");
       return;
    }

    const shoulder = landmarks[indices[0]];
    const elbow = landmarks[indices[1]];
    const wrist = landmarks[indices[2]];

    // Torso angle guard to prevent counting arm movements while sitting/standing straight
    const hipIndex = indices[0] === 11 ? 23 : 24;
    const hip = landmarks[hipIndex];
    if (hip) {
      const deltaX = Math.abs(shoulder.x - hip.x);
      const deltaY = Math.abs(shoulder.y - hip.y);
      // Normalized coordinates adjusted for 640x480 resolution aspect ratio
      const physicalDeltaY = deltaY * 480;
      const physicalDeltaX = deltaX * 640;
      
      // If the vertical distance is much larger than horizontal distance, torso is vertical
      if (physicalDeltaY > physicalDeltaX * 0.8) {
        setFeedback("Lütfen şınav pozisyonu alın (Vücudunuzu yatay konuma getirin).");
        return;
      }
    }

    const rawAngle = calculateAngle(shoulder, elbow, wrist);
    const angle = getSmoothedAngle(rawAngle);
    const mState = stateRef.current.movementState;
    
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
  }, [getBestSide, calculateAngle, getSmoothedAngle, registerRep]);



  const onResults = useCallback((results) => {
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
      
      const currentEx = stateRef.current.activeExercise;
      if (currentEx === 'squat') analyzeSquat(results.poseLandmarks);
      else if (currentEx === 'pushup') analyzePushup(results.poseLandmarks);
      
    } else {
      setFeedback("Vücut tespit edilemedi. Lütfen tam olarak kameraya girin.");
    }
    canvasCtx.restore();
  }, [analyzeSquat, analyzePushup]);

  const initMediaPipe = useCallback(() => {
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
          if (videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  }, [onResults]);

  const startCamera = useCallback(async () => {
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
  }, [initMediaPipe]);

  return {
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
  };
};
