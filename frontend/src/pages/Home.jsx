import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import Footer from '../components/Footer';

export default function Home() {
  const [content, setContent] = useState({});
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/api/admin/content')
      .then(res => {
        if (cancelled) return;
        // Reduce to a map once — no re-computation on re-renders
        const data = res.data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          acc[`${curr.key}_type`] = curr.mediaType;
          return acc;
        }, {});
        setContent(data);
      })
      .catch(() => { }); // Silently fall back to defaults
    return () => { cancelled = true; };
  }, []); // Runs once

  const handleCardClick = useCallback((cardId) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 300);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e141a] text-[#dde3ec]">
      <main className="flex-grow pt-[88px] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow -z-10 pointer-events-none" />

        {/* Hero Section */}
        <section className="relative px-6 py-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-h-[819px]">
          <div className="lg:col-span-6 flex flex-col space-y-8 z-10 relative">
            <h1 className="font-grotesk text-[clamp(48px,7vw,72px)] leading-[1.1] tracking-[-0.02em] font-bold text-white whitespace-pre-line">
              {content.hero_title || 'Force, Discipline, Résultat'}
            </h1>
            <p className="font-manrope text-lg leading-relaxed text-[#b9cacb] max-w-lg">
              {content.hero_text || "Gym Zone de la performance au Maroc. Entrez dans une nouvelle ère de l'entraînement physique où la technologie de pointe rencontre la détermination brute."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/inscription" className="bg-[#00f0ff] text-[#006970] font-grotesk font-semibold text-xl px-8 py-4 rounded neon-glow-primary flex items-center justify-center gap-2 hover:bg-[#7df4ff] transition-colors">
                {content.btn_register || 'Rejoignez-nous'}
                <span className="material-symbols-outlined icon-fill">arrow_forward</span>
              </Link>
              <Link to="/services" className="glass-card text-white font-grotesk font-semibold text-xl px-8 py-4 rounded hover:bg-white/5 transition-colors border border-[#00f0ff]/30">
                {content.btn_discover || 'Découvrir'}
              </Link>
            </div>
          </div>

          {/* Hero Image avec bordure neon */}
          <div className="lg:col-span-6 relative h-[600px] w-full mt-8 lg:mt-0 rounded-xl overflow-hidden glass-card group">
            {/* Bordure neon animée */}
            <div className="absolute inset-0 rounded-xl border-2 border-[#00f0ff]/30 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-500 z-10 pointer-events-none" />
            
            {/* Bordure extérieure glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)' }} />
            
            {content.hero_image_type === 'video' ? (
              <video src={content.hero_image} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 group-hover:mix-blend-normal transition-all duration-700" autoPlay muted loop playsInline />
            ) : (
              <img
                alt="Gym Hero"
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 group-hover:mix-blend-normal transition-all duration-700" 
                src={content.hero_image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'}
                loading="eager" // Hero image — load immediately
              />
            )}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-grotesk text-[clamp(28px,5vw,40px)] font-bold leading-[1.2] tracking-[-0.01em] text-white mb-4">
              {content.bento_title || "L'Arsenal de Gym Zone"}
            </h2>
            <p className="font-manrope text-base leading-relaxed text-[#b9cacb] max-w-2xl mx-auto">
              {content.bento_desc || 'Des équipements de pointe couplés à une expertise technique inégalée pour sculpter votre plein potentiel.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Card 1 - Coaching */}
            <div
              onClick={() => handleCardClick('coaching')}
              className={`glass-card rounded-xl md:col-span-8 flex flex-col relative overflow-hidden min-h-[400px] border-t-2 border-t-[#00f0ff]/30 group cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,209,241,1)] hover:border-t-[rgba(0,209,241,1)] ${activeCard === 'coaching' ? 'scale-95 shadow-[0_0_30px_rgba(0,209,241,1)]' : ''}`}
            >
              <div className="absolute inset-0 w-full h-full">
                {content.feat1_image_type === 'video' ? (
                  <video src={content.feat1_image} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500" autoPlay muted loop playsInline />
                ) : (
                  <img src={content.feat1_image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'} alt="Coaching" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e141a] via-[#0e141a]/60 to-transparent" />
              </div>
              <div className="relative z-10 mt-auto p-8">
                <div className="w-12 h-12 rounded-full bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] mb-4 border border-[#00f0ff]/50 group-hover:bg-[#00f0ff]/30 transition-all duration-300">
                  <span className="material-symbols-outlined icon-fill">psychology</span>
                </div>
                <h3 className="font-grotesk font-semibold text-2xl text-white mb-2 group-hover:text-[#00f0ff] transition-colors duration-300">{content.feat1_title || 'Coaching Stratégique'}</h3>
                <p className="font-manrope text-base text-[#b9cacb] group-hover:text-white transition-colors duration-300">{content.feat1_desc || "Des protocoles d'entraînement basés sur la data biométrique pour une progression millimétrée."}</p>
              </div>
            </div>

            {/* Card 2 - Nutrition */}
            <div
              onClick={() => handleCardClick('nutrition')}
              className={`glass-card rounded-xl md:col-span-4 flex flex-col relative overflow-hidden min-h-[400px] border-t-2 border-t-[#7701d0]/50 group cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(119,1,208,1)] hover:border-t-[rgba(119,1,208,1)] ${activeCard === 'nutrition' ? 'scale-95 shadow-[0_0_30px_rgba(119,1,208,1)]' : ''}`}
            >
              <div className="absolute inset-0 w-full h-full">
                {content.feat2_image_type === 'video' ? (
                  <video src={content.feat2_image} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500" autoPlay muted loop playsInline />
                ) : (
                  <img src={content.feat2_image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop'} alt="Nutrition" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e141a] via-[#0e141a]/60 to-transparent" />
              </div>
              <div className="relative z-10 mt-auto p-8">
                <div className="w-12 h-12 rounded-full bg-[#7701d0]/20 flex items-center justify-center text-[#efdbff] mb-4 border border-[#7701d0]/50 group-hover:bg-[#7701d0]/40 transition-all duration-300">
                  <span className="material-symbols-outlined icon-fill">restaurant_menu</span>
                </div>
                <h3 className="font-grotesk font-semibold text-2xl text-white mb-2 group-hover:text-[#efdbff] transition-colors duration-300">{content.feat2_title || 'Nutrition Précise'}</h3>
                <p className="font-manrope text-base text-[#b9cacb] group-hover:text-white transition-colors duration-300">{content.feat2_desc || "Plans alimentaires calculés pour maximiser l'hypertrophie et la récupération."}</p>
              </div>
            </div>

            {/* Card 3 - Équipement Pro-Level (avec hover et clic) */}
            <div
              onClick={() => handleCardClick('equipement')}
              className={`md:col-span-12 glass-card rounded-xl relative overflow-hidden min-h-[300px] border-t-2 border-t-[#00f0ff]/30 group cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,209,241,1)] hover:border-t-[rgba(0,209,241,1)] ${activeCard === 'equipement' ? 'scale-95 shadow-[0_0_30px_rgba(0,209,241,1)]' : ''}`}
            >
              <div className="absolute inset-0 w-full h-full">
                {content.home_extra_image_type === 'video' ? (
                  <video src={content.home_extra_image} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" autoPlay muted loop playsInline />
                ) : (
                  <img
                    src={content.home_extra_image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                    alt="Equipment"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e141a] via-[#0e141a]/80 to-transparent" />
              </div>
              <div className="relative z-10 p-8 max-w-2xl">
                <div className="w-12 h-12 rounded-full bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] mb-4 border border-[#00f0ff]/50 group-hover:bg-[#00f0ff]/30 transition-all duration-300">
                  <span className="material-symbols-outlined icon-fill">fitness_center</span>
                </div>
                <h3 className="font-grotesk font-semibold text-2xl text-white mb-2 group-hover:text-[#00f0ff] transition-colors duration-300">
                  {content.feat3_title || 'Équipement Pro-Level'}
                </h3>
                <p className="font-manrope text-base text-[#b9cacb] group-hover:text-white transition-colors duration-300">
                  {content.feat3_desc || 'Accès exclusif à des machines biomécaniques de dernière génération.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}