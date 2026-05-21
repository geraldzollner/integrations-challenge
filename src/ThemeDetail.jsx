import { useParams, useNavigate, Link } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";
import { getActiveCommitment } from "./commitStorage";
import { THEMES } from "./themes";

const UNLOCK_THRESHOLD = 7;

function computeDeadlineLabel(commitment) {
  if (!commitment) return '';
  const start = new Date(commitment.committedAt);
  const daysMap = { today: 0, '3days': 3, week: 7 };
  const days = daysMap[commitment.timeframe] ?? 0;
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + days);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return 'bis Heute';
  if (daysLeft === 1) return 'bis Morgen';
  return 'bis ' + deadline.toLocaleDateString('de-DE', { weekday: 'long' });
}

function ThemeDetail() {
  const { themeIndex } = useParams();
  const navigate = useNavigate();
  const idx = parseInt(themeIndex, 10);
  const week = challengesByWeek[idx];
  const t = THEMES[idx];

  if (!week || !t) {
    navigate("/");
    return null;
  }

  const doneIds = getDoneChallenges();
  const activeCommitment = getActiveCommitment();

  if (idx > 0) {
    const prevDone = challengesByWeek[idx - 1].challenges.filter((c) =>
      doneIds.includes(c.id)
    ).length;
    if (prevDone < UNLOCK_THRESHOLD) {
      navigate("/");
      return null;
    }
  }

  const done = week.challenges.filter((c) => doneIds.includes(c.id)).length;
  const total = week.challenges.length;
  const deadlineLabel = computeDeadlineLabel(activeCommitment);

  return (
    <div className="theme-detail-page">
      {/* Themed header */}
      <div
        className="theme-detail-header"
        style={{ background: `linear-gradient(180deg, ${t.color} 0%, ${t.deep} 100%)` }}
      >
        <span className="theme-detail-header__deco" aria-hidden>{t.num}</span>
        {/* Concentric ring decorations */}
        <div style={{
          position: 'absolute', top: 30, right: -60, width: 200, height: 200,
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.13)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 70, right: -30, width: 140, height: 140,
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.10)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <button className="theme-detail-back" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 1L3 7l6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="theme-detail-header__eyebrow">Thema 0{t.num}</div>
          <h1 className="theme-detail-header__title">{week.title}.</h1>
          <div className="theme-detail-header__sub">{week.sub}</div>

          {/* Progress strip: animated bar + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              flex: 1, height: 6, borderRadius: 3,
              background: 'rgba(255,255,255,0.22)', overflow: 'hidden',
            }}>
              <div
                className="bp-bar-anim"
                style={{
                  height: '100%', borderRadius: 3, background: '#fff',
                  width: `${(done / total) * 100}%`,
                  '--bp-bar-delay': '300ms',
                }}
              />
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#fff',
              whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
            }}>
              {done}<span style={{ opacity: 0.7, fontWeight: 500 }}> von {total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge list */}
      <div className="theme-detail-list">
        {week.challenges.map((challenge, taskIndex) => {
          const isDone = doneIds.includes(challenge.id);
          const isActive = !isDone && activeCommitment?.challengeId === challenge.id;
          const delay = taskIndex * 35;

          /* ── Active: Expanded variant ── */
          if (isActive) {
            return (
              <Link
                key={challenge.id}
                to={`/challenge/${challenge.id}`}
                className="bp-rise"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  marginBottom: 14,
                  padding: '18px 18px 18px 22px',
                  borderRadius: 18,
                  background: '#fff',
                  border: `1.5px solid ${t.color}`,
                  boxShadow: `0 14px 32px -16px ${t.color}, 0 2px 6px -2px ${t.color}40`,
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 120ms cubic-bezier(.2,.7,.3,1)',
                  animationDelay: `${delay}ms`,
                }}
              >
                {/* Left accent bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: 5, background: t.color,
                }} />

                {/* Chip with pulsing ring */}
                <div style={{ position: 'relative', flexShrink: 0, width: 44, height: 44 }}>
                  <span className="bp-pulse-ring" style={{ border: `2px solid ${t.color}` }} />
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: t.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 22,
                      fontStyle: 'italic', lineHeight: 1, paddingBottom: 2,
                    }}>
                      {taskIndex + 1}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Status line */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px 3px 7px', borderRadius: 999,
                      background: t.soft, color: t.deep,
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>
                      <span className="bp-pulse-dot" style={{ width: 5, height: 5, borderRadius: 3, background: t.color }} />
                      Aktiv
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-ink-soft)', fontWeight: 500 }}>
                      {deadlineLabel}
                    </span>
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 6 }}>
                    {challenge.title}
                  </div>
                  {/* Tip preview — 2 lines clamped */}
                  <div style={{
                    fontSize: '12.5px', color: 'var(--color-ink-soft)', lineHeight: 1.45,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {challenge.guidance || challenge.description}
                  </div>
                </div>
              </Link>
            );
          }

          /* ── Done row ── */
          if (isDone) {
            return (
              <Link
                key={challenge.id}
                to={`/challenge/${challenge.id}`}
                className="theme-challenge-card bp-rise"
                style={{
                  opacity: 0.35,
                  background: 'var(--color-hair)',
                  borderColor: 'transparent',
                  animationDelay: `${delay}ms`,
                }}
              >
                <div className="theme-challenge-card__index" style={{ background: t.soft }}>
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path d="M1 7L6.5 12.5L17 1.5" stroke={t.deep} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="theme-challenge-card__body">
                  <div className="theme-challenge-card__title" style={{
                    color: 'var(--color-ink-soft)',
                    textDecoration: 'line-through',
                    textDecorationColor: 'var(--color-ink-mute)',
                    textDecorationThickness: '1.5px',
                  }}>
                    {challenge.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-ink-mute)', marginTop: 4, fontWeight: 500 }}>
                    erledigt
                  </div>
                </div>
              </Link>
            );
          }

          /* ── Open row ── */
          return (
            <Link
              key={challenge.id}
              to={`/challenge/${challenge.id}`}
              className="theme-challenge-card bp-rise"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="theme-challenge-card__index" style={{ background: t.soft, color: t.deep }}>
                <span style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                  {taskIndex + 1}
                </span>
              </div>
              <div className="theme-challenge-card__body">
                <div className="theme-challenge-card__title">{challenge.title}</div>
                <div className="theme-challenge-card__hint">
                  {challenge.description || challenge.guidance}
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 1l6 6-6 6" stroke="var(--color-ink-mute)" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Link>
          );
        })}
      </div>

      <div className="page-bottom-spacer" />
    </div>
  );
}

export default ThemeDetail;
