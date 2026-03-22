import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuickLogButton from '../ui/QuickLogButton';
import QuickLogModal from '../clients/QuickLogModal';
import { useState } from 'react';

const DashboardLayout = ({ children, title }) => {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title={title} />
        <main style={{
          flex: 1, overflowY: 'auto',
          background: '#f8fafc',
          padding: 32,
        }}>
          {children}
        </main>
      </div>

      <QuickLogButton onClick={() => setQuickLogOpen(true)} />
      <QuickLogModal 
        isOpen={quickLogOpen} 
        onClose={() => setQuickLogOpen(false)} 
        onSuccess={() => window.location.reload()} // Global refresh for simplicity, or we can use event bus
      />
    </div>
  );
};

export default DashboardLayout;
