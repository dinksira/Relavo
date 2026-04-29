import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuickLogButton from '../ui/QuickLogButton';
import QuickLogModal from '../clients/QuickLogModal';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Auto-scroll to top on navigation
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Always Visible, Mobile Drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[50] lg:z-auto
        transition-all duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-[280px] lg:w-[80px]' : 'w-[280px] lg:w-[260px]'}
      `}>
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 z-[40]">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border-none bg-transparent"
              >
                 <Menu size={20} />
              </button>
              <span className="font-bold text-[18px] tracking-tight text-slate-900">relavo</span>
           </div>
           <div className="flex items-center gap-3">
             <TopBar isMobile />
           </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
           <TopBar title={title} />
        </div>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>

      <QuickLogButton onClick={() => setQuickLogOpen(true)} />
      <QuickLogModal 
        isOpen={quickLogOpen} 
        onClose={() => setQuickLogOpen(false)} 
        onSuccess={(payload) => {
          window.dispatchEvent(new CustomEvent('relavo:quicklog:success', { detail: payload || {} }));
        }} 
      />
    </div>
  );
};

export default DashboardLayout;
