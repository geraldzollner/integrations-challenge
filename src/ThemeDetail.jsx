import { useParams, useNavigate, Link } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";
import { getActiveCommitment } from "./commitStorage";
import { THEMES } from "./themes";

const UNLOCK_THRESHOLD = 7;

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

  return (
    <div className="theme-detail-page">
      {/* Themed header */}
      <div
        className="theme-detail-header"
        style={{ background: `linear-gradient(180deg, ${t.color} 0%, ${t.deep} 100%)` }}
      >
        <span className="theme-detail-header__deco" aria-hidden>{t.num}</span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button className="theme-detail-back" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 1L3 7l6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="theme-detail-header__eyebrow">Thema 0{t.num}</div>
          <h1 className="theme-detail-header__title">{week.title}.</h1>
          <div className="theme-detail-header__sub">{week.sub}</div>
          <div className="theme-detail-header__progress">{done} von {total} erledigt</div>
        </div>
      </div>

      {/* Challenge list */}
      <div className="theme-detail-list">
        {week.challenges.map((challenge, taskIndex) => {
          const isDone = doneIds.includes(challenge.id);
          const isActive = !isDone && activeCommitment?.challengeId === challenge.id;
          return (
            <Link
              key={challenge.id}
              to={`/challenge/${challenge.id}`}
              className={`theme-challenge-card${isDone ? ' theme-challenge-card--done' : isActive ? ' theme-challenge-card--active' : ''}`}
              style={isActive ? { borderColor: `${t.color}77`, boxShadow: `0 4px 16px -8px ${t.color}55` } : {}}
            >
              <div
                className="theme-challenge-card__index"
                style={{
                  background: isDone ? `${t.color}22` : t.soft,
                  color: isDone ? t.color : t.deep,
                }}
              >
                {isDone ? (
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1" stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isActive ? (
                  <div className="theme-challenge-card__active-dot" style={{ background: t.color }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>
                    {taskIndex + 1}
                  </span>
                )}
              </div>
              <div className="theme-challenge-card__body">
                <div className="theme-challenge-card__title">{challenge.title}</div>
                {challenge.guidance && (
                  <div className="theme-challenge-card__hint">{challenge.guidance.slice(0, 60)}…</div>
                )}
              </div>
              {!isDone && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 1l6 6-6 6" stroke="var(--color-ink-mute)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </Link>
          );
        })}
      </div>

      <div className="page-bottom-spacer" />
    </div>
  );
}

export default ThemeDetail;
