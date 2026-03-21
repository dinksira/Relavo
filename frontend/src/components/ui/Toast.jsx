import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useToastStore from '../../store/toastStore';

const iconMap = {
  success: { Icon: CheckCircle, color: '#16a34a' },
  error:   { Icon: XCircle,     color: '#dc2626' },
  info:    { Icon: Info,        color: '#3b82f6' },
  warning: { Icon: AlertTriangle, color: '#d97706' },
};

const ToastItem = ({ id, message, variant = 'info' }) => {
  const [visible, setVisible] = useState(false);
  const removeToast = useToastStore(s => s.removeToast);
  const { Icon, color } = iconMap[variant] || iconMap.info;

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '12px 16px',
      minWidth: 280, maxWidth: 380,
      marginBottom: 8,
      transform: visible ? 'translateX(0)' : 'translateX(120%)',
      opacity: visible ? 1 : 0,
      transition: 'all 250ms ease',
    }}>
      <Icon size={18} color={color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 500, flex: 1 }}>{message}</span>
      <button
        onClick={() => removeToast(id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const Toast = () => {
  const toasts = useToastStore(s => s.toasts);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 100, display: 'flex', flexDirection: 'column-reverse',
    }}>
      {toasts.map(t => <ToastItem key={t.id} {...t} />)}
    </div>
  );
};

export default Toast;
