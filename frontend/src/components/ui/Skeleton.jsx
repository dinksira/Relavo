import React from 'react';

const Skeleton = ({ className, width, height, circle }) => {
  return (
    <div 
      className={`bg-slate-200 animate-pulse ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px' 
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="premium-card p-6 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton width="40%" height="24px" />
      <Skeleton width="40px" height="40px" circle />
    </div>
    <Skeleton width="80%" height="40px" />
    <Skeleton width="100%" height="16px" />
  </div>
);

export const ListSkeleton = () => (
  <div className="premium-card overflow-hidden divide-y divide-slate-50">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="p-6 flex items-center gap-6">
        <Skeleton width="48px" height="48px" circle />
        <div className="flex-1 space-y-2">
          <Skeleton width="30%" height="20px" />
          <Skeleton width="60%" height="14px" />
        </div>
        <Skeleton width="60px" height="20px" />
        <Skeleton width="20px" height="20px" circle />
      </div>
    ))}
  </div>
);

export default Skeleton;
