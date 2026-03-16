import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  FileText, 
  Settings,
  LogOut
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-relavo-border flex flex-col fixed h-full">
        <div className="p-6">
          <Logo className="h-8" />
        </div>

        <nav className="flex-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-3 transition-all duration-150
                ${isActive 
                  ? 'bg-relavo-blueLight text-relavo-blue border-l-[3px] border-relavo-blue' 
                  : 'text-relavo-text-secondary hover:bg-relavo-surface hover:text-relavo-text-primary border-l-[3px] border-transparent'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium text-[15px]">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-relavo-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-relavo-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-relavo-blue flex items-center justify-center font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-relavo-text-primary truncate">John Doe</p>
              <p className="text-xs text-relavo-text-muted truncate">john@agency.co</p>
            </div>
            <button className="text-relavo-text-muted hover:text-relavo-danger transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] bg-relavo-surface min-h-screen overflow-auto">
        <div className="p-10 max-w-[1240px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
