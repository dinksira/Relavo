import React, { useEffect, useState } from 'react';

const gaugeSizes = {
  xs: { diameter: 48, stroke: 4, fontSize: 13 },
  sm: { diameter: 60, stroke: 5, fontSize: 15 },
  md: { diameter: 80, stroke: 6, fontSize: 18 },
  lg: { diameter: 100, stroke: 7, fontSize: 24 },
  xl: { diameter: 120, stroke: 8, fontSize: 32 },
};

const getGaugeColor = (s) => {
  if (s >= 70) return '#16a34a';
  if (s >= 40) return '#d97706';
  return '#dc2626';
};

const HealthGauge = ({ score = 0, size = 'md' }) => {
  const [animated, setAnimated] = useState(false);
  const cfg = gaugeSizes[size] || gaugeSizes.md;
  const radius = (cfg.diameter - cfg.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getGaugeColor(score);
  const offset = circumference * (1 - (animated ? score : 0) / 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: cfg.diameter, height: cfg.diameter }}>
      <svg
        width={cfg.diameter}
        height={cfg.diameter}
        className="transform -rotate-90"
      >
        <circle
          cx={cfg.diameter / 2}
          cy={cfg.diameter / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={cfg.stroke}
        />
        <circle
          cx={cfg.diameter / 2}
          cy={cfg.diameter / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-bold leading-none tracking-tight text-[#0f172a]"
          style={{ fontSize: cfg.fontSize }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export default HealthGauge;
