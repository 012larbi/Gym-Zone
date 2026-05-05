import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, CreditCard, Activity, TrendingUp, ArrowUpRight, 
  ShieldCheck, Package, Clock, AlertCircle, Loader2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        };
        const [dashboardRes, activityRes, distributionRes] = await Promise.all([
          axios.get('http://localhost:5000/api/stats/dashboard', config),
          axios.get('http://localhost:5000/api/admin/activity', config),
          axios.get('http://localhost:5000/api/stats/plan-distribution', config)
        ]);
        
        setStats({
          users: dashboardRes.data.users || 0,
          subscriptions: dashboardRes.data.subscriptions || 0,
          services: dashboardRes.data.services || 0,
          revenue: dashboardRes.data.revenue || 0,
          growth: Array.isArray(dashboardRes.data.growth) ? dashboardRes.data.growth : [], // Note: Growth might still be in admin/stats if needed
          distribution: Array.isArray(distributionRes.data) ? distributionRes.data : []
        });
        setActivities(Array.isArray(activityRes.data) ? activityRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur MongoDB.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-[#00f0ff] animate-spin" size={48} />
      <p className="text-[#b9cacb] font-manrope animate-pulse">Extraction des données réelles...</p>
    </div>
  );

  if (error) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="text-rose-500" size={48} />
      <h2 className="text-white text-xl font-bold font-grotesk">{error}</h2>
      <button onClick={() => window.location.reload()} className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-white hover:bg-white/10 transition-all">Réessayer</button>
    </div>
  );

  const statCards = [
    { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Abonnements', value: stats.subscriptions, icon: CreditCard, color: 'text-[#00f0ff]', bg: 'bg-[#00f0ff]/10' },
    { label: 'Revenu Total', value: `${stats.revenue} MAD`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'ARPU', value: `${stats.arpu} MAD`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const COLORS = ['#00f0ff', '#10b981', '#f43f5e'];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="font-manrope text-[#b9cacb] mt-1">Données 100% réelles provenant de MongoDB.</p>
        </div>
        {stats.pendingSubscriptions > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="text-amber-500" size={18} />
            <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">{stats.pendingSubscriptions} Abonnements en attente</span>
          </div>
        )}
      </div>

      {/* Grid des Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 relative group hover:border-[#00f0ff]/30 transition-all duration-500">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="font-manrope text-sm font-medium text-[#b9cacb]">{stat.label}</p>
            <h3 className="font-grotesk text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graphique de Croissance */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-grotesk font-semibold text-lg text-white mb-6">Croissance Utilisateurs (7 derniers jours)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.growth}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e141a', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
          <h3 className="font-grotesk font-semibold text-lg text-white mb-6">Distribution des Plans</h3>
          <div className="flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.distribution || [
                    { name: 'Basic', value: 1 },
                    { name: 'Pro', value: 1 },
                    { name: 'Elite', value: 1 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats.distribution || [0,1,2]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#00f0ff', '#7701d0', '#fbbf24'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f26', border: '1px solid rgba(0,240,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             {(stats.distribution || []).map((plan, i) => (
               <div key={plan.name} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${['bg-[#00f0ff]', 'bg-[#7701d0]', 'bg-[#fbbf24]'][i % 3]}`} />
                  <span className="text-[10px] font-bold text-[#b9cacb] uppercase">{plan.name}: {plan.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Dernières Activités */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-grotesk font-semibold text-lg text-white mb-6">Journal d'Activité Récent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.length > 0 ? activities.slice(0, 6).map((act, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium line-clamp-1">{act.description}</p>
                  <p className="text-[10px] text-[#b9cacb] mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#b9cacb] text-sm italic">Aucune donnée d'activité.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
