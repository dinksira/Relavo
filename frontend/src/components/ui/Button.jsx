import React from 'react';

const variantStyles = {
  primary:  { background: '#3b82f6', color: '#fff', border: 'none' },
  outline:  { background: 'transparent', color: '#0f172a', border: '1px solid #e2e8f0' },
  ghost:    { background: 'transparent', color: '#64748b', border: 'none' },
  danger:   { background: '#dc2626', color: '#fff', border: 'none' },
  success:  { background: '#16a34a', color: '#fff', border: 'none' },
};

const variantHover = {
  primary:  { background: '#2563eb' },
  outline:  { background: '#f8fafc' },
  ghost:    { background: '#f8fafc', color: '#0f172a' },
  danger:   { background: '#b91c1c' },
  success:  { background: '#15803d' },
};

const sizeStyles = {
  sm: { height: '32px', padding: '0 12px', fontSize: '13px' },
  md: { height: '38px', padding: '0 16px', fontSize: '14px' },
  lg: { height: '44px', padding: '0 20px', fontSize: '15px' },
};

const Spinner = () => (
  <span style={{
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'btn-spin 0.7s linear infinite',
    flexShrink: 0
  }} />
);

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
  style = {},
}) => {
  const [hovered, setHovered] = React.useState(false);
  const base = variantStyles[variant] || variantStyles.primary;
  const hover = variantHover[variant] || {};
  const sizing = sizeStyles[size] || sizeStyles.md;

  return (
    <>
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: 8,
          fontWeight: 500,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 150ms ease',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          width: fullWidth ? '100%' : 'auto',
          ...sizing,
          ...base,
          ...(hovered && !disabled && !loading ? hover : {}),
          ...style,
        }}
      >
        {loading ? <Spinner /> : Icon ? <Icon size={size === 'sm' ? 14 : 16} /> : null}
        {children}
      </button>
    </>
  );
};

export default Button;
