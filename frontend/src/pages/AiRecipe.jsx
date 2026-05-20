import React, { useState } from 'react';
import { Utensils, Loader, ChefHat, Sparkles } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ReactMarkdown from 'react-markdown';

const AiRecipe = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe('');
    try {
      const response = await axiosClient.post('/api/ai/recipe', { ingredients });
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      setRecipe('Tarif oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1000px' }}>
      {/* HERO SECTION */}
      <header className="premium-glass-dark premium-shadow" style={{ 
        position: 'relative', overflow: 'hidden', borderRadius: '30px', padding: '50px 40px', marginBottom: '50px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        {/* Background Image inside Hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2,
          backgroundImage: 'url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3
        }}></div>
        {/* Gradient Overlay for better text contrast */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)'
        }}></div>

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
            <ChefHat size={32} color="var(--primary)" />
          </div>
          
          <h1 className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-1px' }}>
            Yapay Zeka <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Şef</span>
          </h1>
          
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', marginTop: '15px' }}>
            Elindeki malzemeleri yaz, hedeflerine uygun sağlıklı ve lezzetli bir tarif oluşturalım.
          </p>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
              Malzemeler veya Yemek Fikri
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Örn: 2 yumurta, yulaf, süt ve biraz muz var. Spor sonrası için ne yapabilirim?"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !ingredients.trim()}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '16px' }}
          >
            {loading ? <Loader className="spin" size={20} /> : <Sparkles size={20} />}
            {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
          </button>
        </form>
      </div>

      {recipe && (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', background: 'var(--surface-color)', borderTop: '4px solid var(--primary)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Utensils size={28} color="var(--primary)" /> Tarifin Hazır
          </h2>
          <div className="markdown-content" style={{ lineHeight: '1.8' }}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRecipe;
