import React from 'react';

const variants = {
  healthy:  "bg-[#f0fdf4] text-[#16a34a]",
  active:   "bg-[#f0fdf4] text-[#16a34a]",
  warning:  "bg-[#fffbeb] text-[#d97706]",
  paused:   "bg-[#fffbeb] text-[#d97706]",
  danger:   "bg-[#fef2f2] text-[#dc2626]",
  churned:  "bg-[#fef2f2] text-[#dc2626]",
  info:     "bg-[#eff6ff] text-[#3b82f6]",
  neutral:  "bg-[#f1f5f9] text-[#64748b]",
};

const sizes = {
  sm: "text-[11px] px-2 py-0.5 rounded-[4px]",
  md: "text-[12px] px-2.5 py-1 rounded-[6px]",
};

const Badge = ({ variant = 'neutral', size = 'md', children, dot = false }) => {
  const variantClass = variants[variant] || variants.neutral;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider whitespace-nowrap ${variantClass} ${sizeClass}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      )}
      {children}
    </span>
  );
};

export default Badge;
