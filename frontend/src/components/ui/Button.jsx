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
  const baseClasses = "btn-base font-semibold rounded-[9px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.97]";
  
  const variants = {
    primary: "bg-[#3b82f6] text-white shadow-[0_1px_3px_rgba(59,130,246,0.3),0_4px_8px_rgba(59,130,246,0.15)] hover:bg-[#2563eb] hover:shadow-[0_2px_6px_rgba(59,130,246,0.4)]",
    outline: "bg-white border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] hover:border-[#cbd5e1]",
    ghost: "bg-transparent text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] shadow-none",
    danger: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
    success: "bg-[#16a34a] text-white hover:bg-[#15803d]",
  };

  const sizes = {
    sm: "h-[32px] px-3 text-[13px] gap-1.5",
    md: "h-[38px] px-4 text-[13px] gap-2",
    lg: "h-[44px] px-5 text-[14px] gap-2",
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center ${baseClasses} ${currentVariant} ${currentSize} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 16} className={variant === 'primary' ? 'text-white' : 'text-[#64748b]'} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
