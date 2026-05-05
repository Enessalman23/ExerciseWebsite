import { useState, useEffect, useRef, useCallback } from 'react';

export const useWorkoutTimer = (onTimerComplete) => {
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const onCompleteRef = useRef(onTimerComplete);

  useEffect(() => {
    onCompleteRef.current = onTimerComplete;
  }, [onTimerComplete]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer > 0]); // Only re-run when activity state changes

  // Separate effect to handle completion to avoid race conditions
  useEffect(() => {
    if (isTimerActive && restTimer === 0) {
      setIsTimerActive(false);
      if (onCompleteRef.current) onCompleteRef.current();
    }
  }, [isTimerActive, restTimer]);

  const startTimer = useCallback((seconds) => {
    const validSeconds = Math.max(1, seconds || 60);
    setRestTimer(validSeconds);
    setIsTimerActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    setRestTimer(0);
  }, []);

  const skipTimer = useCallback(() => {
    setIsTimerActive(false);
    setRestTimer(0);
    // Directly trigger completion to ensure it's responsive
    if (onCompleteRef.current) onCompleteRef.current();
  }, []);

  return { restTimer, isTimerActive, startTimer, stopTimer, skipTimer };
};
