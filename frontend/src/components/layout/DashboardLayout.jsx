import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuickLogButton from '../ui/QuickLogButton';
import QuickLogModal from '../clients/QuickLogModal';
import { useState } from 'react';

const DashboardLayout = ({ children, title }) => {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[240px] overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-[28px_32px] min-h-screen">
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
