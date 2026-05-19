import React from 'react';
import Wordmark from './Wordmark';
import ProgressRing from './ProgressRing';
import MetaLabel from './MetaLabel';

export default function OverviewHero({ theme = {}, overallDone = 0, overallTotal = 0, themeIdx = 0 }) {
  const percent = overallTotal > 0 ? overallDone / overallTotal : 0;

  return (
    <div
      className="overview-hero"
      style={{
        '--hero-color': `var(--theme-${themeIdx}-color)`,
        '--hero-deep': `var(--theme-${themeIdx}-deep)`,
      }}
    >
      <span className="overview-hero__deco-number" aria-hidden>{themeIdx + 1}</span>
      <div className="overview-hero__top">
        <Wordmark size={16} variant="dark" />
        <button className="overview-hero__icon-button" aria-label="Gewohnheiten">L</button>
      </div>
      <MetaLabel className="overview-hero__eyebrow">AKTUELLES THEMA</MetaLabel>
      <h2 className="overview-hero__title">{theme.title}</h2>
      {theme.sub && <p className="overview-hero__subtitle">{theme.sub}</p>}
      <div className="overview-hero__chart">
        <ProgressRing size={64} progress={percent} stroke={5} fillColor="white" trackColor="rgba(255,255,255,0.25)" />
        <div className="overview-hero__chart-meta">
          <div className="overview-hero__count">{overallDone}/{overallTotal}</div>
          <p className="overview-hero__count-label">Aufgaben gemeistert</p>
        </div>
      </div>
    </div>
  );
}
