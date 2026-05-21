import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Wordmark from "./components/Wordmark";

const STORAGE_KEY = "onboarding_seen";

function WelcomeModal() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const navigate = useNavigate();

  if (!visible) return null;

  function handleStart() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    navigate("/");
  }

  return (
    <div className="welcome-screen">
      <Wordmark size={22} className="welcome__wordmark" />

      <div className="welcome__hero bp-rise">
        <svg width="160" height="160" viewBox="0 0 180 180" aria-hidden>
          <defs>
            <radialGradient id="bp-glow-w" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-brand-sky)" stopOpacity="0.28" />
              <stop offset="60%" stopColor="var(--color-brand-sky)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="90" cy="90" r="82" fill="url(#bp-glow-w)" />
          <circle cx="90" cy="90" r="76" stroke="var(--theme-3-color)" strokeWidth="2.5" fill="none"
            strokeDasharray="430 1000" strokeLinecap="round" transform="rotate(-95 90 90)" />
          <circle cx="90" cy="90" r="60" stroke="var(--theme-2-color)" strokeWidth="2.5" fill="none"
            strokeDasharray="320 1000" strokeLinecap="round" transform="rotate(-65 90 90)" />
          <circle cx="90" cy="90" r="44" stroke="var(--theme-1-color)" strokeWidth="2.5" fill="none"
            strokeDasharray="225 1000" strokeLinecap="round" transform="rotate(-30 90 90)" />
          <circle cx="90" cy="90" r="28" fill="var(--color-brand-navy)" />
          <circle cx="90" cy="90" r="10" fill="#fff" opacity="0.92" />
        </svg>
      </div>

      <h1 className="welcome__headline bp-rise" style={{ animationDelay: '120ms' }}>
        Ankommen,<br />
        <span style={{ fontStyle: 'italic', color: 'var(--color-brand-blue)' }}>Schritt für Schritt.</span>
      </h1>
      <p className="welcome__subhead bp-rise" style={{ animationDelay: '220ms' }}>
        Vom ersten Hallo bis zur echten Freundschaft.<br />
        In kleinen, machbaren Schritten.
      </p>

      <div className="welcome__spacer" />

      <div className="bp-rise" style={{ animationDelay: '320ms' }}>
        <p className="welcome__reassurance">
          Nervös sein{' '}
          <span style={{ color: 'var(--color-brand-blue)' }}>ist normal</span>
          {' '}— es bedeutet nur,<br />
          dass du dich wirklich auf das Leben einlässt.
        </p>
        <button className="welcome__btn-primary" onClick={handleStart}>Loslegen</button>
      </div>
    </div>
  );
}

export default WelcomeModal;
