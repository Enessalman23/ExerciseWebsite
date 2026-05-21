import { useCallback, useState } from 'react';

/**
 * Custom hook for providing voice guidance using Web Speech API.
 * Supports Turkish language and basic controls.
 */
export const useVoiceGuidance = () => {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text) => {
    if (!synth) return;

    // Cancel any ongoing speech to prioritize the new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.05; // Slightly faster for a punchier cadence
    utterance.pitch = 1.0;

    // Select a premium English voice if available
    const voices = synth.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => { setIsSpeaking(true); };
    utterance.onend = () => { setIsSpeaking(false); };
    utterance.onerror = () => { setIsSpeaking(false); };

    synth.speak(utterance);
  }, [synth]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [synth]);

  return { speak, stop, isSpeaking };
};
