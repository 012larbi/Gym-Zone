import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, Image as ImageIcon, Video, Plus, Trash2, 
  Layout, Dumbbell, DollarSign, Upload, Film, 
  Edit, Check, X, Loader2, Zap, Info, ChevronDown, ChevronUp
} from 'lucide-react';

export default function ContentManager() {
  const [content, setContent] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // Key of item being uploaded

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const [cRes, sRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/content', config),
        axios.get('http://localhost:5000/api/admin/services', config)
      ]);
      setContent(cRes.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr }), {}));
      setServices(sRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateContent = async (key, updates) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const item = content[key] || { key, section: 'general' };
      await axios.post('http://localhost:5000/api/admin/content', { ...item, ...updates }, config);
      fetchData();
    } catch (err) {
      alert('Erreur de mise à jour');
    }
  };

  const handleFileUpload = async (e, key, section) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(key);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.post('http://localhost:5000/api/admin/upload', formData, config);
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      await handleUpdateContent(key, { value: res.data.url, type: mediaType, section, mediaType });
      setUploading(null);
    } catch (err) {
      alert('Erreur d\'upload');
      setUploading(null);
    }
  };

  const handleServiceMediaUpload = async (e, serviceId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(`service-${serviceId}`);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.post('http://localhost:5000/api/admin/upload', formData, config);
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      await axios.put(`http://localhost:5000/api/admin/services/${serviceId}`, { 
        mediaUrl: res.data.url, 
        mediaType 
      }, config);
      fetchData();
      setUploading(null);
    } catch (err) {
      alert('Erreur d\'upload');
      setUploading(null);
    }
  };

  const addService = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    };
    const newService = { title: 'Nouveau Service', description: 'Description...', mediaUrl: 'https://via.placeholder.com/400', mediaType: 'image' };
    await axios.post('http://localhost:5000/api/admin/services', newService, config);
    fetchData();
  };

  const deleteService = async (id) => {
    if (window.confirm('Supprimer ce service ?')) {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      await axios.delete(`http://localhost:5000/api/admin/services/${id}`, config);
      fetchData();
    }
  };

  const MediaPreview = ({ value, type, onUpload, uploadKey }) => (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
      {type === 'video' ? (
        <video src={value} className="w-full h-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <img src={value || 'https://via.placeholder.com/800x450'} className="w-full h-full object-cover" alt="Preview" />
      )}
      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
        <Upload className="text-white mb-2" />
        <span className="text-white text-xs font-bold uppercase">Remplacer Média</span>
        <input type="file" className="hidden" onChange={onUpload} />
      </label>
      {uploading === uploadKey && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-30">
          <Loader2 className="animate-spin text-[#00f0ff]" />
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#00f0ff]" size={40} />
      <p className="font-manrope text-[#b9cacb]">Initialisation du CMS...</p>
    </div>
  );

  return (
    <div className="space-y-12 max-w-6xl pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Système CMS Avancé</h1>
          <p className="font-manrope text-[#b9cacb] mt-1">Contrôle total sur les médias, les textes et les services.</p>
        </div>
      </header>

      {/* --- SECTION ACCUEIL --- */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Layout className="text-[#00f0ff]" size={24} />
          <h2 className="font-grotesk font-bold text-xl text-white uppercase tracking-tight">Page d'Accueil / Hero</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hero Content */}
          <section className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest flex items-center gap-2">
                <Info size={12} /> Titre Principal (Hero)
              </label>
              <textarea 
                className="w-full bg-[#0e141a] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#00f0ff] outline-none transition-all h-24"
                defaultValue={content.hero_title?.value || ''}
                onBlur={(e) => handleUpdateContent('hero_title', { value: e.target.value, section: 'hero' })}
                placeholder="Ex: Force, Discipline, Résultat"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest flex items-center gap-2">
                <Info size={12} /> Description (Hero)
              </label>
              <textarea 
                className="w-full bg-[#0e141a] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#00f0ff] outline-none transition-all h-32"
                defaultValue={content.hero_text?.value || ''}
                onBlur={(e) => handleUpdateContent('hero_text', { value: e.target.value, section: 'hero' })}
                placeholder="Description du club..."
              />
            </div>
          </section>

          {/* Hero Media */}
          <section className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <label className="text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest">Média Principal (Image ou Vidéo)</label>
            <MediaPreview 
              value={content.hero_image?.value} 
              type={content.hero_image?.mediaType} 
              uploadKey="hero_image"
              onUpload={(e) => handleFileUpload(e, 'hero_image', 'hero')}
            />
            <p className="text-[10px] text-[#b9cacb]/60 italic">Conseil : Utilisez une vidéo MP4 pour un effet plus dynamique.</p>
          </section>
        </div>
      </div>

      {/* --- SECTION BENTO FEATURES --- */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Zap className="text-amber-400" size={24} />
          <h2 className="font-grotesk font-bold text-xl text-white uppercase tracking-tight">Arsenal / Features Grid</h2>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase">Titre de la Section</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white"
                defaultValue={content.bento_title?.value || ''}
                onBlur={(e) => handleUpdateContent('bento_title', { value: e.target.value, section: 'features' })}
                placeholder="Ex: L'Arsenal de Gym Zone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#b9cacb] uppercase">Sous-titre / Description</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white"
                defaultValue={content.bento_desc?.value || ''}
                onBlur={(e) => handleUpdateContent('bento_desc', { value: e.target.value, section: 'features' })}
                placeholder="Description courte..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-[#00f0ff] uppercase border-b border-white/10 pb-2">Bloc 1 (Coaching)</h3>
            <MediaPreview 
              value={content.feat1_image?.value} 
              type={content.feat1_image?.mediaType} 
              uploadKey="feat1_image"
              onUpload={(e) => handleFileUpload(e, 'feat1_image', 'features')}
            />
            <div className="space-y-3">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                defaultValue={content.feat1_title?.value || ''}
                onBlur={(e) => handleUpdateContent('feat1_title', { value: e.target.value, section: 'features' })}
              />
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-[#b9cacb] h-20"
                defaultValue={content.feat1_desc?.value || ''}
                onBlur={(e) => handleUpdateContent('feat1_desc', { value: e.target.value, section: 'features' })}
              />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-[#7701d0] uppercase border-b border-white/10 pb-2">Bloc 2 (Nutrition)</h3>
            <MediaPreview 
              value={content.feat2_image?.value} 
              type={content.feat2_image?.mediaType} 
              uploadKey="feat2_image"
              onUpload={(e) => handleFileUpload(e, 'feat2_image', 'features')}
            />
            <div className="space-y-3">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                defaultValue={content.feat2_title?.value || ''}
                onBlur={(e) => handleUpdateContent('feat2_title', { value: e.target.value, section: 'features' })}
              />
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-[#b9cacb] h-20"
                defaultValue={content.feat2_desc?.value || ''}
                onBlur={(e) => handleUpdateContent('feat2_desc', { value: e.target.value, section: 'features' })}
              />
            </div>
          </div>

          {/* Feature 3 (New) */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase border-b border-white/10 pb-2">Bloc 3 (Equipement)</h3>
            <div className="space-y-3">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                defaultValue={content.feat3_title?.value || ''}
                onBlur={(e) => handleUpdateContent('feat3_title', { value: e.target.value, section: 'features' })}
              />
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-[#b9cacb] h-20"
                defaultValue={content.feat3_desc?.value || ''}
                onBlur={(e) => handleUpdateContent('feat3_desc', { value: e.target.value, section: 'features' })}
              />
            </div>
          </div>

          {/* Home Extra Media */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-b border-white/10 pb-2 text-center">Média Final (Bento Grid)</h3>
            <MediaPreview 
              value={content.home_extra_image?.value} 
              type={content.home_extra_image?.mediaType} 
              uploadKey="home_extra_image"
              onUpload={(e) => handleFileUpload(e, 'home_extra_image', 'features')}
            />
          </div>
        </div>
      </div>

      {/* --- SECTION SERVICES --- */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-[#00dbe9]" size={24} />
            <h2 className="font-grotesk font-bold text-xl text-white uppercase tracking-tight">Nos Services (Catalogue)</h2>
          </div>
          <button 
            onClick={addService}
            className="bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#00f0ff]/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> AJOUTER UN SERVICE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div key={svc._id} className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col group relative">
              <div className="aspect-video relative overflow-hidden bg-black">
                {svc.mediaType === 'video' ? (
                  <video src={svc.mediaUrl} className="w-full h-full object-cover" muted loop playsInline onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
                ) : (
                  <img src={svc.mediaUrl} className="w-full h-full object-cover" alt={svc.title} />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                  <label className="p-3 bg-[#00f0ff] text-[#006970] rounded-full cursor-pointer hover:scale-110 transition-transform">
                    <Upload size={20} />
                    <input type="file" className="hidden" onChange={(e) => handleServiceMediaUpload(e, svc._id)} />
                  </label>
                  <button 
                    onClick={() => deleteService(svc._id)}
                    className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                {uploading === `service-${svc._id}` && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <Loader2 className="animate-spin text-[#00f0ff]" />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <input 
                  className="bg-transparent border-none text-white font-grotesk font-bold text-lg w-full outline-none focus:text-[#00f0ff] transition-colors"
                  defaultValue={svc.title}
                  onBlur={(e) => axios.put(`http://localhost:5000/api/admin/services/${svc._id}`, { title: e.target.value }, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })}
                />
                <textarea 
                  className="bg-transparent border-none text-[#b9cacb] font-manrope text-sm w-full outline-none h-20 resize-none"
                  defaultValue={svc.description}
                  onBlur={(e) => axios.put(`http://localhost:5000/api/admin/services/${svc._id}`, { description: e.target.value }, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION GLOBALE --- */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <DollarSign className="text-emerald-400" size={24} />
          <h2 className="font-grotesk font-bold text-xl text-white uppercase tracking-tight">Tarifs & Boutons</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prices */}
          <section className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-[#b9cacb] uppercase mb-4">Prix des Abonnements (MAD)</h3>
            <div className="space-y-2 mb-6">
              <label className="text-[10px] text-[#b9cacb]/60 uppercase">Description Page Abonnements</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00f0ff] outline-none h-20"
                defaultValue={content.plan_desc_global?.value || ''}
                onBlur={(e) => handleUpdateContent('plan_desc_global', { value: e.target.value, section: 'plans' })}
              />
            </div>
            {['basic', 'pro', 'elite'].map(plan => (
              <div key={plan} className="flex items-center justify-between group">
                <span className="text-sm text-white uppercase font-bold">{plan}</span>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-28 text-right focus:border-[#00f0ff] outline-none"
                    defaultValue={content[`plan_${plan}_price`]?.value || ''}
                    onBlur={(e) => handleUpdateContent(`plan_${plan}_price`, { value: e.target.value, section: 'plans' })}
                  />
                  <span className="text-xs text-[#b9cacb]/40">MAD</span>
                </div>
              </div>
            ))}
          </section>

          {/* Buttons */}
          <section className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-[#b9cacb] uppercase mb-4">Labels des Boutons</h3>
            {[
              { key: 'btn_register', label: 'Inscription' },
              { key: 'btn_discover', label: 'Découvrir' },
            ].map(btn => (
              <div key={btn.key} className="space-y-2">
                <label className="text-[10px] text-[#b9cacb]/60 uppercase">{btn.label}</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-emerald-400 outline-none"
                  defaultValue={content[btn.key]?.value || ''}
                  onBlur={(e) => handleUpdateContent(btn.key, { value: e.target.value, section: 'global' })}
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
