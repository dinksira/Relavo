import React from 'react';
import { getInitials } from '../../utils/scoreHelpers';

const colorMap = (name) => {
  if (!name) return { bg: '#f1f5f9', text: '#64748b' };
  const c = name[0].toUpperCase();
  if (c <= 'E') return { bg: '#dbeafe', text: '#1d4ed8' };
  if (c <= 'J') return { bg: '#ede9fe', text: '#6d28d9' };
  if (c <= 'O') return { bg: '#fce7f3', text: '#be185d' };
  if (c <= 'T') return { bg: '#dcfce7', text: '#15803d' };
  return { bg: '#ffedd5', text: '#c2410c' };
};

const sizes = {
  sm: { size: 28, font: 11 },
  md: { size: 36, font: 13 },
  lg: { size: 48, font: 16 },
  xl: { size: 64, font: 20 },
};

const Avatar = ({ name, size = 'md', style = {} }) => {
  const s = sizes[size] || sizes.md;
  const colors = colorMap(name);
  return (
    <div style={{
      width: s.size,
      height: s.size,
      borderRadius: '50%',
      background: colors.bg,
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: s.font,
      flexShrink: 0,
      userSelect: 'none',
      ...style,
    }}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
