import { useState, useEffect, useRef, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

export const useCoachChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Merhaba! Ben AI Antrenörün. Bugün sana antrenman veya beslenme konusunda nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'tr-TR';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    
    // Try to find a Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(voice => voice.lang.includes('tr'));
    if (trVoice) {
      utterance.voice = trVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await axiosClient.post('/api/ai/coach', { message: userMsg });
      const reply = res.data.response;
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      speak(reply);
    } catch (err) {
      console.error(err);
      showToast("Bir hata oluştu. Lütfen tekrar dene.", "error");
      setMessages(prev => [...prev, { role: 'assistant', text: "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen internetini kontrol et veya az sonra tekrar dene." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, speak, showToast]);

  const resetChat = useCallback(() => {
    setMessages([{ role: 'assistant', text: 'Merhaba! Ben AI Antrenörün. Bugün sana nasıl yardımcı olabilirim?' }]);
  }, []);

  const handleVoiceToggle = useCallback(() => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (!newState && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    voiceEnabled,
    messagesEndRef,
    toggleListening,
    handleSend,
    resetChat,
    handleVoiceToggle
  };
};
