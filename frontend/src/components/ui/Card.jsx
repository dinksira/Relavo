import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hover = false 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white 
        border border-[#e2e8f0] 
        rounded-[10px] 
        p-5 
        transition-all duration-200 
        ${onClick ? 'cursor-pointer' : ''} 
        ${hover ? 'hover:shadow-md hover:border-[#3b82f6]/20' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
