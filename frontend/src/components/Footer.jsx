import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Footer() {
  const [content, setContent] = useState({});

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

  return (
    <footer className="bg-slate-950 w-full py-12 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        <div className="col-span-1 md:col-span-2">
          <div className="text-xl font-bold text-white font-grotesk mb-4">Gym Zone</div>
          <p className="text-slate-500 font-grotesk text-sm">
            {content.footer_desc || "© 2026 Gym Zone. Gym Zone de la performance au Maroc."}
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="font-grotesk text-white text-sm font-bold uppercase tracking-wider mb-4">Réseaux</h4>
          <div className="flex flex-col space-y-2 font-grotesk text-sm">
            {['Facebook', 'Instagram', 'LinkedIn', 'WhatsApp'].map((r) => (
              <a key={r} href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                {r}
              </a>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h4 className="font-grotesk text-white text-sm font-bold uppercase tracking-wider mb-4">Navigation</h4>
          <div className="flex flex-col space-y-2 font-grotesk text-sm">
            <Link to="/" className="text-slate-500 hover:text-cyan-400 transition-colors">Accueil</Link>
            <Link to="/services" className="text-slate-500 hover:text-cyan-400 transition-colors">Services</Link>
            <Link to="/abonnements" className="text-slate-500 hover:text-cyan-400 transition-colors">Abonnements</Link>
            <Link to="/contact" className="text-slate-500 hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
