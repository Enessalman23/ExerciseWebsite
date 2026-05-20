import { useCallback, useRef } from 'react';

/**
 * Custom hook for providing voice guidance using Web Speech API.
 * Supports Turkish language and basic controls.
 */
export const useVoiceGuidance = () => {
  const synth = window.speechSynthesis;
  const isSpeakingRef = useRef(false);

  const speak = useCallback((text) => {
    if (!synth) return;

    // Cancel any ongoing speech to prioritize the new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => { isSpeakingRef.current = true; };
    utterance.onend = () => { isSpeakingRef.current = false; };
    utterance.onerror = () => { isSpeakingRef.current = false; };

    synth.speak(utterance);
  }, [synth]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
    }
  }, [synth]);

  return { speak, stop, isSpeaking: isSpeakingRef.current };
};
