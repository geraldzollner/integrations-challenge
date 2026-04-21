const STORAGE_KEY = "activeCommitment";

const TIMEFRAME_DAYS = { today: 1, "3days": 3, week: 7 };

export function getActiveCommitment() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function isCommitmentOverdue(commitment) {
  if (!commitment) return false;
  const days = TIMEFRAME_DAYS[commitment.timeframe] ?? 1;
  const deadline = commitment.committedAt + days * 24 * 60 * 60 * 1000;
  return Date.now() > deadline;
}

export function commitChallenge(id, timeframe) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ challengeId: id, timeframe, committedAt: Date.now() })
  );
}

export function getChallengeCommitment(id) {
  const active = getActiveCommitment();
  return active?.challengeId === id ? active : null;
}

export function clearCommitment() {
  localStorage.removeItem(STORAGE_KEY);
}
