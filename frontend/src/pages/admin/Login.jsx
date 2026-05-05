import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

import { GoogleLogin } from '@react-oauth/google';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { credential: response.credential });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin');
      } else {
        setError("Accès refusé. Ce compte Google n'est pas administrateur.");
      }
    } catch (err) {
      setError('Erreur lors de la connexion Google.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin');
      } else {
        setError("Accès refusé. Vous n'êtes pas administrateur.");
      }
    } catch (err) {
      setError('Identifiants invalides ou erreur serveur.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e141a] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#7701d0] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="font-grotesk text-3xl font-bold text-white">Administration</h1>
          <p className="font-manrope text-[#b9cacb] mt-2">Connectez-vous pour gérer Gym Zone</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-2xl space-y-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm text-center font-manrope">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#b9cacb] mb-2 font-manrope">Email Professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]/50" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#00f0ff] outline-none transition-all font-manrope"
                  placeholder="admin@gymzone.ma"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#b9cacb] mb-2 font-manrope">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]/50" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#00f0ff] outline-none transition-all font-manrope"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#00f0ff] text-[#006970] font-grotesk font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              SE CONNECTER
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0e141a] px-4 text-[#b9cacb]/40 font-manrope">Ou continuer avec</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Échec de la connexion Google')}
              theme="filled_black"
              shape="pill"
              text="signin_with"
            />
          </div>
        </div>

        <p className="text-center mt-8 text-[#b9cacb]/40 text-xs font-manrope">
          &copy; 2026 GYM ZONE. ACCÈS RESTREINT.
        </p>
      </div>
    </div>
  );
}
