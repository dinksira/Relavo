import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  FileText, 
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Clients', path: '/dashboard' },
  { icon: Bell, label: 'Alerts', path: '/alerts', badge: 3 },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white selection:bg-relavo-blue/10">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-relavo-border flex flex-col fixed h-full bg-white z-40">
        <div className="p-10 pt-12">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-relavo-navy text-white shadow-xl shadow-relavo-navy/20 translate-x-1' 
                  : 'text-relavo-text-secondary hover:bg-slate-50 hover:text-relavo-navy'}
              `}
            >
              <item.icon size={20} className={`${isActive ? 'text-relavo-blue' : 'group-hover:text-relavo-blue'} transition-colors duration-300`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-relavo-blue text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-white shadow-lg">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card / Premium Indicator */}
        <div className="px-6 mb-8">
           <div className="bg-gradient-to-br from-relavo-blue to-relavo-blueDark p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Sparkles size={100} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Relavo Pro</p>
              <h5 className="text-sm font-black mb-4 leading-tight">AI Scoring <br /> Unleashed.</h5>
              <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-relavo-navy transition-all">
                 Upgrade Plan
              </button>
           </div>
        </div>

        <div className="p-8 border-t border-relavo-border bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-relavo-navy border shadow-sm flex items-center justify-center font-black text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-relavo-navy truncate">John Doe</p>
              <p className="text-[10px] text-relavo-text-muted font-bold uppercase truncate">Agency Owner</p>
            </div>
            <button className="p-2 rounded-xl text-slate-300 hover:text-relavo-danger hover:bg-red-50 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[280px] bg-white min-h-screen">
        <div className="p-12 pb-32 max-w-[1400px] mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
