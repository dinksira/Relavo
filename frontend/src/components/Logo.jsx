import React from 'react';

const Logo = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/src/assets/relavo-logo.svg" alt="relavo" className="h-full object-contain" />
      {showText && (
        <span className="text-relavo-navy font-semibold text-xl lowercase">relavo</span>
      )}
    </div>
  );
};

export default Logo;
