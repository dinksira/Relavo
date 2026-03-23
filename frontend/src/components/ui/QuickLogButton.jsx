import React from 'react';
import { Plus } from 'lucide-react';

const QuickLogButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-7 right-7 w-[52px] h-[52px] rounded-[14px] bg-[#3b82f6] text-white flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.4),0_2px_4px_rgba(59,130,246,0.2)] border-none z-[50] transition-all duration-200 ease-in-out hover:bg-[#2563eb] hover:shadow-[0_8px_20px_rgba(59,130,246,0.5)] hover:-translate-y-[2px] hover:scale-[1.05] active:scale-[0.95] outline-none"
      title="Quick log activity"
    >
      <Plus size={22} className="text-white" />
    </button>
  );
};

export default QuickLogButton;
