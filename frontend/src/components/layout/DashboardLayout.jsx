import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children, title }) => (
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
  </div>
);

export default DashboardLayout;
