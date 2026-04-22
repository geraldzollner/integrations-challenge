const STORAGE_KEY = "activeCommitment";

export function getActiveCommitment() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function isCommitmentOverdue(commitment) {
  if (!commitment) return false;
  const committed = new Date(commitment.committedAt);
  const deadline = new Date(committed);

  if (commitment.timeframe === "today") {
    // expires at midnight of the day it was committed
    deadline.setHours(23, 59, 59, 999);
  } else {
    const days = commitment.timeframe === "3days" ? 3 : 7;
    deadline.setDate(deadline.getDate() + days);
    deadline.setHours(23, 59, 59, 999);
  }

  return Date.now() > deadline.getTime();
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
