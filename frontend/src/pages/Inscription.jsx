import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { GoogleLogin } from '@react-oauth/google';

const API_BASE = 'http://localhost:5000/api';

export default function Inscription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [content, setContent] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'Pro');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl) setSelectedPlan(planFromUrl);
  }, [searchParams]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setStatus('error');
      setMessage('Le nom et l\'email sont requis.');
      return;
    }
    setStatus('loading');
    try {
      await axios.post(`${API_BASE}/register`, { ...form, selectedPlan });
      setStatus('success');
      setMessage('Inscription réussie! Bienvenue chez Gym Zone.');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    }
  };

  const plans = [
    { id: 'Basic', label: 'Basic', desc: "L'essentiel de la force.", color: 'text-[#dde3ec]', checkedBorder: 'border-[#00f0ff]', checkedShadow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]' },
    { id: 'Pro', label: 'Pro', desc: 'Performance optimale.', color: 'text-[#dbfcff]', checkedBorder: 'border-[#00f0ff]', checkedShadow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]' },
    { id: 'Elite', label: 'Élite', desc: 'Accès total & coaching.', color: 'text-[#efdbff]', checkedBorder: 'border-[#7701d0]', checkedShadow: 'shadow-[0_0_15px_rgba(119,1,208,0.3)]' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0e141a] text-[#dde3ec]">
      <main className="flex-grow relative flex items-center justify-center pt-24 pb-16 min-h-screen">
        {/* Background image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            alt="Gym Background"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
            src={content.register_bg || "https://lh3.googleusercontent.com/aida-public/AB6AXuCsEPR2wlSKkjsLOCmZholXbDORY2i3aDFi6GJVN2CTRw9GRl9L4YEJ_B__cBsLatLkd6NRaYQiq0uHpj5UrUBJHwMhluhh1_E5pAr6WLQV0TRAEIcshA3wLw_MRBzNXrob6PaGTrrlEh_OUyapRy3gs4_qmnESvs9QTjJ_RuCNxsBgqfm0e-6v-mvDu2WVREQsflvH_bWaWVvCkCLsmFle0vogdQWppfIeYrW9SU7h2ae3pZROmfhH3mx6f52rw3Wzo6LLv6bgN56v"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e141a]/90 via-[#0e141a]/60 to-[#0e141a]" />
        </div>

        {/* Form */}
        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <div className="bg-[#0e141a]/30 backdrop-blur-[24px] rounded-xl border border-[#00f0ff]/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] p-6 flex flex-col gap-6 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#00f0ff]/20 to-[#7701d0]/10 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

            <div className="text-center flex flex-col gap-2">
              <h1 className="font-grotesk font-bold text-[clamp(28px,4vw,40px)] text-[#dbfcff] drop-shadow-[0_0_8px_rgba(219,252,255,0.5)]">
                {content.register_title || "Rejoignez Gym Zone"}
              </h1>
              <p className="font-manrope text-base text-[#b9cacb]">{content.register_desc || "La performance absolue commence ici."}</p>
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/50 rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="material-symbols-outlined icon-fill text-[#00f0ff]">check_circle</span>
                <p className="font-manrope text-sm text-[#00f0ff]">{message}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="material-symbols-outlined icon-fill text-red-400">error</span>
                <p className="font-manrope text-sm text-red-400">{message}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Nom */}
              <div className="flex flex-col gap-1 relative">
                <label className="font-grotesk text-xs font-bold tracking-[0.1em] text-[#dde3ec] uppercase pl-1">Nom Complet</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  className="w-full bg-[#2f353c]/50 border-0 border-b-2 border-[#3b494b] text-[#dde3ec] px-4 py-3 focus:border-[#00f0ff] transition-all duration-300 placeholder-[#b9cacb]/50 font-manrope text-base outline-none bg-transparent"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 relative">
                <label className="font-grotesk text-xs font-bold tracking-[0.1em] text-[#dde3ec] uppercase pl-1">Adresse Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                  className="w-full bg-[#2f353c]/50 border-0 border-b-2 border-[#3b494b] text-[#dde3ec] px-4 py-3 focus:border-[#00f0ff] transition-all duration-300 placeholder-[#b9cacb]/50 font-manrope text-base outline-none bg-transparent"
                />
              </div>

              {/* Téléphone */}
              <div className="flex flex-col gap-1 relative">
                <label className="font-grotesk text-xs font-bold tracking-[0.1em] text-[#dde3ec] uppercase pl-1">Téléphone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+212 600 000 000"
                  className="w-full bg-[#2f353c]/50 border-0 border-b-2 border-[#3b494b] text-[#dde3ec] px-4 py-3 focus:border-[#00f0ff] transition-all duration-300 placeholder-[#b9cacb]/50 font-manrope text-base outline-none bg-transparent"
                />
              </div>

              {/* Plan Selection */}
              <div className="flex flex-col gap-2 pt-4">
                <label className="font-grotesk text-xs font-bold tracking-[0.1em] text-[#dde3ec] uppercase pl-1">Sélection du Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3 rounded-lg border transition-all flex flex-col gap-1 ${
                        selectedPlan === plan.id
                          ? `${plan.checkedBorder} bg-[#2f353c] ${plan.checkedShadow}`
                          : 'border-[#3b494b] bg-[#1a2027] hover:bg-[#252a31]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-grotesk font-semibold text-base ${plan.color}`}>{plan.label}</span>
                        {selectedPlan === plan.id && (
                          <span className="material-symbols-outlined icon-fill text-[#00f0ff]" style={{ fontSize: '16px' }}>radio_button_checked</span>
                        )}
                      </div>
                      <span className="font-manrope text-xs text-[#b9cacb] text-left leading-tight">{plan.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || status === 'success'}
                className="mt-4 w-full py-4 bg-[#00f0ff] text-[#006970] font-grotesk text-xs font-bold tracking-widest uppercase rounded hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:bg-[#7df4ff] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Traitement...
                  </>
                ) : (
                  <>
                    Confirmer L'Inscription
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </>
                )}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#1a2027] px-4 text-[#b9cacb]/40 font-manrope">Ou s'inscrire avec</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (response) => {
                    try {
                      setStatus('loading');
                      const res = await axios.post(`${API_BASE}/auth/google`, { credential: response.credential });
                      setStatus('success');
                      setMessage('Bienvenue! Connexion réussie.');
                      setTimeout(() => navigate('/'), 2000);
                    } catch (err) {
                      setStatus('error');
                      setMessage('Erreur Google Auth');
                    }
                  }}
                  onError={() => {
                    setStatus('error');
                    setMessage('Échec Google Login');
                  }}
                  theme="filled_black"
                  shape="pill"
                  text="signup_with"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
