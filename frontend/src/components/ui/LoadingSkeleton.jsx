import React from 'react';

const pulse = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`;

const SkeletonBox = ({ w, h, radius = 6, style = {} }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: '#f1f5f9',
    animation: 'pulse 1.5s ease-in-out infinite',
    flexShrink: 0,
    ...style,
  }} />
);

const LoadingSkeleton = ({ variant = 'row', count = 4 }) => {
  const items = Array.from({ length: count });

  if (variant === 'row') {
    return (
      <>
        <style>{pulse}</style>
        {items.map((_, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            marginBottom: 8,
          }}>
            <SkeletonBox w={36} h={36} radius={50} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SkeletonBox w="50%" h={13} />
              <SkeletonBox w="35%" h={11} />
            </div>
            <SkeletonBox w={120} h={6} radius={999} />
            <SkeletonBox w={60} h={22} radius={20} />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <style>{pulse}</style>
        {items.map((_, i) => (
          <div key={i} style={{
            padding: 20,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
          }}>
            <SkeletonBox w="60%" h={13} style={{ marginBottom: 12 }} />
            <SkeletonBox w="40%" h={28} style={{ marginBottom: 8 }} />
            <SkeletonBox w="80%" h={11} />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <style>{pulse}</style>
      {items.map((_, i) => (
        <SkeletonBox key={i} w="100%" h={60} radius={8} style={{ marginBottom: 8 }} />
      ))}
    </>
  );
};

export default LoadingSkeleton;
