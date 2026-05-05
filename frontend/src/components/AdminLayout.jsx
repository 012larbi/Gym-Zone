import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/admin/subscriptions', icon: CreditCard, label: 'Abonnements' },
  { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/admin/activity', icon: TrendingUp, label: 'Activités' },
  { path: '/admin/content', icon: FileText, label: 'Contenu Site' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0e141a] text-[#dde3ec]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#00f0ff]/10 bg-[#0e141a]/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-[#00f0ff]/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00f0ff] to-[#7701d0] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              GZ
            </div>
            <span className="font-grotesk font-bold text-xl tracking-tight text-white">GYM ZONE</span>
          </Link>
          <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-[#00f0ff]/5 rounded-full border border-[#00f0ff]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-[10px] font-bold text-[#00f0ff] tracking-[0.1em]">ADMIN MODE</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                  : 'text-[#b9cacb] hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={location.pathname === item.path ? 'text-[#00f0ff]' : 'text-[#b9cacb] group-hover:text-white'} />
              <span className="font-manrope font-medium">{item.label}</span>
              {location.pathname === item.path && <ChevronRight size={16} className="ml-auto opacity-50" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-manrope font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
