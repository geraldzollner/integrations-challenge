import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";
import { getActiveCommitment } from "./commitStorage";
import { THEMES } from "./themes";
import OverviewHero from "./components/OverviewHero";

const UNLOCK_THRESHOLD = 7;

function ChallengeOverview() {
  const navigate = useNavigate();
  const doneIds = getDoneChallenges();
  const activeCommitment = getActiveCommitment();

  const overallDone = challengesByWeek.reduce(
    (sum, week) => sum + week.challenges.filter((c) => doneIds.includes(c.id)).length,
    0
  );
  const overallTotal = challengesByWeek.reduce(
    (sum, week) => sum + week.challenges.length,
    0
  );

  useEffect(() => {
    const savedY = sessionStorage.getItem("overviewScrollY");
    if (savedY) {
      window.scrollTo(0, parseInt(savedY, 10));
      sessionStorage.removeItem("overviewScrollY");
    }
  }, []);

  const isLocked = (index) => {
    if (index === 0) return false;
    const prevDone = challengesByWeek[index - 1].challenges.filter((c) =>
      doneIds.includes(c.id)
    ).length;
    return prevDone < UNLOCK_THRESHOLD;
  };

  // Active theme = first with undone items
  const activeThemeIdx = (() => {
    const idx = challengesByWeek.findIndex(
      (week) => week.challenges.filter((c) => doneIds.includes(c.id)).length < week.challenges.length
    );
    return idx === -1 ? 0 : idx;
  })();

  // Up-next: show the active commitment if there is one, otherwise first undone per theme
  const upNext = [];
  if (activeCommitment) {
    challengesByWeek.forEach((week, wIdx) => {
      const match = week.challenges.find((c) => c.id === activeCommitment.challengeId);
      if (match) upNext.push({ challenge: match, themeIdx: wIdx, week });
    });
  } else {
    challengesByWeek.forEach((week, wIdx) => {
      if (upNext.length >= 3 || isLocked(wIdx)) return;
      const firstUndone = week.challenges.find((c) => !doneIds.includes(c.id));
      if (firstUndone) upNext.push({ challenge: firstUndone, themeIdx: wIdx, week });
    });
  }

  const handleThemeCardTap = (index) => {
    if (isLocked(index)) return;
    sessionStorage.setItem("overviewScrollY", window.scrollY);
    navigate(`/theme/${index}`);
  };

  return (
    <div className="overview-page">
      <OverviewHero
        theme={challengesByWeek[activeThemeIdx]}
        overallDone={overallDone}
        overallTotal={overallTotal}
        themeIdx={activeThemeIdx}
      />

      <div className="overview-section-label">Themen</div>
      <div className="overview-themes">
        {challengesByWeek.map((week, index) => {
          const total = week.challenges.length;
          const done = week.challenges.filter((c) => doneIds.includes(c.id)).length;
          const pct = total > 0 ? (done / total) * 100 : 0;
          const locked = isLocked(index);
          const t = THEMES[index];
          const isActive = index === activeThemeIdx;

          return (
            <div
              key={week.week}
              className="theme-card"
              onClick={() => handleThemeCardTap(index)}
              style={{
                borderColor: isActive ? `${t.color}55` : 'var(--color-hair)',
                boxShadow: isActive ? `0 6px 24px -10px ${t.color}55` : 'none',
                cursor: locked ? 'default' : 'pointer',
                opacity: locked ? 0.55 : 1,
              }}
            >
              <div
                className="theme-card__chip"
                style={{ background: locked ? 'var(--color-hair)' : t.color }}
              >
                {locked ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.4" fill="var(--color-ink-mute)" />
                    <path d="M5 7V5a3 3 0 116 0v2" stroke="var(--color-ink-mute)" strokeWidth="1.6" fill="none" />
                  </svg>
                ) : (
                  <span className="theme-card__chip-num">{t.num}</span>
                )}
              </div>

              <div className="theme-card__body">
                <div className="theme-card__title">{week.title}</div>
                <div className="theme-card__sub">{week.sub}</div>
                {!locked && (
                  <div className="theme-card__bar">
                    <div className="theme-card__bar-fill" style={{ width: `${pct}%`, background: t.color }} />
                  </div>
                )}
              </div>

              {!locked && (
                <div className="theme-card__count" style={{ color: t.color }}>
                  {done}<span className="theme-card__count-total">/{total}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {upNext.length > 0 && (
        <>
          <div className="overview-section-label">Als nächstes</div>
          <div className="overview-upnext">
            {upNext.map(({ challenge, themeIdx, week }) => {
              const t = THEMES[themeIdx];
              return (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  className={`upnext-card${activeCommitment?.challengeId === challenge.id ? ' upnext-card--active' : ''}`}
                  onClick={() => sessionStorage.setItem("overviewScrollY", window.scrollY)}
                >
                  <div className="upnext-card__dot" style={{ background: t.color }} />
                  <div className="upnext-card__body">
                    <div className="upnext-card__title">
                      {challenge.title}
                      {activeCommitment?.challengeId === challenge.id && (
                        <span className="upnext-card__badge" style={{ background: t.soft, color: t.deep }}>Aktiv</span>
                      )}
                    </div>
                    <div className="upnext-card__sub">{week.sub}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 1l6 6-6 6" stroke="var(--color-ink-mute)" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className="page-bottom-spacer" />
    </div>
  );
}

export default ChallengeOverview;
