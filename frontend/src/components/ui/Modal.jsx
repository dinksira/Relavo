import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen, onClose, title, subtitle,
  children, size = 'md', footer
}) => {
  const maxWidths = { sm: 400, md: 520, lg: 720, xl: 960 };
  const mw = maxWidths[size] || 520;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: mw,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          animation: 'modalIn 150ms ease',
        }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* Header */}
        <div style={{ padding: '24px 24px 0', position: 'relative' }}>
          {title && <p style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</p>}
          {subtitle && <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: '4px 0 0' }}>{subtitle}</p>}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '0 24px 24px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: 16,
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
