import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Package, Clock, CheckCircle, XCircle, Search, Loader2, AlertCircle } from 'lucide-react';

export default function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.get('http://localhost:5000/api/admin/subscriptions', config);
      console.log('Subscriptions Data:', res.data);
      setSubscriptions(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message;
      setError(`Erreur MongoDB: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      await axios.put(`http://localhost:5000/api/admin/subscriptions/${id}`, { status: newStatus }, config);
      setSubscriptions(subscriptions.map(s => s._id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredSubs = subscriptions.filter(s => 
    s.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#00f0ff]" size={40} />
      <p className="font-manrope text-[#b9cacb] animate-pulse">Extraction des abonnements de MongoDB...</p>
    </div>
  );

  if (error) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-center px-6">
      <AlertCircle className="text-rose-500" size={48} />
      <h2 className="text-white text-xl font-bold font-grotesk">{error}</h2>
      <button onClick={fetchSubscriptions} className="mt-4 px-6 py-2 bg-[#00f0ff] text-[#006970] rounded-lg font-bold">Réessayer</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Suivi des Abonnements</h1>
          <p className="font-manrope text-[#b9cacb] mt-1 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live MongoDB Status: {subscriptions.length} contrats actifs
          </p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par membre ou plan..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-manrope outline-none focus:border-[#00f0ff]/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest border-b border-white/10">
              <th className="px-8 py-5">Utilisateur</th>
              <th className="px-8 py-5">Plan</th>
              <th className="px-8 py-5">Statut</th>
              <th className="px-8 py-5">Validité</th>
              <th className="px-8 py-5">Expiration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubs.map((s) => (
              <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                   <div className="font-grotesk font-bold text-white uppercase tracking-tight">{s.userName}</div>
                   <div className="text-[10px] text-[#b9cacb] font-manrope mt-0.5">{s.userEmail}</div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold ${
                    s.plan === 'Elite' ? 'bg-[#7701d0]/10 border-[#7701d0]/30 text-[#efdbff]' :
                    s.plan === 'Pro' ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]' :
                    'bg-white/10 border-white/20 text-white'
                  }`}>
                    <Package size={14} />
                    {s.plan}
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-wrap gap-2">
                     <button 
                       onClick={() => updateStatus(s._id, 'active')}
                       className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all ${
                       s.status === 'active' 
                       ? 'bg-emerald-500 text-white border-emerald-500' 
                       : 'bg-transparent text-[#b9cacb] border-white/10 hover:border-emerald-500/50'
                     }`}>
                       Active
                     </button>
                     <button 
                       onClick={() => updateStatus(s._id, 'pending')}
                       className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all ${
                       s.status === 'pending' 
                       ? 'bg-amber-500 text-white border-amber-500' 
                       : 'bg-transparent text-[#b9cacb] border-white/10 hover:border-amber-500/50'
                     }`}>
                       Pending
                     </button>
                     <button 
                       onClick={() => updateStatus(s._id, 'cancelled')}
                       className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all ${
                       s.status === 'cancelled' 
                       ? 'bg-rose-500 text-white border-rose-500' 
                       : 'bg-transparent text-[#b9cacb] border-white/10 hover:border-rose-500/50'
                     }`}>
                       Cancelled
                     </button>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2 text-xs text-[#b9cacb]">
                     <Clock size={12} className="text-[#00f0ff]" /> {new Date(s.startDate).toLocaleDateString()}
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className={`flex items-center gap-2 text-xs font-bold ${
                     new Date(s.endDate) < new Date() ? 'text-rose-400' : 'text-amber-400'
                   }`}>
                     <Clock size={12} /> {new Date(s.endDate).toLocaleDateString()}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubs.length === 0 && (
          <div className="text-center py-24 text-[#b9cacb] font-manrope bg-white/[0.01]">
             <CreditCard size={40} className="mx-auto mb-4 opacity-20" />
             <p>Aucun abonnement enregistré en base de données.</p>
          </div>
        )}
      </div>
    </div>
  );
}
