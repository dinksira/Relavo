import React from 'react';

const LoadingScreen = ({ fullPage = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md' : 'w-full h-full min-h-[400px]'}`}>
      <style>{`
        @keyframes logo-pulse {
          0% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0)); }
          50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4)); }
          100% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0)); }
        }
        @keyframes ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-logo {
          animation: logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-ring {
          animation: ring-spin 3s linear infinite;
        }
      `}</style>
      
      <div className="relative flex items-center justify-center">
        {/* Animated Gradient Ring */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-200 animate-ring"></div>
        
        {/* Logo Container */}
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center z-10 animate-logo overflow-hidden">
          <img 
            src="/favicon.svg" 
            alt="Relavo" 
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-slate-800 font-bold text-lg tracking-tight">Relavo</h3>
        <p className="text-slate-400 text-sm font-medium animate-pulse mt-1">Analyzing relationship health...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
