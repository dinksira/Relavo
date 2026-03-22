import React, { useEffect, useState } from 'react';
import { getRiskColors } from '../../utils/scoreHelpers';

const gaugeSizes = {
  xs: { diameter: 48, stroke: 4, fontSize: 12 },
  sm: { diameter: 60, stroke: 5, fontSize: 14 },
  md: { diameter: 80, stroke: 6, fontSize: 17 },
  lg: { diameter: 100, stroke: 7, fontSize: 22 },
  xl: { diameter: 120, stroke: 8, fontSize: 24 },
};

const HealthGauge = ({ score = 0, size = 'md' }) => {
  const [animated, setAnimated] = useState(false);
  const cfg = gaugeSizes[size] || gaugeSizes.md;
  const colors = getRiskColors(score);
  const radius = (cfg.diameter - cfg.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (animated ? score : 0) / 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', width: cfg.diameter, height: cfg.diameter, flexShrink: 0 }}>
      <svg
        width={cfg.diameter}
        height={cfg.diameter}
        style={{ transform: 'rotate(-90deg)' }}
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
          stroke={colors.bar}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: cfg.fontSize,
          fontWeight: 600,
          color: colors.text,
          lineHeight: 1,
        }}>
          {score}
        </span>
      </div>
    </div>
  );
};

export default HealthGauge;
