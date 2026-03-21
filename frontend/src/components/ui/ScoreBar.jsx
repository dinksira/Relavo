import React, { useEffect, useState } from 'react';
import { getRiskColors, getRiskLabel } from '../../utils/scoreHelpers';
import Badge from './Badge';

const ScoreBar = ({ score = 0, showLabel = false, showScore = false }) => {
  const [animated, setAnimated] = useState(false);
  const colors = getRiskColors(score);
  const badgeVariant = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'danger';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {(showScore || showLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          {showScore && (
            <span style={{ fontSize: 12, color: '#94a3b8' }}></span>
          )}
          {showScore && (
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{score}/100</span>
          )}
          {showLabel && <Badge variant={badgeVariant} size="sm">{getRiskLabel(score)}</Badge>}
        </div>
      )}
      <div style={{
        width: '100%', height: 6,
        background: '#f1f5f9', borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: animated ? `${score}%` : '0%',
          background: colors.bar,
          borderRadius: 999,
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  );
};

export default ScoreBar;
