import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { markChallengeDone, isChallengeDone, getDoneChallenges } from "./doneStorage";
import { commitChallenge, clearCommitment, getChallengeCommitment } from "./commitStorage";
import { THEMES } from "./themes";

const UNLOCK_THRESHOLD = 7;

function getTimeframeSub(key) {
  const daysAhead = { today: 0, '3days': 3, week: 7 };
  const d = new Date();
  d.setDate(d.getDate() + (daysAhead[key] ?? 0));
  return d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
}

const TIMEFRAMES = [
  { key: 'today', label: 'Heute' },
  { key: '3days', label: 'In 3 Tagen' },
  { key: 'week', label: 'Diese Woche' },
];

function computeDeadlineMeta(commitment) {
  if (!commitment) return null;
  const start = new Date(commitment.committedAt);
  const daysMap = { today: 0, '3days': 3, week: 7 };
  const totalDays = Math.max(1, daysMap[commitment.timeframe] ?? 0);
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + totalDays);
  deadline.setHours(23, 59, 59, 999);

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil((deadline - now) / msPerDay));
  const elapsed = totalDays - daysLeft;
  const progress = Math.min(1, Math.max(0, elapsed / totalDays));

  let deadlineLabel;
  if (daysLeft <= 0) deadlineLabel = 'bis Heute';
  else if (daysLeft === 1) deadlineLabel = 'bis Morgen';
  else deadlineLabel = 'bis ' + deadline.toLocaleDateString('de-DE', { weekday: 'long' });

  const startLabel = 'Seit ' + start.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
  const endLabel = deadline.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');

  return { deadlineLabel, progress, startLabel, endLabel };
}

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3days');

  const allChallenges = challengesByWeek.flatMap((w) => w.challenges);
  const challenge = allChallenges.find((c) => c.id === id);

  if (!challenge) {
    return (
      <div className="page">
        <p>Challenge nicht gefunden.</p>
      </div>
    );
  }

  const themeIndex = challengesByWeek.findIndex((w) => w.challenges.some((c) => c.id === id));
  const theme = challengesByWeek[themeIndex];
  const t = THEMES[themeIndex];
  const taskIndex = theme.challenges.findIndex((c) => c.id === id);

  if (themeIndex > 0) {
    const doneIds = getDoneChallenges();
    const prevDone = challengesByWeek[themeIndex - 1].challenges.filter((c) =>
      doneIds.includes(c.id)
    ).length;
    if (prevDone < UNLOCK_THRESHOLD) {
      return (
        <div className="page">
          <button className="button-back" onClick={() => navigate(-1)}>← Zurück</button>
          <div className="card-soft card-centered">
            <div className="card-centered__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="11" width="16" height="11" rx="2" stroke="var(--color-ink-mute)" strokeWidth="1.8"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke="var(--color-ink-mute)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="card-centered__title">Noch nicht freigeschaltet</p>
            <p className="card-centered__text">
              Erledige {UNLOCK_THRESHOLD} Challenges aus „{challengesByWeek[themeIndex - 1].title}" um dieses Thema freizuschalten.
            </p>
          </div>
        </div>
      );
    }
  }

  const done = isChallengeDone(challenge.id);
  const commitment = getChallengeCommitment(challenge.id);
  const deadlineMeta = computeDeadlineMeta(commitment);

  const handleMarkDone = () => {
    markChallengeDone(challenge.id);
    clearCommitment();
    navigate('/done', { state: { challengeId: challenge.id, themeIndex, taskIndex } });
  };

  const handleAccept = () => {
    commitChallenge(challenge.id, selectedTimeframe);
    navigate(-1);
  };

  const handleAlreadyDone = () => {
    markChallengeDone(challenge.id);
    clearCommitment();
    navigate(-1);
  };

  const handlePause = () => {
    clearCommitment();
    navigate(-1);
  };

  return (
    <div className="detail-page">
      <div className="detail-topbar">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1L3 7l6 6" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="detail-pill" style={{ background: t.soft, color: t.deep }}>
          <div
            className={`detail-pill__dot${commitment ? ' bp-pulse-dot' : ''}`}
            style={{ background: t.color }}
          />
          Thema 0{t.num} · Aufgabe {taskIndex + 1}
        </div>
        <div className="detail-topbar__spacer" />
      </div>

      <div className="detail-body">
        <h1 className="detail-body__title">{challenge.displayTitle}</h1>
        <p className="detail-body__text">{challenge.description}</p>
        {challenge.example && (
          <p className="detail-body__example">{challenge.example}</p>
        )}
      </div>

      {/* Active status banner — replaces old "Ich mache das" card */}
      {!done && commitment && deadlineMeta && (
        <div className="detail-status-banner">
          <div
            className="detail-status-banner__card"
            style={{ background: t.soft, border: `1px solid ${t.color}30` }}
          >
            <div className="detail-status-banner__row1">
              <div className="detail-status-banner__left">
                <span
                  className="bp-pulse-dot detail-status-banner__dot"
                  style={{ background: t.color, boxShadow: `0 0 0 4px ${t.color}26` }}
                />
                <span className="detail-status-banner__label" style={{ color: t.deep }}>
                  Du machst das
                </span>
              </div>
              <span className="detail-status-banner__deadline" style={{ color: t.deep }}>
                {deadlineMeta.deadlineLabel}
              </span>
            </div>
            <div className="detail-status-banner__bar-track" style={{ background: `${t.color}26` }}>
              <div
                className="detail-status-banner__bar-fill bp-bar-anim"
                style={{
                  width: `${deadlineMeta.progress * 100}%`,
                  background: t.color,
                  '--bp-bar-delay': '200ms',
                }}
              />
            </div>
            <div className="detail-status-banner__dates" style={{ color: t.deep }}>
              <span>{deadlineMeta.startLabel}</span>
              <span>{deadlineMeta.endLabel}</span>
            </div>
          </div>
        </div>
      )}

      {challenge.guidance && (
        <div className="detail-tip">
          <div className="detail-tip__rule" style={{ background: t.color }} />
          <div>
            <div className="detail-tip__label" style={{ color: t.deep }}>Tipp</div>
            <p className="detail-tip__text">{challenge.guidance}</p>
          </div>
        </div>
      )}

      {/* Timeframe picker — only shown in open (no commitment) state */}
      {!done && !commitment && picking && (
        <div className="detail-timeframe">
          <div className="detail-timeframe__label">Bis wann?</div>
          <div className="detail-timeframe__options">
            {TIMEFRAMES.map((tf) => {
              const sel = selectedTimeframe === tf.key;
              return (
                <button
                  key={tf.key}
                  className="detail-timeframe__btn"
                  onClick={() => setSelectedTimeframe(tf.key)}
                  style={{
                    background: sel ? t.color : 'var(--color-bg)',
                    color: sel ? '#fff' : 'var(--color-ink)',
                    borderColor: sel ? t.color : 'var(--color-hair)',
                    boxShadow: sel ? `0 4px 12px -4px ${t.color}80` : 'none',
                  }}
                >
                  <span className="detail-timeframe__main">{tf.label}</span>
                  <span className="detail-timeframe__sub">{getTimeframeSub(tf.key)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="detail-cta">
        {done ? (
          <button
            className="detail-cta__primary"
            disabled
            style={{ background: 'var(--color-disabled-bg)', color: 'var(--color-muted)' }}
          >
            Erledigt ✓
          </button>
        ) : commitment ? (
          <>
            <button
              className="detail-cta__primary"
              onClick={handleMarkDone}
              style={{
                background: t.color,
                boxShadow: `0 10px 26px -8px ${t.color}`,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M1 7L6.5 12.5L17 1.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Als erledigt markieren
            </button>
            <button className="detail-cta__secondary" onClick={handlePause}>
              Aufgabe pausieren
            </button>
          </>
        ) : picking ? (
          <>
            <button
              className="detail-cta__primary"
              onClick={handleAccept}
              style={{ background: t.color, boxShadow: `0 8px 22px -6px ${t.color}90` }}
            >
              Bestätigen
            </button>
            <button className="detail-cta__secondary" onClick={() => setPicking(false)}>
              Abbrechen
            </button>
          </>
        ) : (
          <>
            <button
              className="detail-cta__primary"
              onClick={() => setPicking(true)}
              style={{ background: t.color, boxShadow: `0 8px 22px -6px ${t.color}90` }}
            >
              Annehmen
            </button>
            <button className="detail-cta__secondary" onClick={handleAlreadyDone}>
              Bereits erledigt
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetail;
