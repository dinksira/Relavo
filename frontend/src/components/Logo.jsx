import React from 'react';
import logoPath from '../assets/relavo-logo.svg';

const Logo = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logoPath} alt="relavo" className="h-full object-contain" />
      {showText && (
        <span className="text-relavo-navy font-black text-xl lowercase tracking-tighter">relavo</span>
      )}
    </div>
  );
};

export default Logo;
