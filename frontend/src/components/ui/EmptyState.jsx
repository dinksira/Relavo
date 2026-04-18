import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, subtitle, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
    <div className="w-20 h-20 bg-slate-100 rounded-[28px] flex items-center justify-center mb-6 shadow-inner">
      {Icon && <Icon size={36} className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
    </div>
    
    <h3 className="text-[20px] font-bold text-slate-900 m-0 tracking-tight">{title}</h3>
    
    {subtitle && (
      <p className="text-[14px] text-slate-500 mt-2 m-0 max-w-[320px] leading-relaxed font-medium">
        {subtitle}
      </p>
    )}
    
    {action && actionLabel && (
      <div className="mt-8">
        <Button 
          variant="primary" 
          onClick={action} 
          className="!px-8 !h-11 shadow-lg shadow-blue-200"
        >
          {actionLabel}
        </Button>
      </div>
    )}
  </div>
);

export default EmptyState;
