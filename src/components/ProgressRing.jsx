import React from 'react';

export default function ProgressRing({
  size = 64,
  stroke = 6,
  progress = 0,
  fillColor = 'white',
  trackColor = 'rgba(255,255,255,0.25)',
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke={trackColor} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke}
        stroke={fillColor} fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference - dash}
        strokeLinecap="round"
        className="progress-ring__progress"
      />
    </svg>
  );
}
