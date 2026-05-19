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

function getDeadlineLabel(timeframe) {
  if (timeframe === 'today') return 'Heute';
  const daysAhead = { '3days': 3, week: 7 };
  const d = new Date();
  d.setDate(d.getDate() + (daysAhead[timeframe] ?? 0));
  return d.toLocaleDateString('de-DE', { weekday: 'long' });
}

const TIMEFRAMES = [
  { key: 'today', label: 'Heute' },
  { key: '3days', label: 'In 3 Tagen' },
  { key: 'week', label: 'Diese Woche' },
];

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

  return (
    <div className="detail-page">
      <div className="detail-topbar">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1L3 7l6 6" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="detail-pill" style={{ background: t.soft, color: t.deep }}>
          <div className="detail-pill__dot" style={{ background: t.color }} />
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

      {challenge.guidance && (
        <div className="detail-tip">
          <div className="detail-tip__rule" style={{ background: t.color }} />
          <div>
            <div className="detail-tip__label" style={{ color: t.deep }}>Tipp</div>
            <p className="detail-tip__text">{challenge.guidance}</p>
          </div>
        </div>
      )}

      {picking && (
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

      {!done && commitment && (
        <div className="detail-committed" style={{ background: t.soft, borderColor: `${t.color}44` }}>
          <div className="detail-committed__label" style={{ color: t.deep }}>Ich mache das</div>
          <div className="detail-committed__deadline" style={{ color: t.color }}>
            bis {getDeadlineLabel(commitment.timeframe)}
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
          <button
            className="detail-cta__primary"
            onClick={handleMarkDone}
            style={{ background: t.color, boxShadow: `0 8px 22px -6px ${t.color}90` }}
          >
            Als erledigt markieren
          </button>
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
