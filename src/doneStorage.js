export function getDoneChallenges() {
  const stored = localStorage.getItem("doneChallenges");
  return stored ? JSON.parse(stored) : [];
}

export function markChallengeDone(id) {
  const done = getDoneChallenges();
  if (!done.includes(id)) {
    const updated = [...done, id];
    localStorage.setItem("doneChallenges", JSON.stringify(updated));
  }
}

export function isChallengeDone(id) {
  const done = getDoneChallenges();
  return done.includes(id);
}
