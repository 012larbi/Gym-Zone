import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, User, Clock, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react';

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      const res = await axios.get('http://localhost:5000/api/admin/messages', config);
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      };
      await axios.put(`http://localhost:5000/api/admin/messages/${id}`, {}, config);
      fetchMessages();
    } catch (err) {
      alert('Erreur');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#00f0ff]" /></div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-grotesk text-3xl font-bold text-white tracking-tight">Messages Clients</h1>
        <p className="font-manrope text-[#b9cacb] mt-1">Gérez les demandes de contact stockées dans MongoDB.</p>
      </header>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="glass-card p-20 text-center rounded-2xl border border-white/5">
            <MessageSquare className="mx-auto text-white/20 mb-4" size={48} />
            <p className="text-[#b9cacb]">Aucun message pour le moment.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`glass-card p-6 rounded-2xl border transition-all ${
                msg.status === 'unread' ? 'border-[#00f0ff]/30 bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.05)]' : 'border-white/5 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-white font-bold font-grotesk">
                      <User size={16} className="text-[#00f0ff]" />
                      {msg.name}
                    </div>
                    <div className="flex items-center gap-2 text-[#b9cacb] text-sm font-manrope">
                      <Mail size={16} />
                      {msg.email}
                    </div>
                    <div className="flex items-center gap-2 text-[#b9cacb] text-xs font-manrope">
                      <Clock size={16} />
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-white/90 font-manrope leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 italic">
                    "{msg.message}"
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  {msg.status === 'unread' && (
                    <button 
                      onClick={() => markAsRead(msg._id)}
                      className="bg-[#00f0ff]/10 text-[#00f0ff] p-3 rounded-xl hover:bg-[#00f0ff]/20 transition-all border border-[#00f0ff]/20"
                      title="Marquer comme lu"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
