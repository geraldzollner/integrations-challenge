import React from 'react';

export default function Wordmark({ size = 22, variant = 'light', className = '' }) {
  return (
    <div
      className={`wordmark wordmark--${variant} ${className}`}
      style={{ '--wordmark-size': `${size}px` }}
      aria-label="Talkin' Deutsch"
    >
      <span className="wordmark__dot" />
      <span className="wordmark__brand">Talkin'<span className="wordmark__title"> Deutsch</span></span>
    </div>
  );
}
