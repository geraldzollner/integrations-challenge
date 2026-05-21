import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { addHabit, isHabit } from "./habitStorage";
import { THEMES } from "./themes";

function Done() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/");
    return null;
  }

  const { themeIndex, taskIndex } = state;
  const t = THEMES[themeIndex] ?? THEMES[0];
  const challenge = challengesByWeek[themeIndex]?.challenges[taskIndex];
  const alreadyHabit = challenge ? isHabit(challenge.id) : true;

  const confetti = useMemo(() => {
    const N = 16;
    return Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2;
      const dist = 80 + Math.random() * 40;
      const colors = [t.color, t.deep, '#fff', t.soft];
      return {
        cx: Math.cos(angle) * dist,
        cy: Math.sin(angle) * dist - 20,
        cr: (Math.random() - 0.5) * 720,
        color: colors[i % colors.length],
        delay: Math.random() * 200,
      };
    });
  }, []);

  const handleHabitYes = () => {
    if (challenge) addHabit(challenge, themeIndex);
    navigate("/habits");
  };

  const handleBack = () => navigate(`/theme/${themeIndex}`);

  return (
    <div
      className="done-page"
      style={{
        background: `linear-gradient(180deg, ${t.color} 0%, ${t.color} 38%, var(--color-bg) 70%)`,
      }}
    >
      <div className="done-topbar">
        <button className="done-back" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M2 8l5-5M2 8l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="done-celebration">
        <div className="done-confetti-origin">
          {confetti.map((c, i) => (
            <div
              key={i}
              className="bp-confetti"
              style={{
                background: c.color,
                '--cx': `${c.cx}px`,
                '--cy': `${c.cy}px`,
                '--cr': `${c.cr}deg`,
                animationDelay: `${c.delay}ms`,
              }}
            />
          ))}
        </div>

        <div className="done-radiate bp-radiate" style={{ animationDelay: '100ms' }} />
        <div className="done-radiate bp-radiate" style={{ animationDelay: '300ms' }} />
        <div className="done-radiate bp-radiate" style={{ animationDelay: '500ms' }} />
        <div className="done-radiate bp-radiate" style={{ animationDelay: '700ms' }} />
        <div className="done-radiate bp-radiate" style={{ animationDelay: '900ms' }} />
        <div className="done-radiate bp-radiate" style={{ animationDelay: '1100ms' }} />

        <div className="done-badge bp-burst">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 24.5l7 7 14-15" stroke={t.color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="bp-rise" style={{ animationDelay: '400ms' }}>
          <div className="done-eyebrow">Erledigt</div>
          <h1 className="done-headline">
            Stark, <span style={{ fontStyle: 'italic' }}>das war's!</span>
          </h1>
        </div>
      </div>

      <div className="done-card bp-rise" style={{ animationDelay: '500ms' }}>
        <div className="done-card__pill">
          <div className="done-card__dot" style={{ background: t.color }} />
          <span style={{ color: t.deep }}>Thema 0{t.num} · Aufgabe {taskIndex + 1}</span>
        </div>
        <div className="done-card__title">{challenge?.displayTitle ?? challenge?.title}</div>
        {!alreadyHabit && (
          <div className="done-card__prompt">
            Möchtest du diese Aufgabe zur täglichen Gewohnheit machen?
          </div>
        )}
      </div>

      <div className="done-cta bp-rise" style={{ animationDelay: '600ms' }}>
        {!alreadyHabit ? (
          <>
            <button className="done-cta__primary" onClick={handleHabitYes}>
              Zur Gewohnheit machen
            </button>
            <button className="done-cta__secondary" onClick={handleBack}>
              Nein, danke
            </button>
          </>
        ) : (
          <button className="done-cta__primary" onClick={handleBack}>
            Zurück zur Übersicht
          </button>
        )}
      </div>
    </div>
  );
}

export default Done;
