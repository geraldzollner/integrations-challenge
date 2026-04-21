const STORAGE_KEY = "activeCommitment";

export function getActiveCommitment() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
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
