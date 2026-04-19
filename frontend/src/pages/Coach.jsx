import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { Send, User, Bot, Loader2, MessageSquare, Info, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Coach = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Merhaba! Ben Antigravity AI Antrenörün. Bugün sana antrenman veya beslenme konusunda nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

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
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch (err) {
      console.error(err);
      showToast("Bir hata oluştu. Lütfen tekrar dene.", "error");
      setMessages(prev => [...prev, { role: 'assistant', text: "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen internetini kontrol et veya az sonra tekrar dene." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px', maxWidth: '1000px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '15px', color: '#fff' }}>
          <MessageSquare size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>AI Antrenör</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Her an yanında olan profesyonel fitness koçun.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0' }}>
        
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`animate-fade-in`}
              style={{ 
                display: 'flex', 
                gap: '15px', 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: msg.role === 'user' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: msg.role === 'user' ? 'var(--secondary)' : 'var(--primary)',
                  flexShrink: 0
                }}
              >
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div 
                style={{ 
                  maxWidth: '70%', 
                  padding: '16px 20px', 
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user' ? 'var(--secondary)' : 'var(--surface-hover)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                  boxShadow: msg.role === 'user' ? '0 4px 15px var(--secondary-glow)' : 'none',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Bot size={20} />
              </div>
              <div style={{ background: 'var(--surface-hover)', padding: '12px 20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <Loader2 size={24} className="animate-spin" color="var(--primary)" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '30px', borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
          <form 
            onSubmit={handleSend}
            style={{ 
              display: 'flex', 
              gap: '15px', 
              background: 'var(--bg-color)', 
              padding: '8px', 
              borderRadius: '18px',
              border: '1px solid var(--border-color)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Antrenmanınla ilgili bir soru sor..."
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                padding: '0 15px',
                fontSize: '1rem',
                color: 'var(--text-main)',
                outline: 'none'
              }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="btn btn-primary"
              style={{ width: '50px', height: '50px', padding: 0, borderRadius: '14px' }}
            >
              <Send size={20} />
            </button>
          </form>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px', justifyContent: 'center' }}>
             <button 
              onClick={() => setInput('Bugün bacak çalıştım, nasıl esnemeliyim?')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
             >
                <Sparkles size={14} /> Bacak esneme?
             </button>
             <button 
              onClick={() => setInput('Akşam yemeği için proteinli tarif verir misin?')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
             >
                <Sparkles size={14} /> Yemek tarifi?
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;
