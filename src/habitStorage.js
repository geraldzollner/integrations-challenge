const HABITS_KEY = "habits";
const CHECKINS_KEY = "habitCheckins";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getHabits() {
  return JSON.parse(localStorage.getItem(HABITS_KEY) || "[]");
}

export function addHabit(challenge) {
  const habits = getHabits();
  if (habits.some((h) => h.id === challenge.id)) return;
  habits.push({
    id: challenge.id,
    title: challenge.title,
    displayTitle: challenge.displayTitle,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function removeHabit(id) {
  const habits = getHabits().filter((h) => h.id !== id);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function isHabit(id) {
  return getHabits().some((h) => h.id === id);
}

function getCheckinMap() {
  return JSON.parse(localStorage.getItem(CHECKINS_KEY) || "{}");
}

export function getCheckins(habitId) {
  return getCheckinMap()[habitId] || [];
}

export function isCheckedInToday(habitId) {
  return getCheckins(habitId).includes(todayStr());
}

export function checkInToday(habitId) {
  const all = getCheckinMap();
  const dates = all[habitId] || [];
  const today = todayStr();
  if (!dates.includes(today)) dates.push(today);
  all[habitId] = dates;
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(all));
}

export function getStreak(habitId) {
  const dates = getCheckins(habitId);
  if (dates.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dates.includes(d.toISOString().slice(0, 10))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast7Days(habitId) {
  const dates = getCheckins(habitId);
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    result.push({ date: str, done: dates.includes(str) });
  }
  return result;
}
