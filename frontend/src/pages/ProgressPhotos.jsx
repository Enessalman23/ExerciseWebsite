import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Upload, Loader, Trash2, Calendar } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='14' fill='%2394a3b8'>Resim Bulunamadi</text></svg>";

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [beforePhotoId, setBeforePhotoId] = useState('');
  const [afterPhotoId, setAfterPhotoId] = useState('');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [compareMode, setCompareMode] = useState('slider'); // 'slider' or 'side-by-side'
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const { showToast } = useToast();

  const fetchPhotos = async () => {
    try {
      const response = await axiosClient.get('/api/progress-photos');
      setPhotos(response.data);
      if (response.data && response.data.length >= 2) {
        // Default: before is oldest (last in array), after is newest (first in array)
        setBeforePhotoId(response.data[response.data.length - 1].id.toString());
        setAfterPhotoId(response.data[0].id.toString());
      }
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
      showToast("Yeni gelişim fotoğrafı başarıyla yüklendi! 📸", "success");
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setWeight('');
      setNotes('');
      // Refresh list
      fetchPhotos();
    } catch (error) {
      console.error("Failed to upload photo:", error);
      showToast("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    } finally {
      setUploading(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setPhotoToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    try {
      await axiosClient.delete(`/api/progress-photos/${photoToDelete}`);
      setPhotos(photos.filter(p => p.id !== photoToDelete));
      showToast("Fotoğraf başarıyla silindi.", "success");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      showToast("Fotoğraf silinemedi. Lütfen tekrar deneyin.", "error");
    } finally {
      setShowConfirm(false);
      setPhotoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPhotoToDelete(null);
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

      {/* COMPARISON SLIDER ROW */}
      {photos.length >= 2 && (
        <div className="glass-panel animate-fade-in hover-glow" style={{ padding: '30px', marginBottom: '40px', borderRadius: '24px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)' }}>⚡</span> Değişim Analizi
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                Fotoğrafları karşılaştırmak için sürgüyü veya yan yana görünümü kullanın.
              </p>
            </div>
            
            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
              <button 
                type="button"
                onClick={() => setCompareMode('slider')}
                className="btn"
                style={{ 
                  padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', border: 'none',
                  background: compareMode === 'slider' ? 'var(--primary)' : 'transparent',
                  color: compareMode === 'slider' ? '#fff' : 'var(--text-muted)',
                  fontWeight: compareMode === 'slider' ? 'bold' : 'normal',
                  cursor: 'pointer', transition: 'var(--transition)'
                }}
              >
                Sürgülü (Kaydırıcı)
              </button>
              <button 
                type="button"
                onClick={() => setCompareMode('side-by-side')}
                className="btn"
                style={{ 
                  padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', border: 'none',
                  background: compareMode === 'side-by-side' ? 'var(--primary)' : 'transparent',
                  color: compareMode === 'side-by-side' ? '#fff' : 'var(--text-muted)',
                  fontWeight: compareMode === 'side-by-side' ? 'bold' : 'normal',
                  cursor: 'pointer', transition: 'var(--transition)'
                }}
              >
                Yan Yana (Görsel)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Öncesi (Sol)</label>
                <select 
                  className="input-field" 
                  value={beforePhotoId} 
                  onChange={(e) => setBeforePhotoId(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '160px', borderRadius: '10px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
                >
                  {photos.map(p => (
                    <option key={p.id} value={p.id}>
                      {new Date(p.createdAt).toLocaleDateString('tr-TR')} {p.weightAtTime > 0 ? `(${p.weightAtTime} kg)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Sonrası (Sağ)</label>
                <select 
                  className="input-field" 
                  value={afterPhotoId} 
                  onChange={(e) => setAfterPhotoId(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem', minWidth: '160px', borderRadius: '10px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
                >
                  {photos.map(p => (
                    <option key={p.id} value={p.id}>
                      {new Date(p.createdAt).toLocaleDateString('tr-TR')} {p.weightAtTime > 0 ? `(${p.weightAtTime} kg)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          {/* Render Area based on selected compareMode */}
          {(() => {
            const beforeObj = photos.find(p => p.id.toString() === beforePhotoId);
            const afterObj = photos.find(p => p.id.toString() === afterPhotoId);
            if (!beforeObj || !afterObj) return <p style={{ opacity: 0.5 }}>Lütfen iki farklı fotoğraf seçin.</p>;

            if (compareMode === 'side-by-side') {
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-grid">
                  {/* Before Column */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
                    <div style={{ position: 'relative', height: '420px' }}>
                      <img 
                        src={`http://localhost:8080${beforeObj.photoUrl}`} 
                        alt="Before" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0f172a', display: 'block', borderRadius: '20px' }}
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      />
                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>ÖNCE: {new Date(beforeObj.createdAt).toLocaleDateString('tr-TR')} {beforeObj.weightAtTime > 0 ? `| ${beforeObj.weightAtTime} kg` : ''}</span>
                      </div>
                    </div>
                    {beforeObj.note && (
                      <div style={{ padding: '15px', background: 'var(--surface-color)', borderTop: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{beforeObj.note}</p>
                      </div>
                    )}
                  </div>

                  {/* After Column */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
                    <div style={{ position: 'relative', height: '420px' }}>
                      <img 
                        src={`http://localhost:8080${afterObj.photoUrl}`} 
                        alt="After" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0f172a', display: 'block', borderRadius: '20px' }}
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      />
                      <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>SONRA: {new Date(afterObj.createdAt).toLocaleDateString('tr-TR')} {afterObj.weightAtTime > 0 ? `| ${afterObj.weightAtTime} kg` : ''}</span>
                      </div>
                    </div>
                    {afterObj.note && (
                      <div style={{ padding: '15px', background: 'var(--surface-color)', borderTop: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{afterObj.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Default 'slider' view
            return (
              <>
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '480px', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  userSelect: 'none', 
                  border: '1px solid var(--glass-border)',
                  background: '#0f172a',
                  transform: 'translateZ(0)',
                  isolation: 'isolate'
                }}>
                  {/* Underlay Image: After (Right side) */}
                  <img 
                    src={`http://localhost:8080${afterObj.photoUrl}`} 
                    alt="After" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' }}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                  
                  {/* Overlay Image: Before (Left side, clipped) */}
                  <img 
                    src={`http://localhost:8080${beforeObj.photoUrl}`} 
                    alt="Before" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      borderRadius: '20px',
                      clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
                    }}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />

                  {/* Sliding vertical divider bar */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    bottom: 0, 
                    left: `${sliderPosition}%`, 
                    width: '2px', 
                    background: '#fff', 
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.8)', 
                    zIndex: 10, 
                    pointerEvents: 'none' 
                  }}></div>

                  {/* Draggable circular handle */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: `${sliderPosition}%`, 
                    transform: 'translate(-50%, -50%)', 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: '0 8px 25px var(--primary-glow), 0 0 0 4px rgba(255,255,255,0.2)', 
                    border: '2px solid #fff', 
                    zIndex: 11, 
                    pointerEvents: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '18px' 
                  }}>
                    ↔
                  </div>

                  {/* Text Labels Overlay - Before */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '20px', 
                    background: 'rgba(15, 23, 42, 0.85)', 
                    backdropFilter: 'blur(10px)', 
                    padding: '10px 16px', 
                    borderRadius: '14px', 
                    zIndex: 9, 
                    pointerEvents: 'none', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    maxWidth: '45%'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Öncesi</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      {new Date(beforeObj.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {beforeObj.weightAtTime > 0 && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⚖️ {beforeObj.weightAtTime} kg
                      </span>
                    )}
                    {beforeObj.note && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={beforeObj.note}>
                        📝 {beforeObj.note}
                      </p>
                    )}
                  </div>

                  {/* Text Labels Overlay - After */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    right: '20px', 
                    background: 'rgba(15, 23, 42, 0.85)', 
                    backdropFilter: 'blur(10px)', 
                    padding: '10px 16px', 
                    borderRadius: '14px', 
                    zIndex: 9, 
                    pointerEvents: 'none', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    maxWidth: '45%'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sonrası</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      {new Date(afterObj.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {afterObj.weightAtTime > 0 && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⚖️ {afterObj.weightAtTime} kg
                      </span>
                    )}
                    {afterObj.note && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={afterObj.note}>
                        📝 {afterObj.note}
                      </p>
                    )}
                  </div>

                  {/* Draggable input range overlay */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderPosition} 
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      opacity: 0, 
                      cursor: 'ew-resize', 
                      zIndex: 12 
                    }} 
                  />
                </div>

                {/* Detailed Comparison Footer under the slider */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px', 
                  marginTop: '25px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--glass-border)'
                }}>
                  {/* Before Details */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Öncesi (Sol)</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{new Date(beforeObj.createdAt).toLocaleDateString('tr-TR')}</span>
                      {beforeObj.weightAtTime > 0 && <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)' }}>{beforeObj.weightAtTime} kg</span>}
                    </div>
                    {beforeObj.note ? (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{beforeObj.note}"</p>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.5 }}>Not belirtilmedi.</span>
                    )}
                  </div>

                  {/* After Details */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Sonrası (Sağ)</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{new Date(afterObj.createdAt).toLocaleDateString('tr-TR')}</span>
                      {afterObj.weightAtTime > 0 && <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)' }}>{afterObj.weightAtTime} kg</span>}
                    </div>
                    {afterObj.note ? (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{afterObj.note}"</p>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.5 }}>Not belirtilmedi.</span>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

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
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                
                <div style={{ padding: '15px', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {new Date(photo.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {photo.weightAtTime > 0 && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {photo.weightAtTime} kg
                      </span>
                    )}
                  </div>
                  {photo.note && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, opacity: 0.8 }}>
                      {photo.note.length > 50 ? photo.note.substring(0, 50) + '...' : photo.note}
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => triggerDeleteConfirm(photo.id)}
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

      {/* Custom Confirmation Modal */}
      <ConfirmDialog 
        isOpen={showConfirm}
        title="Fotoğrafı Sil?"
        message="Seçtiğiniz gelişim fotoğrafı sistemden kalıcı olarak silinecektir. Bu işlemi geri alamazsınız!"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Evet, Sil 🗑️"
        cancelText="Vazgeç"
      />
    </div>
  );
};

export default ProgressPhotos;
