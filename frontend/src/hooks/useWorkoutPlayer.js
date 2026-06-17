import { useState, useEffect, useCallback, useRef } from 'react';
import { useWorkoutTimer } from './useWorkoutTimer';
import { useVoiceGuidance } from './useVoiceGuidance';

export const useWorkoutPlayer = (plan) => {
  const storageKey = `completed_days_${plan?.workoutPlanId || 'default'}`;

  // Helper to check saved state on initialization
  const getInitialStateForDay = (dayIdx) => {
    if (!plan?.workoutPlanId) return null;
    try {
      const saved = localStorage.getItem(`workout_state_${plan.workoutPlanId}_${dayIdx}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const [currentDayIdx, setCurrentDayIdx] = useState(() => {
    try {
      // 1. If a specific day index was requested, use it
      if (plan?.startDayIdx !== undefined && plan.startDayIdx !== null) {
        return plan.startDayIdx;
      }
      
      // 2. Otherwise, check if there is a day that has saved progress (partially completed)
      if (plan?.days && plan?.workoutPlanId) {
        for (let i = 0; i < plan.days.length; i++) {
          const savedState = localStorage.getItem(`workout_state_${plan.workoutPlanId}_${i}`);
          if (savedState) {
            return i; // Resume this day!
          }
        }
      }
      
      // 3. Otherwise, check for the first uncompleted day
      const savedCompleted = localStorage.getItem(storageKey);
      const completedDaysList = savedCompleted ? JSON.parse(savedCompleted) : [];
      if (plan?.days) {
        for (let i = 0; i < plan.days.length; i++) {
          if (!completedDaysList.includes(i)) {
            return i; // Start the first uncompleted day!
          }
        }
      }
      
      // 4. Default fallback to 0
      return 0;
    } catch {
      return 0;
    }
  });

  const currentDay = (plan?.days && plan.days[currentDayIdx]) || (plan?.days && plan.days[0]) || null;
  const warmupExercises = currentDay?.warmupExercises || [];
  const exercises = currentDay?.exercises || [];

  const initialSaved = getInitialStateForDay(currentDayIdx);

  const [currentStep, setCurrentStep] = useState(() => {
    if (initialSaved && initialSaved.currentStep) return initialSaved.currentStep;
    return warmupExercises.length > 0 ? 'warmup' : 'exercise';
  });

  const [exerciseIdx, setExerciseIdx] = useState(() => {
    if (initialSaved && initialSaved.exerciseIdx !== undefined) return initialSaved.exerciseIdx;
    return 0;
  });

  const [warmupIdx, setWarmupIdx] = useState(() => {
    if (initialSaved && initialSaved.warmupIdx !== undefined) return initialSaved.warmupIdx;
    return 0;
  });

  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const currentWarmup = warmupExercises[warmupIdx];
  const currentExercise = currentStep === 'warmup' ? currentWarmup : exercises[exerciseIdx];

  const handleStepNextRef = useRef();

  const { restTimer, startTimer, stopTimer, skipTimer, addTime } = useWorkoutTimer(() => handleStepNextRef.current?.());

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

  // Save progress state to localStorage whenever it changes
  useEffect(() => {
    if (!plan?.workoutPlanId) return;
    if (currentStep === 'finished') {
      localStorage.removeItem(`workout_state_${plan.workoutPlanId}_${currentDayIdx}`);
      return;
    }
    const stateToSave = {
      currentStep,
      exerciseIdx,
      warmupIdx
    };
    localStorage.setItem(`workout_state_${plan.workoutPlanId}_${currentDayIdx}`, JSON.stringify(stateToSave));
  }, [currentStep, exerciseIdx, warmupIdx, currentDayIdx, plan?.workoutPlanId]);

  // Loop/reset mechanism: If all days were completed, starting again resets the completion state
  useEffect(() => {
    if (plan?.days && plan?.days.length > 0 && plan?.workoutPlanId) {
      const totalDaysCount = plan.days.length;
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      if (parsed.length >= totalDaysCount) {
        // All days are completed, reset completion list and start from day 0
        localStorage.removeItem(storageKey);
        setCompletedDays([]);
        setCurrentDayIdx(0);
        
        // Also clear any saved active day states to start completely fresh
        for (let i = 0; i < totalDaysCount; i++) {
          localStorage.removeItem(`workout_state_${plan.workoutPlanId}_${i}`);
        }
        
        // Reset step/indices to initial values of Day 0
        const day = plan.days[0];
        const dayWarmups = day?.warmupExercises || [];
        setCurrentStep(dayWarmups.length > 0 ? 'warmup' : 'exercise');
        setExerciseIdx(0);
        setWarmupIdx(0);
      }
    }
  }, [plan, storageKey]);

  // changeDay handler for switching days inside the player safely
  const changeDay = useCallback((idx) => {
    setCurrentDayIdx(idx);
    stopTimer();
    
    // Check if there is saved progress for this new day
    try {
      const saved = localStorage.getItem(`workout_state_${plan?.workoutPlanId}_${idx}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.exerciseIdx !== undefined) setExerciseIdx(parsed.exerciseIdx);
        if (parsed.warmupIdx !== undefined) setWarmupIdx(parsed.warmupIdx);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    
    // Default reset if no saved progress
    const targetDay = plan?.days?.[idx];
    const targetWarmups = targetDay?.warmupExercises || [];
    setCurrentStep(targetWarmups.length > 0 ? 'warmup' : 'exercise');
    setExerciseIdx(0);
    setWarmupIdx(0);
  }, [plan, stopTimer]);

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
    handleStepNext,
    addTime,
    changeDay
  };
};
