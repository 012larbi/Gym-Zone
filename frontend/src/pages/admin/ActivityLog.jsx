import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity as ActivityIcon, Clock, User, Tag } from 'lucide-react';

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.get('http://localhost:5000/api/admin/activity', config);
      setActivities(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setActivities([]);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Journal d'Activité</h1>
        <p className="font-manrope text-[#b9cacb] mt-1">Suivez tout ce qui se passe sur votre plateforme.</p>
      </div>

      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act._id} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4 group hover:border-[#00f0ff]/30 transition-all">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#00f0ff]">
               <ActivityIcon size={18} />
            </div>
            <div className="flex-grow">
               <p className="font-manrope text-white font-medium">{act.description}</p>
               <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-[#b9cacb] uppercase tracking-wider font-bold">
                    <Tag size={10} /> {act.type}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#b9cacb]/60">
                    <Clock size={10} /> {new Date(act.createdAt).toLocaleString()}
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
