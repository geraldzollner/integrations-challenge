import { Link } from "react-router-dom";
import { useEffect } from "react";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";
import { getActiveCommitment } from "./commitStorage";

const UNLOCK_THRESHOLD = 7;

function ChallengeOverview() {
  const doneIds = getDoneChallenges();
  const activeCommitment = getActiveCommitment();

  useEffect(() => {
    const savedY = sessionStorage.getItem("overviewScrollY");
    if (savedY) {
      window.scrollTo(0, parseInt(savedY, 10));
      sessionStorage.removeItem("overviewScrollY");
    }
  }, []);

  const handleChallengeClick = () => {
    sessionStorage.setItem("overviewScrollY", window.scrollY);
  };

  return (
    <div className="page">
      <h1>Integrations-Challenge</h1>
      {challengesByWeek.map((week, index) => {
        const total = week.challenges.length;
        const done = week.challenges.filter((c) =>
          doneIds.includes(c.id)
        ).length;
        const percent = Math.round((done / total) * 100);

        // Check if this theme is locked based on previous theme's completion
        const previousWeek = index > 0 ? challengesByWeek[index - 1] : null;
        const previousDone = previousWeek
          ? previousWeek.challenges.filter((c) => doneIds.includes(c.id)).length
          : UNLOCK_THRESHOLD;
        const isLocked = previousDone < UNLOCK_THRESHOLD;
        const remaining = UNLOCK_THRESHOLD - previousDone;

        return (
          <section
            key={week.week}
            className={`week-section${isLocked ? " week-section--locked" : ""}`}
          >
            <h2>{week.title}</h2>

            <div className="progress-container">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="progress-label">
                {done} von {total} erledigt
              </span>
            </div>
            {isLocked && (
              <div className="unlock-hint">
                🔒 Noch {remaining} Challenge{remaining !== 1 ? "s" : ""} im
                vorherigen Thema bis zur Freischaltung
              </div>
            )}

            {week.challenges.map((challenge) => {
              const isDone = doneIds.includes(challenge.id);
              const isCommitted = activeCommitment?.challengeId === challenge.id;

              if (isLocked) {
                return (
                  <div key={challenge.id} className="card card--locked">
                    {challenge.title}
                  </div>
                );
              }
              return (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={handleChallengeClick}
                >
                  <div
                    className={`card${isCommitted ? " card--committed" : ""}`}
                    style={{
                      textDecoration: isDone ? "line-through" : "none",
                      opacity: isDone ? 0.5 : 1,
                    }}
                  >
                    {isCommitted && (
                      <span className="committed-indicator">🎯 </span>
                    )}
                    {challenge.title}
                  </div>
                </Link>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

export default ChallengeOverview;
