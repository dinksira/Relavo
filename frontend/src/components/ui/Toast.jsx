import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import useToastStore from '../../store/toastStore';

const iconMap = {
  success: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  error:   { Icon: XCircle,     color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-100' },
  info:    { Icon: Info,        color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-100' },
};

const ToastItem = ({ id, message, variant = 'info' }) => {
  const [visible, setVisible] = useState(false);
  const removeToast = useToastStore(s => s.removeToast);
  const { Icon, color, bg, border } = iconMap[variant] || iconMap.info;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeToast(id), 300);
  };

  return (
    <div className={`
      flex items-center gap-3 p-4 rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.06)] 
      bg-white/80 backdrop-blur-xl mb-3 min-w-[320px] max-w-[420px] 
      transition-all duration-300 transform
      ${visible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
      ${border}
    `}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={color} />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-slate-800 leading-tight">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors border-none bg-transparent cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Toast = () => {
  const toasts = useToastStore(s => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(t => <ToastItem key={t.id} {...t} />)}
      </div>
    </div>
  );
};

export default Toast;
