import { useState, useEffect, useCallback, useRef } from 'react';
import { useWorkoutTimer } from './useWorkoutTimer';
import { useVoiceGuidance } from './useVoiceGuidance';

export const useWorkoutPlayer = (plan) => {
  const [currentDayIdx, setCurrentDayIdx] = useState(() => {
    try {
      const startIdx = plan?.startDayIdx || 0;
      return (plan?.days && startIdx >= 0 && startIdx < plan.days.length) ? startIdx : 0;
    } catch {
      return 0;
    }
  });

  const currentDay = (plan?.days && plan.days[currentDayIdx]) || (plan?.days && plan.days[0]) || null;
  const warmupExercises = currentDay?.warmupExercises || [];
  const exercises = currentDay?.exercises || [];

  const [currentStep, setCurrentStep] = useState(() => {
    return warmupExercises.length > 0 ? 'warmup' : 'exercise';
  });
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [warmupIdx, setWarmupIdx] = useState(0);

  // Kalıcı ilerleme takibi için localStorage kullanıyoruz
  const storageKey = `completed_days_${plan?.workoutPlanId || 'default'}`;
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const currentWarmup = warmupExercises[warmupIdx];
  const currentExercise = currentStep === 'warmup' ? currentWarmup : exercises[exerciseIdx];

  const handleStepNextRef = useRef();

  const { restTimer, startTimer, stopTimer, skipTimer } = useWorkoutTimer(() => handleStepNextRef.current?.());

  const handleStepNext = useCallback(() => {
    if (currentStep === 'warmup') {
      if (warmupIdx < warmupExercises.length - 1) {
        setWarmupIdx(prev => prev + 1);
      } else {
        setCurrentStep('exercise');
        setExerciseIdx(0);
      }
    } else if (currentStep === 'exercise') {
      const restVal = currentExercise?.rest;
      const restSec = (restVal !== null && restVal !== undefined && !isNaN(parseInt(restVal))) ? parseInt(restVal) : 60;
      setCurrentStep('rest');
      startTimer(restSec);
    } else if (currentStep === 'rest') {
      if (exerciseIdx < exercises.length - 1) {
        setExerciseIdx(prev => prev + 1);
        setCurrentStep('exercise');
      } else {
        setCurrentStep('finished');
        
        // Save to completed days directly on finishing, inside the action handler
        setCompletedDays(prev => {
          if (!prev.includes(currentDayIdx)) {
            const updated = [...prev, currentDayIdx];
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    }
  }, [currentStep, warmupIdx, warmupExercises.length, currentExercise, exercises.length, exerciseIdx, startTimer, currentDayIdx, storageKey]);

  useEffect(() => {
    handleStepNextRef.current = handleStepNext;
  }, [handleStepNext]);

  // Cleanup timer on day change or unmount
  useEffect(() => {
    return () => stopTimer();
  }, [currentDayIdx, stopTimer]);

  const getImageUrl = useCallback((path) => {
    if (!path) return '';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    if (!path.includes('gifs_360x360')) {
        return `${baseUrl}/exercise-images/${path}`;
    }
    return `${baseUrl}/gifs/gifs_360x360/${path}`;
  }, []);

  const totalActions = warmupExercises.length + exercises.length;
  const currentActionIdx = currentStep === 'warmup' ? warmupIdx : warmupExercises.length + exerciseIdx;
  const progressPercentage = totalActions > 0 
    ? ((currentActionIdx + (currentStep === 'rest' || currentStep === 'finished' ? 1 : 0.5)) / totalActions) * 100
    : 0;

  const [isFocused, setIsFocused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const { speak, stop } = useVoiceGuidance();

  // Voice Guidance Effect
  useEffect(() => {
    if (isMuted) return;
    if (currentStep === 'warmup' && currentWarmup) {
      speak(`Warm up: ${currentWarmup.exerciseName}`);
    } else if (currentStep === 'exercise' && currentExercise) {
      speak(`Next exercise: ${currentExercise.exerciseName}`);
    } else if (currentStep === 'rest') {
      speak("Rest time");
    } else if (currentStep === 'finished') {
      speak("Workout completed! Awesome job!");
    }
  }, [currentStep, warmupIdx, exerciseIdx, speak, isMuted, currentWarmup, currentExercise]);

  // Countdown Voice Effect
  useEffect(() => {
    if (isMuted) return;
    if (currentStep === 'rest') {
      if (restTimer === 3) speak("Three");
      else if (restTimer === 2) speak("Two");
      else if (restTimer === 1) speak("One");
    }
  }, [restTimer, currentStep, speak, isMuted]);

  // Mute toggle effect
  useEffect(() => {
    if (isMuted) {
      stop();
    }
  }, [isMuted, stop]);

  useEffect(() => {
    document.body.classList.add('workout-mode-active');
    
    // Safety check for fullscreen if it didn't trigger on click
    if (!document.fullscreenElement) {
      try {
        document.documentElement.requestFullscreen().catch(() => {});
      } catch {
        // Ignored
      }
    }

    return () => {
      document.body.classList.remove('workout-mode-active');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return {
    currentDayIdx,
    setCurrentDayIdx,
    currentDay,
    warmupExercises,
    exercises,
    currentStep,
    setCurrentStep,
    exerciseIdx,
    setExerciseIdx,
    setWarmupIdx,
    warmupIdx,
    completedDays,
    currentWarmup,
    currentExercise,
    getImageUrl,
    progressPercentage,
    isFocused,
    setIsFocused,
    isMuted,
    setIsMuted,
    restTimer,
    skipTimer,
    stopTimer,
    toggleFullScreen,
    handleStepNext
  };
};
