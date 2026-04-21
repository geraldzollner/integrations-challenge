const STORAGE_KEY = "committedChallenges";

export function getCommittedChallenges() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function commitChallenge(id, timeframe) {
  const committed = getCommittedChallenges();
  committed[id] = {
    timeframe,
    committedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(committed));
}

export function getChallengeCommitment(id) {
  return getCommittedChallenges()[id] || null;
}
