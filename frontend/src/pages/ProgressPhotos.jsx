import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Upload, Loader, Trash2, Calendar } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const fetchPhotos = async () => {
    try {
      const response = await axiosClient.get('/api/progress-photos');
      setPhotos(response.data);
    } catch (error) {
      console.error("Failed to fetch progress photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (weight) formData.append('weight', weight);
    if (notes) formData.append('notes', notes);

    try {
      await axiosClient.post('/api/progress-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setWeight('');
      setNotes('');
      // Refresh list
      fetchPhotos();
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;
    try {
      await axiosClient.delete(`/api/progress-photos/${id}`);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader className="spin" size={40} color="var(--primary)" />
      </div>
    );
  }

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
          backgroundImage: 'url("https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3
        }}></div>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)'
        }}></div>

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
            <Camera size={32} color="var(--primary)" />
          </div>
          
          <h1 className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-1px' }}>
            Gelişim <span className="text-glow-primary" style={{ color: 'var(--primary)' }}>Fotoğrafları</span>
          </h1>
          
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', marginTop: '15px' }}>
            Fiziksel değişimini görsel olarak takip et. Emeklerinin karşılığını kendi gözlerinle gör.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }} className="responsive-grid">
        
        {/* Yükleme Formu */}
        <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="var(--primary)" /> Yeni Fotoğraf Yükle
          </h2>
          
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div 
              style={{ 
                border: '2px dashed var(--border-color)', borderRadius: '15px', padding: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden', background: 'var(--surface-hover)'
              }}
              onClick={() => document.getElementById('photo-upload').click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }} />
              ) : (
                <>
                  <ImageIcon size={40} color="var(--text-muted)" />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tıkla ve resim seç</span>
                </>
              )}
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Kilo (kg) (Opsiyonel)</label>
              <input 
                type="number" 
                step="0.1" 
                className="input-field" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Örn: 75.5"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Notlar (Opsiyonel)</label>
              <textarea 
                className="input-field" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Diyete başladığım ilk hafta..."
                style={{ width: '100%', resize: 'vertical' }}
                rows={3}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!selectedFile || uploading}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}
            >
              {uploading ? <Loader className="spin" size={18} /> : <Upload size={18} />}
              {uploading ? 'Yükleniyor...' : 'Fotoğrafı Kaydet'}
            </button>
          </form>
        </div>

        {/* Fotoğraf Galerisi */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {photos.map(photo => (
              <div key={photo.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={`http://localhost:8080${photo.photoUrl}`} 
                  alt="Progress" 
                  style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/250x250?text=Resim+Bulunamadı'; }}
                />
                
                <div style={{ padding: '15px', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {new Date(photo.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {photo.weight && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {photo.weight} kg
                      </span>
                    )}
                  </div>
                  {photo.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, opacity: 0.8 }}>
                      {photo.notes.length > 50 ? photo.notes.substring(0, 50) + '...' : photo.notes}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => handleDelete(photo.id)}
                  style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    background: 'rgba(239, 68, 68, 0.9)', border: 'none', borderRadius: '8px', 
                    padding: '8px', cursor: 'pointer', color: '#fff',
                    backdropFilter: 'blur(4px)'
                  }}
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 0.5 }}>
              <Camera size={60} style={{ margin: '0 auto 20px' }} />
              <h3>Henüz fotoğraf yok</h3>
              <p>Gelişimini takip etmek için ilk fotoğrafını yükle!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProgressPhotos;
