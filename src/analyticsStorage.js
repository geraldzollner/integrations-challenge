const FIRST_SEEN_KEY = 'analytics_first_seen_at';
const LAST_COMPLETION_KEY = 'analytics_last_completion_at';
const THEMES_OPENED_KEY = 'analytics_themes_opened';

// Returns { ts, isNew } — isNew is true only on the very first call ever
export function initFirstSeen() {
  const existing = localStorage.getItem(FIRST_SEEN_KEY);
  if (existing) return { ts: parseInt(existing, 10), isNew: false };
  const now = Date.now();
  localStorage.setItem(FIRST_SEEN_KEY, String(now));
  return { ts: now, isNew: true };
}

export function getDaysSinceFirstSeen() {
  const val = localStorage.getItem(FIRST_SEEN_KEY);
  if (!val) return 0;
  return Math.floor((Date.now() - parseInt(val, 10)) / 86400000);
}

// Stamps the current time; returns hours since the previous completion (null if none)
export function stampCompletion() {
  const prev = localStorage.getItem(LAST_COMPLETION_KEY);
  localStorage.setItem(LAST_COMPLETION_KEY, String(Date.now()));
  if (!prev) return null;
  return Math.round((Date.now() - parseInt(prev, 10)) / 3600000);
}

// Returns true only the first time this themeIdx is opened
export function recordThemeOpened(themeIdx) {
  const opened = JSON.parse(localStorage.getItem(THEMES_OPENED_KEY) || '[]');
  if (opened.includes(themeIdx)) return false;
  localStorage.setItem(THEMES_OPENED_KEY, JSON.stringify([...opened, themeIdx]));
  return true;
}
