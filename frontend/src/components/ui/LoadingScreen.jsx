import React from 'react';

const LoadingScreen = ({ fullPage = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'fixed inset-0 z-[9999] bg-[#f8fafc]/90 backdrop-blur-xl' : 'w-full h-full min-h-[400px]'}`}>
      <style>{`
        @keyframes float-logo {
          0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 10px 20px rgba(37, 99, 235, 0.15)); }
          50% { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 25px 40px rgba(37, 99, 235, 0.25)); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        .animate-executive-logo {
          animation: float-logo 4s ease-in-out infinite;
        }
        .animate-orbit-dot {
          animation: orbit 3s linear infinite;
        }
      `}</style>
      
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Orbital Path */}
        <div className="absolute w-20 h-20 rounded-full border border-blue-100/50" />
        
        {/* Orbital Dot */}
        <div className="absolute w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)] animate-orbit-dot" />
        
        {/* Elite Logo Container */}
        <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center z-10 animate-executive-logo border border-slate-50">
          <img 
            src="/favicon.svg" 
            alt="Relavo" 
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center reveal">
        <h3 className="text-slate-900 font-black text-xl tracking-tighter italic m-0">relavo.</h3>
        <div className="flex items-center gap-2 justify-center mt-2">
           <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] m-0">Analyzing Intelligence Ledger</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
