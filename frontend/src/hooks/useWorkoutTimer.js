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
    if (isTimerActive) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsTimerActive(false);
              if (onCompleteRef.current) onCompleteRef.current();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

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

  const addTime = useCallback((seconds) => {
    setRestTimer(prev => prev + seconds);
  }, []);

  return { restTimer, isTimerActive, startTimer, stopTimer, skipTimer, addTime };
};
