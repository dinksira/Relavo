import React from 'react';

const variants = {
  healthy:  { bg: '#dcfce7', text: '#16a34a' },
  warning:  { bg: '#fef9c3', text: '#d97706' },
  danger:   { bg: '#fee2e2', text: '#dc2626' },
  info:     { bg: '#eff6ff', text: '#3b82f6' },
  neutral:  { bg: '#f1f5f9', text: '#64748b' },
  active:   { bg: '#dcfce7', text: '#16a34a' },
  paused:   { bg: '#fef9c3', text: '#d97706' },
  churned:  { bg: '#fee2e2', text: '#dc2626' },
};

const sizes = {
  sm: { fontSize: 11, padding: '2px 8px' },
  md: { fontSize: 12, padding: '3px 10px' },
};

const Badge = ({ variant = 'neutral', size = 'md', children, dot = false }) => {
  const v = variants[variant] || variants.neutral;
  const s = sizes[size] || sizes.md;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: v.bg,
      color: v.text,
      borderRadius: 20,
      fontWeight: 500,
      fontSize: s.fontSize,
      padding: s.padding,
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: v.text,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
};

export default Badge;
