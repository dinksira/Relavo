import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X, Sparkles } from 'lucide-react';
import useToastStore from '../../store/toastStore';

const iconMap = {
  success: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  error:   { Icon: XCircle,     color: 'text-rose-500',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
  info:    { Icon: Sparkles,    color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
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
    setTimeout(() => removeToast(id), 400);
  };

  return (
    <div className={`
      flex items-start gap-4 p-5 rounded-[24px] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
      bg-white/90 backdrop-blur-2xl mb-4 min-w-[340px] max-w-[440px] 
      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform
      ${visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-95'}
      ${border}
    `}>
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-inner`}>
        <Icon size={24} className={color} />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 m-0 mb-1">{variant}</p>
        <p className="text-[14px] font-black text-slate-900 leading-snug m-0">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="mt-1 p-1.5 hover:bg-slate-100/50 rounded-xl text-slate-300 hover:text-slate-900 transition-all border-none bg-transparent cursor-pointer"
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
    <div className="fixed top-8 right-8 z-[9999] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(t => <ToastItem key={t.id} {...t} />)}
      </div>
    </div>
  );
};

export default Toast;
