import React from 'react';

/**
 * Premium SVG circular gauge showing health score with high-fidelity aesthetics.
 */
export default function HealthGauge({ 
  score = 0, 
  size = 120, 
  strokeWidth = 8, 
  showLabel = true 
}) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  const getColor = (s) => {
    if (s >= 70) return ['#22c55e', '#15803d']; // Green range
    if (s >= 40) return ['#f59e0b', '#b45309']; // Amber range
    return ['#ef4444', '#b91c1c']; // Red range
  };

  const [colorBase, colorDark] = getColor(normalizedScore);
  
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;
  const center = size / 2;

  const riskLabel = normalizedScore >= 70 ? 'Optimal' : normalizedScore >= 40 ? 'Monitoring' : 'Critical';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Defs for gradients and shadows */}
          <defs>
            <linearGradient id={`gradient-${normalizedScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorBase} />
              <stop offset="100%" stopColor={colorDark} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          
          {/* Score arc with shadow/glow effect */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${normalizedScore})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#shadow)"
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' 
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-[28px] font-black tracking-tighter text-slate-900" style={{ fontSize: size * 0.22 }}>
            {normalizedScore}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5" style={{ fontSize: size * 0.08 }}>
            Pts
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colorBase }} />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {riskLabel}
          </span>
        </div>
      )}
    </div>
  );
}
