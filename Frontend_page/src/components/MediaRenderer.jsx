import React from 'react';

const MediaRenderer = ({ src, type, className, alt = "media" }) => {
  // Check if it's a video based on type or file extension
  const isVideo = type === 'video' || (typeof src === 'string' && src.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/));

  if (isVideo) {
    return (
      <video 
        src={src} 
        className={`${className} object-cover`}
        muted 
        autoPlay 
        loop 
        playsInline
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} object-cover`}
      onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='18' font-family='sans-serif'%3ENo Media%3C/text%3E%3C/svg%3E"; 
      }} 
    />
  );
};

export default MediaRenderer;
