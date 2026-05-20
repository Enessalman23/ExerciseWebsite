import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { Send, User, Bot, Loader2, MessageSquare, Info, Sparkles, Mic, Volume2, VolumeX, Target, Activity } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Coach = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Merhaba! Ben AI Antrenörün. Bugün sana antrenman veya beslenme konusunda nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px', maxWidth: '1100px', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="premium-shadow" style={{ background: 'var(--primary)', padding: '12px', borderRadius: '18px', color: '#fff', boxShadow: '0 8px 20px var(--primary-glow)' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-glow" style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900 }}>AI Coach</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Çevrimiçi & Hazır</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
           <button onClick={() => setMessages([{ role: 'assistant', text: 'Merhaba! Ben AI Antrenörün. Bugün sana nasıl yardımcı olabilirim?' }])} className="btn-secondary" style={{ padding: '10px 18px', borderRadius: '14px', fontSize: '0.85rem' }}>Sohbeti Sıfırla</button>
        </div>
      </header>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
        
        {/* Messages Area */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className="animate-slide-up"
              style={{ 
                display: 'flex', 
                gap: '16px', 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div className="premium-shadow"
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '14px', 
                  background: msg.role === 'user' ? 'var(--secondary)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: msg.role === 'user' ? '0 10px 20px rgba(14, 165, 233, 0.2)' : '0 10px 20px rgba(79, 70, 229, 0.2)'
                }}
              >
                {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
              </div>
              
              <div 
                style={{ 
                  maxWidth: '75%', 
                  padding: '18px 24px', 
                  borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, var(--secondary), #0ea5e9)' : 'var(--surface-color)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none',
                  backdropFilter: msg.role === 'assistant' ? 'blur(10px)' : 'none',
                  boxShadow: msg.role === 'user' ? '0 15px 30px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="animate-fade-in" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
               <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Bot size={22} />
              </div>
              <div className="animate-shimmer" style={{ 
                width: '180px', 
                height: '60px', 
                borderRadius: '24px 24px 24px 4px', 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                gap: '8px',
                background: 'var(--surface-color)'
              }}>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--glass-border)', borderLeftColor: 'var(--primary)' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Düşünüyor...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '30px 40px', background: 'var(--bg-color)', borderTop: '1px solid var(--glass-border)' }}>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
             <button onClick={() => setInput('Bugün ne çalışmalıyım?')} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--primary)" /> Antrenman Önerisi
             </button>
             <button onClick={() => setInput('Kilo vermek için 3 ipucu verir misin?')} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} color="var(--secondary)" /> Yağ Yakımı
             </button>
             <button onClick={() => setInput('Evde ekipmansız ne yapabilirim?')} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} color="#10b981" /> Ekipmansız Antrenman
             </button>
          </div>

          <form 
            onSubmit={handleSend}
            style={{ 
              display: 'flex', 
              gap: '12px', 
              background: 'var(--surface-hover)', 
              padding: '10px', 
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              alignItems: 'center'
            }}
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı buraya yazın..."
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                padding: '0 15px',
                fontSize: '1.05rem',
                color: 'var(--text-main)',
                outline: 'none'
              }}
              disabled={isLoading}
            />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={toggleListening}
                className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                style={{ width: '46px', height: '46px', padding: 0, borderRadius: '16px', background: isListening ? 'var(--error)' : 'var(--surface-color)', border: 'none' }}
              >
                <Mic size={20} color={isListening ? 'white' : 'var(--text-muted)'} />
              </button>

              <button 
                type="button" 
                onClick={() => {
                  const newState = !voiceEnabled;
                  setVoiceEnabled(newState);
                  if (!newState && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="btn-secondary"
                style={{ width: '46px', height: '46px', padding: 0, borderRadius: '16px', background: 'var(--surface-color)', border: 'none' }}
              >
                {voiceEnabled ? <Volume2 size={20} color="var(--primary)" /> : <VolumeX size={20} color="var(--text-muted)" />}
              </button>

              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="btn btn-primary"
                style={{ width: '46px', height: '46px', padding: 0, borderRadius: '16px', boxShadow: '0 8px 15px var(--primary-glow)' }}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Coach;
