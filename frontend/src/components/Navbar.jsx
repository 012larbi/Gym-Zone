import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/abonnements', label: 'Abonnements' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-950/40 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] font-grotesk tracking-tight">
          Gym Zone
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 font-grotesk tracking-tight">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`transition-all hover:bg-white/5 hover:text-cyan-300 px-2 py-1 ${
                location.pathname === l.to
                  ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          to="/inscription"
          className="hidden md:flex items-center justify-center bg-cyan-400 text-slate-950 font-bold px-6 py-2 rounded font-grotesk tracking-tight hover:bg-cyan-300 transition-colors neon-glow-primary"
        >
          Inscription
        </Link>

        {/* Mobile burger */}
        <button className="md:hidden text-cyan-400" onClick={() => setOpen(!open)}>
          <span className="material-symbols-outlined icon-fill">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-4 font-grotesk">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`transition-all py-2 px-3 rounded-md ${
                location.pathname === l.to ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/inscription"
            onClick={() => setOpen(false)}
            className="bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded text-center hover:bg-cyan-300 transition-colors"
          >
            Inscription
          </Link>
        </div>
      )}
    </nav>
  );
}
