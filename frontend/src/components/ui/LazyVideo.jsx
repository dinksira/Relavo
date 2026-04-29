import React, { useRef } from 'react';

/**
 * Optimized Background Video Component
 * Designed for high-speed external CDN delivery.
 */
const LazyVideo = ({ 
  src, 
  webmSrc, // Optional WebM version (usually 50% smaller)
  className = "", 
  overlayClassName = "",
  opacity = "opacity-40",
  mixBlendMode = "mix-blend-screen"
}) => {
  const videoRef = useRef(null);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`w-full h-full object-cover ${opacity} ${mixBlendMode}`}
        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
      >
        {/* WebM is prioritized for browsers that support it (Chrome/Edge/Firefox) */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        
        {/* MP4 as a reliable fallback */}
        <source src={src} type="video/mp4" />
      </video>

      {/* Gradient Overlay for text readability */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
};

export default LazyVideo;
