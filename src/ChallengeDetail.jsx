import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { markChallengeDone, isChallengeDone } from "./doneStorage";
import {
  getChallengeCommitment,
  commitChallenge,
  updateCommitmentReminder,
} from "./commitStorage";

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

  const done = isChallengeDone(challenge.id);

  const handleDone = () => {
    markChallengeDone(challenge.id);
    window.location.reload();
  };

  const handleCommit = () => {
    commitChallenge(challenge.id, selectedTimeframe);
    setCommitment(getChallengeCommitment(challenge.id));
    setPicking(false);
  };

  const handleToggleReminder = async () => {
    const newEnabled = !commitment.reminderEnabled;
    if (newEnabled && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }
    updateCommitmentReminder(challenge.id, newEnabled);
    setCommitment({ ...commitment, reminderEnabled: newEnabled });
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

      {/* COMMITTED */}
      {!done && commitment && (
        <>
          <div className="committed-badge">
            <span className="committed-badge__icon">🎯</span>
            <span className="committed-badge__text">
              Ich mache das – bis {getDeadlineLabel(commitment.timeframe)}!
            </span>
          </div>
          <div className="reminder-row">
            <span className="reminder-row__label">Erinnerung</span>
            <button
              className={`toggle ${commitment.reminderEnabled ? "toggle--on" : ""}`}
              onClick={handleToggleReminder}
              aria-label="Erinnerung ein/aus"
            />
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
