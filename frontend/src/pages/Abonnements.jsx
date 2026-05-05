import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Abonnements = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const defaultPlans = [
    { name: 'Basic', key: 'plan_basic_price', defaultPrice: '300', icon: 'bolt', color: 'text-white' },
    { name: 'Pro', key: 'plan_pro_price', defaultPrice: '500', icon: 'workspace_premium', color: 'text-[#00f0ff]', highlight: true },
    { name: 'Elite', key: 'plan_elite_price', defaultPrice: '900', icon: 'shield_with_heart', color: 'text-[#7701d0]' },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/content');
        const data = res.data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          acc[`${curr.key}_type`] = curr.mediaType;
          return acc;
        }, {});
        setContent(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch content');
        setLoading(false);
      }
    };
    fetchContent();
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
              Plans d'<span className="text-[#00f0ff]">Abonnement</span>
            </h1>
            <p className="font-manrope text-lg text-[#b9cacb] max-w-2xl mx-auto">
              {content.plan_desc_global || "Choisissez l'infrastructure qui correspond à vos ambitions. Pas d'engagement caché, juste des résultats bruts."}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {defaultPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`glass-panel p-8 rounded-2xl border flex flex-col items-center text-center relative group transition-all duration-500 ${
                  plan.highlight ? 'border-[#00f0ff]/50 scale-105 bg-white/[0.03]' : 'border-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 bg-[#00f0ff] text-[#006970] px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase">
                    Plus Populaire
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${plan.color} mb-6`}>
                  <span className="material-symbols-outlined text-4xl">{plan.icon}</span>
                </div>

                <h3 className="font-grotesk text-2xl font-bold text-white mb-2">{plan.name}</h3>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-grotesk text-5xl font-bold text-white">
                    {content[plan.key] || plan.defaultPrice}
                  </span>
                  <span className="text-[#b9cacb] font-manrope text-sm font-bold">MAD/MOIS</span>
                </div>

                <ul className="space-y-4 mb-10 w-full">
                   {['Accès 24/7', 'Vestiaire Privé', 'Espace Musculation', 'Application Mobile'].map((feat, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-[#b9cacb] font-manrope justify-center">
                        <span className="material-symbols-outlined text-[#00f0ff] text-base">check_circle</span>
                        {feat}
                     </li>
                   ))}
                </ul>

                <Link
                  to={`/inscription?plan=${plan.name}`}
                  className={`w-full py-4 rounded-xl font-grotesk font-bold text-sm tracking-[0.1em] uppercase transition-all ${
                    plan.highlight 
                    ? 'bg-[#00f0ff] text-[#006970] shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  S'inscrire
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Abonnements;
