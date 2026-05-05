import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [content, setContent] = useState({});
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/content');
        const data = res.data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch content');
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSend = async () => {
    // Validation de base
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setMsg('Tous les champs sont requis.');
      return;
    }

    setStatus('loading');

    // Préparation des paramètres pour EmailJS (incluant la date)
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      time: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      // Stockage dans MongoDB
      await axios.post('http://localhost:5000/api/admin/messages', {
        name: form.name,
        email: form.email,
        message: form.message
      });

      // Envoi Email
      await emailjs.send(
        'service_69lwo3t', 
        'template_vbnzcug',
        templateParams,
        'FeQPe9QTmtkgB8_kK'
      );

      setStatus('success');
      setMsg('Message envoyé avec succès !');
      setForm({ name: '', email: '', message: '' }); // Reset du formulaire

    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus('error');
      setMsg("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e141a] text-[#dde3ec]">
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="font-grotesk text-[clamp(48px,7vw,72px)] leading-[1.1] tracking-[-0.02em] font-bold text-[#00dbe9] mb-4 neon-text-glow">
              {content.contact_title || "Contactez Gym Zone"}
            </h1>
            <p className="font-manrope text-lg text-[#b9cacb] max-w-2xl mx-auto">
              {content.contact_desc || "Prêt à repousser vos limites ? Laissez-nous un message et notre équipe de performance vous recontactera dans les plus brefs délais."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00dbe9]/10 rounded-full blur-3xl pointer-events-none" />
                <h2 className="font-grotesk font-bold text-[clamp(28px,4vw,40px)] text-[#dde3ec] mb-8">Envoyer un Message</h2>

                {/* Notifications Status */}
                {status === 'success' && (
                  <div className="mb-6 bg-[#00f0ff]/10 border border-[#00f0ff]/50 rounded-lg px-4 py-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00f0ff]">check_circle</span>
                    <p className="font-manrope text-sm text-[#00f0ff]">{msg}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg px-4 py-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-400">error</span>
                    <p className="font-manrope text-sm text-red-400">{msg}</p>
                  </div>
                )}

                <div className="space-y-6 relative z-10">
                  <div className="relative">
                    <label className="block font-grotesk text-xs font-bold tracking-[0.1em] text-[#b9cacb] mb-2 uppercase">Nom Complet</label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-[#849495] text-[#dde3ec] font-manrope text-base py-3 focus:outline-none focus:border-[#00dbe9] transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="relative">
                    <label className="block font-grotesk text-xs font-bold tracking-[0.1em] text-[#b9cacb] mb-2 uppercase">Adresse Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-[#849495] text-[#dde3ec] font-manrope text-base py-3 focus:outline-none focus:border-[#00dbe9] transition-colors"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div className="relative">
                    <label className="block font-grotesk text-xs font-bold tracking-[0.1em] text-[#b9cacb] mb-2 uppercase">Votre Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-transparent border-0 border-b border-[#849495] text-[#dde3ec] font-manrope text-base py-3 focus:outline-none focus:border-[#00dbe9] transition-colors resize-none"
                      placeholder="Décrivez votre objectif..."
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={status === 'loading'}
                    className="w-full bg-[#00dbe9] text-[#002022] font-grotesk font-semibold py-4 rounded-lg mt-4 hover:bg-[#7df4ff] transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le Message
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Info + Map Section */}
            <div className="lg:col-span-5 space-y-4 flex flex-col">
              {[
                { icon: 'location_on', label: 'Localisation', content: content.contact_address || 'Bernoussi\nCasablanca, Maroc' },
                { icon: 'call', label: 'Téléphone', content: content.contact_phone || '+212 5 22 33 44 55' },
                { icon: 'mail', label: 'Email Direct', content: content.gym_email || 'Gym@zone.ma' },
              ].map((item) => (
                <div key={item.label} className="glass-panel rounded-xl p-6 flex items-start gap-4 hover:border-[#00dbe9]/50 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#1a2027] flex items-center justify-center text-[#00dbe9] group-hover:shadow-[0_0_15px_rgba(0,219,233,0.4)] transition-all flex-shrink-0">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-grotesk text-xs font-bold tracking-[0.1em] text-[#b9cacb] mb-1 uppercase">{item.label}</h3>
                    <p className="font-manrope text-base text-[#dde3ec] whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}

              {/* Google Maps Iframe */}
              <div className="flex-grow glass-panel rounded-xl overflow-hidden min-h-[250px] relative">
                <iframe
                  title="Gym Zone Location"
                  src="https://www.google.com/maps?q=Sidi+Bernoussi+Casablanca&output=embed"
                  className="absolute inset-0 w-full h-full border-0 opacity-70 grayscale contrast-125 invert-[0.8]"
                ></iframe>
                <div className="absolute inset-0 bg-[#0e141a]/20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}