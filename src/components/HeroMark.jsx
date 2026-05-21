import React from 'react';

export default function HeroMark({ size = 220 }) {
  const center = size / 2;
  const stroke = 2.5;
  const radii = [76, 60, 44];
  return (
    <div className="hero-mark" style={{ '--hero-mark-size': `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--theme-3-color)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" rx="24" fill="url(#heroGlow)" />
        {radii.map((r, i) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={i === 0 ? 'var(--theme-3-color)' : 'var(--theme-3-soft)'}
            strokeWidth={stroke}
            opacity={i === 0 ? 1 : 0.65}
          />
        ))}
        <circle cx={center} cy={center} r={28} fill="var(--theme-3-deep)" />
        <circle cx={center} cy={center} r={10} fill="#fff" />
      </svg>
    </div>
  );
}
