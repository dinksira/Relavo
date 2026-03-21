import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, subtitle, action, actionLabel }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '48px 24px', textAlign: 'center',
  }}>
    {Icon && <Icon size={48} color="#94a3b8" style={{ marginBottom: 16 }} />}
    <p style={{ fontSize: 16, fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>{title}</p>
    {subtitle && (
      <p style={{ fontSize: 14, color: '#64748b', maxWidth: 320, lineHeight: 1.5 }}>{subtitle}</p>
    )}
    {action && actionLabel && (
      <div style={{ marginTop: 20 }}>
        <Button variant="primary" onClick={action}>{actionLabel}</Button>
      </div>
    )}
  </div>
);

export default EmptyState;
