import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Trash2, Search, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.get('http://localhost:5000/api/admin/users', config);
      console.log('Users Data:', res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('API Error Details:', err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message;
      setError(`Erreur MongoDB: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#00f0ff]" size={40} />
      <p className="font-manrope text-[#b9cacb] animate-pulse">Chargement des données réelles depuis MongoDB...</p>
    </div>
  );

  if (error) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-center px-6">
      <AlertCircle className="text-rose-500" size={48} />
      <h2 className="text-white text-xl font-bold font-grotesk">{error}</h2>
      <button onClick={fetchUsers} className="mt-4 px-6 py-2 bg-[#00f0ff] text-[#006970] rounded-lg font-bold uppercase text-xs">Réessayer</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Gestion des Utilisateurs</h1>
          <p className="font-manrope text-[#b9cacb] mt-1 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live MongoDB Database: {users.length} membres trouvés
          </p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9cacb]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-manrope outline-none focus:border-[#00f0ff]/50 focus:bg-white/[0.08] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold text-[#b9cacb] uppercase tracking-widest border-b border-white/10">
              <th className="px-8 py-5">Membre</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5">Loyauté</th>
              <th className="px-8 py-5">Inscrit le</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#7701d0]/20 flex items-center justify-center text-[#00f0ff] border border-[#00f0ff]/20 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <span className="font-grotesk font-bold text-lg text-white uppercase tracking-tight">{u.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-[#b9cacb] group-hover:text-white transition-colors">
                      <Mail size={14} className="text-[#00f0ff]" /> {u.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#b9cacb]/60">
                      <Phone size={14} /> {u.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    u.loyalty === 'Gold' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' :
                    u.loyalty === 'Silver' ? 'bg-slate-300/10 border-slate-300/20 text-slate-300' :
                    'bg-orange-600/10 border-orange-600/20 text-orange-600'
                  }`}>
                    <ShieldCheck size={10} />
                    {u.loyalty || 'Bronze'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sm text-[#b9cacb]">
                    <Calendar size={16} className="text-[#7701d0]" /> {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => deleteUser(u._id)}
                    className="text-rose-400/50 hover:text-rose-400 p-3 rounded-xl hover:bg-rose-400/10 transition-all border border-transparent hover:border-rose-400/20"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-24 text-[#b9cacb] font-manrope bg-white/[0.01]">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Aucun utilisateur ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
