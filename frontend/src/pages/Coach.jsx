import React from 'react';
import { Send, User, Bot, Sparkles, Mic, Volume2, VolumeX, Target, Activity, ChefHat } from 'lucide-react';
import { useCoachChat } from '../hooks/useCoachChat';
import ReactMarkdown from 'react-markdown';


const Coach = () => {
  const {
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
  } = useCoachChat();

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
           <button onClick={resetChat} className="btn-secondary" style={{ padding: '10px 18px', borderRadius: '14px', fontSize: '0.85rem' }}>Sohbeti Sıfırla</button>
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
                  boxShadow: msg.role === 'user' ? '0 15px 30px rgba(0,0,0,0.2)' : 'none',
                  whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal'
                }}
              >
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
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
             <button onClick={() => setInput('Elimde şunlar var: [Malzemelerinizi yazınız] - Bana sağlıklı ve lezzetli bir tarif önerir misin?')} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChefHat size={14} color="#f59e0b" /> AI Şef (Tarif Önerisi)
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
                onClick={handleVoiceToggle}
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
