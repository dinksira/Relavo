import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen, onClose, title, subtitle,
  children, size = 'md', footer,
  icon: Icon = Command
}) => {
  const maxWidths = { 
    sm: 'max-w-[440px]', 
    md: 'max-w-[580px]', 
    lg: 'max-w-[780px]', 
    xl: 'max-w-[1024px]' 
  };
  const mw = maxWidths[size] || maxWidths.md;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] w-full ${mw} max-h-[92vh] flex flex-col border border-white/40 animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}
      >
        {/* Elite Header */}
        <div className="p-8 pb-1 flex flex-col items-center text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-inner">
             <Icon size={24} className="text-blue-600" />
          </div>
          
          <h2 className="text-[24px] font-black text-slate-900 m-0 tracking-tight italic leading-tight">
             {title}.
          </h2>
          {subtitle && (
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 m-0 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
               {subtitle}
            </p>
          )}

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Executive Body */}
        <div className="p-8 pt-6 overflow-y-auto flex-1 no-scrollbar">
          {children}
        </div>

        {/* Polished Footer */}
        {footer && (
          <div className="p-8 pt-0 flex flex-col gap-3">
            <div className="h-px bg-slate-50 w-full mb-3" />
            <div className="flex items-center justify-end gap-3">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
