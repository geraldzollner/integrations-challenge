import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { markChallengeDone, isChallengeDone, getDoneChallenges } from "./doneStorage";
import {
  getChallengeCommitment,
  commitChallenge,
  clearCommitment,
  isCommitmentOverdue,
} from "./commitStorage";

const UNLOCK_THRESHOLD = 7;

const TIMEFRAMES = [
  { key: "today", label: "Heute", days: 0 },
  { key: "3days", label: "In 3 Tagen", days: 3 },
  { key: "week", label: "In einer Woche", days: 7 },
];

function getDeadlineLabel(timeframe) {
  const tf = TIMEFRAMES.find((t) => t.key === timeframe);
  if (!tf) return "";
  const date = new Date();
  date.setDate(date.getDate() + tf.days);
  return date.toLocaleDateString("de-DE", { weekday: "long" });
}

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allChallenges = challengesByWeek.flatMap((week) => week.challenges);
  const challenge = allChallenges.find((c) => c.id === id);

  const [picking, setPicking] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("3days");
  const [commitment, setCommitment] = useState(() =>
    challenge ? getChallengeCommitment(challenge.id) : null
  );

  if (!challenge) {
    return (
      <div className="page">
        <p>Challenge nicht gefunden.</p>
      </div>
    );
  }

  // Guard: check if this challenge's theme is locked
  const themeIndex = challengesByWeek.findIndex((w) =>
    w.challenges.some((c) => c.id === id)
  );
  if (themeIndex > 0) {
    const previousTheme = challengesByWeek[themeIndex - 1];
    const doneIds = getDoneChallenges();
    const previousDone = previousTheme.challenges.filter((c) =>
      doneIds.includes(c.id)
    ).length;
    if (previousDone < UNLOCK_THRESHOLD) {
      return (
        <div className="page">
          <button className="button-back" onClick={() => navigate(-1)}>
            ← Zurück
          </button>
          <div className="card-soft" style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
            <p style={{ fontWeight: 600, marginBottom: "8px" }}>Noch nicht freigeschaltet</p>
            <p style={{ color: "#888" }}>
              Erledige {UNLOCK_THRESHOLD} Challenges aus „
              {previousTheme.title}" um dieses Thema freizuschalten.
            </p>
          </div>
        </div>
      );
    }
  }

  const done = isChallengeDone(challenge.id);
  const overdue = isCommitmentOverdue(commitment);

  const handleDone = () => {
    markChallengeDone(challenge.id);
    clearCommitment();
    navigate("/");
  };

  const handleCommit = () => {
    commitChallenge(challenge.id, selectedTimeframe);
    setCommitment(getChallengeCommitment(challenge.id));
    setPicking(false);
  };

  return (
    <div className="page">
      <button className="button-back" onClick={() => navigate(-1)}>
        ← Zurück
      </button>
      <div className="card-soft">
        <h2>{challenge.displayTitle}</h2>
      </div>
      <div className="card">
        <p>{challenge.description}</p>
      </div>
      {challenge.guidance && (
        <div className="card-soft">
          <h3>Tipp</h3>
          <p>{challenge.guidance}</p>
        </div>
      )}

      {/* DONE */}
      {done && (
        <button className="button-primary" disabled>
          Erledigt ✓
        </button>
      )}

      {/* COMMITTED – overdue */}
      {!done && commitment && overdue && (
        <>
          <div className="committed-badge committed-badge--overdue">
            <span className="committed-badge__icon">⚠️</span>
            <span className="committed-badge__text">
              Frist abgelaufen – trotzdem erledigt?
            </span>
          </div>
          <button className="button-primary" onClick={handleDone}>
            Als erledigt markieren
          </button>
          <button
            className="button-primary button-primary--ghost"
            onClick={() => { clearCommitment(); setPicking(true); }}
          >
            Neu committen
          </button>
        </>
      )}

      {/* COMMITTED – on track */}
      {!done && commitment && !overdue && (
        <>
          <div className="committed-badge">
            <span className="committed-badge__icon">🎯</span>
            <span className="committed-badge__text">
              {commitment.timeframe === "today"
                ? "Ich mache das – heute!"
                : `Ich mache das – bis ${getDeadlineLabel(commitment.timeframe)}!`}
            </span>
          </div>
          <button className="button-primary" onClick={handleDone}>
            Als erledigt markieren
          </button>
        </>
      )}

      {/* DEFAULT / PICKING */}
      {!done && !commitment && (
        <>
          {!picking ? (
            <>
              <button
                className="button-primary"
                onClick={() => setPicking(true)}
              >
                Ich mache diese Challenge! 🎯
              </button>
              <button
                className="button-primary"
                disabled
                style={{ marginTop: "8px" }}
              >
                Als erledigt markieren
              </button>
            </>
          ) : (
            <div className="card" style={{ marginTop: "12px", marginBottom: 0 }}>
              <p style={{ fontWeight: 600, marginBottom: "12px" }}>
                Bis wann möchtest du die Challenge erledigen?
              </p>
              <div className="timeframe-options">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.key}
                    className={`timeframe-chip${
                      selectedTimeframe === tf.key
                        ? " timeframe-chip--selected"
                        : ""
                    }`}
                    onClick={() => setSelectedTimeframe(tf.key)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
              <button
                className="button-primary"
                onClick={handleCommit}
                style={{ marginTop: "16px" }}
              >
                Akzeptieren
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ChallengeDetail;
