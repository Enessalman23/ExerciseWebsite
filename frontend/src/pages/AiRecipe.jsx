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
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <ChefHat size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>AI Şef</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Elindeki malzemeleri yaz, hedeflerine uygun sağlıklı bir tarif oluşturalım.
        </p>
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
