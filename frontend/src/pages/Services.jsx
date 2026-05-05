import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
  const [content, setContent] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/content'),
          axios.get('http://localhost:5000/api/admin/services')
        ]);
        
        const contentData = Array.isArray(cRes.data) ? cRes.data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {}) : {};
        
        setContent(contentData);
        setServices(Array.isArray(sRes.data) ? sRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0e141a] text-[#dde3ec]">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-grotesk text-[clamp(48px,7vw,72px)] leading-[1.1] tracking-[-0.02em] font-bold text-white mb-4">
              {content.svc_header_title || "Services de Performance"}
            </h1>
            <p className="font-manrope text-lg text-[#b9cacb] max-w-2xl mx-auto">
              Découvrez notre arsenal complet conçu pour sculpter votre potentiel et dépasser vos limites physiques.
            </p>
          </div>

          {/* Dynamic Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="glass-panel group rounded-2xl overflow-hidden border border-white/5 hover:border-[#00f0ff]/40 transition-all duration-500"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {service.mediaType === 'video' ? (
                    <video 
                      src={service.mediaUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      autoPlay muted loop playsInline 
                    />
                  ) : (
                    <img 
                      src={service.mediaUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={service.title} 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e141a] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff]">
                      <span className="material-symbols-outlined">{service.icon || 'fitness_center'}</span>
                    </div>
                    <h3 className="font-grotesk text-2xl font-bold text-white uppercase tracking-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="font-manrope text-base text-[#b9cacb] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-24 glass-panel rounded-2xl border border-white/5">
              <p className="text-[#b9cacb] font-manrope">Aucun service disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
