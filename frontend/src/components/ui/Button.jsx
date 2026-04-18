import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  icon: Icon,
  fullWidth = false,
  type = 'button',
  className = "",
}) => {
  const baseClasses = "btn-base font-black uppercase tracking-widest rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.96] flex items-center justify-center border-none cursor-pointer";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5",
    outline: "bg-white border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30",
    ghost: "bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-50",
    danger: "bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 hover:shadow-rose-500/30",
    success: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-emerald-500/30",
  };

  const sizes = {
    sm: "h-10 px-4 text-[10px] gap-2",
    md: "h-12 px-6 text-[11px] gap-2.5",
    lg: "h-14 px-8 text-[12px] gap-3",
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${currentVariant} ${currentSize} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && (
        <Icon size={size === 'sm' ? 14 : 16} className="shrink-0" />
      )}
      <span className="leading-none">{children}</span>
    </button>
  );
};

export default Button;
