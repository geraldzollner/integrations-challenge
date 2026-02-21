import { Link } from "react-router-dom";
import { useEffect } from "react";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";

function ChallengeOverview() {
  const doneIds = getDoneChallenges();

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
      {challengesByWeek.map((week) => {
        const total = week.challenges.length;
        const done = week.challenges.filter((c) =>
          doneIds.includes(c.id)
        ).length;
        const percent = Math.round((done / total) * 100);

        return (
          <section key={week.week} className="week-section">
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
            {week.challenges.map((challenge) => {
              const done = doneIds.includes(challenge.id);
              return (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={handleChallengeClick}
                >
                  <div
                    className="card"
                    style={{
                      textDecoration: done ? "line-through" : "none",
                      opacity: done ? 0.5 : 1,
                    }}
                  >
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
