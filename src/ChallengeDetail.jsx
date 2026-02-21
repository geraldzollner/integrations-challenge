import { useParams, useNavigate } from "react-router-dom";
import { challengesByWeek } from "./challenges";
import { markChallengeDone, isChallengeDone } from "./doneStorage";

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allChallenges = challengesByWeek.flatMap((week) => week.challenges);
  const challenge = allChallenges.find((c) => c.id === id);

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
          <h3>Tip</h3>
          <p>{challenge.guidance}</p>
        </div>
      )}
      <button className="button-primary" onClick={handleDone} disabled={done}>
        {done ? "Erledigt ✓" : "Als erledigt markieren"}
      </button>
    </div>
  );
}

export default ChallengeDetail;
