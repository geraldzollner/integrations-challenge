import React from 'react';

export default function ProgressBar({ progress = 0, className = '' }) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ '--progress-pct': `${pct}%` }} />
      </div>
    </div>
  );
}
