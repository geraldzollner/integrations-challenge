import { useState } from "react";
import {
  getHabits,
  removeHabit,
  isCheckedInToday,
  checkInToday,
  getStreak,
  getLast7Days,
} from "./habitStorage";

function HabitCard({ habit, onCheckin, onRemove }) {
  const checkedToday = isCheckedInToday(habit.id);
  const streak = getStreak(habit.id);
  const last7 = getLast7Days(habit.id);

  return (
    <div className="card habit-card">
      <div className="habit-card__header">
        <span className="habit-card__title">{habit.displayTitle}</span>
        <button
          className="habit-card__remove"
          onClick={() => onRemove(habit.id)}
          aria-label="Entfernen"
        >
          ×
        </button>
      </div>

      <div className="habit-dots">
        {last7.map((day) => (
          <div
            key={day.date}
            className={`habit-dot${day.done ? " habit-dot--done" : ""}`}
            title={day.date}
          />
        ))}
      </div>

      <div className="habit-card__footer">
        {streak > 0 && (
          <span className="habit-streak">🔥 {streak} Tag{streak !== 1 ? "e" : ""} in Folge</span>
        )}
        <button
          className={`button-primary habit-checkin${checkedToday ? " habit-checkin--done" : ""}`}
          onClick={() => onCheckin(habit.id)}
          disabled={checkedToday}
        >
          {checkedToday ? "Heute erledigt ✓" : "Heute erledigt"}
        </button>
      </div>
    </div>
  );
}

function Habits() {
  const [habits, setHabits] = useState(() => getHabits());
  const [, forceUpdate] = useState(0);

  const handleCheckin = (id) => {
    checkInToday(id);
    forceUpdate((n) => n + 1);
  };

  const handleRemove = (id) => {
    removeHabit(id);
    setHabits(getHabits());
  };

  return (
    <div className="page">
      <h1>Gewohnheiten</h1>
      {habits.length === 0 ? (
        <div className="card-soft" style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🌱</div>
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Noch keine Gewohnheiten</p>
          <p style={{ color: "#888" }}>
            Wenn du eine Challenge erledigst, kannst du sie als Gewohnheit hinzufügen.
          </p>
        </div>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onCheckin={handleCheckin}
            onRemove={handleRemove}
          />
        ))
      )}
    </div>
  );
}

export default Habits;
