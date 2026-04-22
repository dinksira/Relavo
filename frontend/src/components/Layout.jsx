import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  FileText, 
  Settings,
  LogOut,
  Sparkles,
  Search,
  ChevronDown,
  HelpCircle,
  Plus
} from 'lucide-react';
import Logo from './Logo';
import TeamPresence from './team/TeamPresence';
import useTeamStore from '../store/teamStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: Bell, label: 'Alerts', path: '/alerts', badge: 3 },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Layout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path === '/clients') return 'Directory';
    if (path === '/alerts') return 'Signals';
    if (path === '/invoices') return 'Financials';
    if (path === '/settings') return 'System';
    if (path.startsWith('/clients/')) return 'Client Details';
    return '';
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-blue/10">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-border-dark flex flex-col fixed h-full bg-white z-40">
        <div className="p-10 pt-12 shrink-0">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto pb-10">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-navy text-white shadow-xl shadow-navy/20 translate-x-1' 
                  : 'text-text-2 hover:bg-slate-50 hover:text-navy'}
              `}
            >
              <item.icon size={20} className={`${isActive ? 'text-blue' : 'group-hover:text-blue'} transition-colors duration-300`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-white shadow-lg">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="px-6 mb-8 shrink-0">
           <div className="bg-gradient-to-br from-blue to-blueDark p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden group border border-white/10">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Sparkles size={100} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Relavo Pro</p>
              <h5 className="text-sm font-black mb-4 leading-tight">AI Scoring <br /> Unleashed.</h5>
              <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all">
                 Upgrade Plan
              </button>
           </div>
        </div>

        <div className="p-8 border-t border-border-dark bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-navy border shadow-sm flex items-center justify-center font-black text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-navy truncate">John Doe</p>
              <p className="text-[10px] text-text-3 font-bold uppercase truncate">Agency Owner</p>
            </div>
            <button className="p-2 rounded-xl text-slate-300 hover:text-relavo-danger hover:bg-red-50 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-24 px-12 border-b border-border-dark sticky top-0 bg-white/30 backdrop-blur-xl z-30 flex items-center justify-between">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <span className="text-xs font-black text-text-3 uppercase tracking-widest opacity-40">System</span>
                 <span className="text-border-dark">/</span>
                 <h2 className="text-sm font-black text-navy uppercase tracking-[0.2em]">{getPageTitle()}</h2>
              </div>
              
              <div className="relative group hidden xl:block">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-blue transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Global AI Search..." 
                   className="w-[340px] pl-14 pr-6 py-2.5 bg-slate-50 border border-border-dark rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue/10 transition-all"
                 />
              </div>

              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50/50 rounded-full border border-green-100/50">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none pt-0.5">AI Engine Live</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              {/* Team Presence Avatars */}
              <TeamPresence compact />

              <button className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-navy/20 transition-all active:scale-95">
                 <Plus size={14} /> Quick Entry
              </button>
              
              <div className="h-6 w-[1px] bg-slate-100"></div>

              <div className="flex items-center gap-3">
                 <button className="p-3 text-text-3 hover:text-blue transition-all" title="Help & Support">
                    <HelpCircle size={18} />
                 </button>
                 <button className="p-3 bg-slate-50 border border-border-dark rounded-xl text-text-3 hover:text-blue hover:bg-white hover:shadow-lg transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue rounded-full ring-2 ring-white"></span>
                 </button>
              </div>
              
              <div className="h-10 w-[1px] bg-slate-100 mx-1"></div>
              
              <div className="flex items-center gap-4 cursor-pointer group">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-navy uppercase tracking-widest">Agency Space</p>
                    <p className="text-[9px] text-text-3 font-bold uppercase">Personal Pro</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform shadow-lg">
                    R
                 </div>
                 <ChevronDown size={14} className="text-text-3 group-hover:text-navy transition-colors" />
              </div>
           </div>
        </header>

        {/* Content Wrapper */}
        <main className="p-12 pb-32 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
