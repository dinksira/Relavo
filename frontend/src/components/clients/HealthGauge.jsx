import React from 'react';

/**
 * SVG circular gauge showing health score.
 */
export default function HealthGauge({ 
  score = 0, 
  size = 80, 
  strokeWidth = 6, 
  showLabel = true 
}) {
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // Calculate colors based on score
  const getColor = (s) => {
    if (s >= 70) return '#16a34a'; // Success (green)
    if (s >= 40) return '#d97706'; // Warning (amber)
    return '#dc2626'; // Danger (red)
  };

  const getRiskLabel = (s) => {
    if (s >= 70) return 'Healthy';
    if (s >= 40) return 'Needs Attention';
    return 'At Risk';
  };

  const color = getColor(normalizedScore);
  
  // SVG calculations
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 transition-all duration-1000 ease-out"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        
        {/* Score arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ 
            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' 
          }}
        />
        
        {/* Score text (centered) */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${center} ${center})`}
          className="font-bold"
          style={{ 
            fontSize: size * 0.28,
            fill: color,
            transition: 'fill 0.5s ease'
          }}
        >
          {normalizedScore}
        </text>
      </svg>
      
      {showLabel && (
        <span 
          className="mt-2 font-semibold text-center whitespace-nowrap"
          style={{ 
            fontSize: size * 0.13,
            color: '#64748b'
          }}
        >
          {getRiskLabel(normalizedScore)}
        </span>
      )}
    </div>
  );
}
