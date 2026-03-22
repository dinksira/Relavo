import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const QuickLogButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: isHovered ? '#1d4ed8' : '#3b82f6',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
          : '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        border: 'none',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
      }}
      title="Quick log activity"
    >
      <Plus size={28} />
    </button>
  );
};

export default QuickLogButton;
