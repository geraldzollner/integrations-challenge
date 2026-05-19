import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHabits,
  removeHabit,
  isCheckedInToday,
  checkInToday,
  getStreak,
  getLast7Days,
} from "./habitStorage";
import { THEMES } from "./themes";
import ProgressRing from "./components/ProgressRing";

const DAY_LABELS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];

function HabitCard({ habit, onCheckin, onRemove }) {
  const t = THEMES[habit.themeIdx ?? 0];
  const checkedToday = isCheckedInToday(habit.id);
  const streak = getStreak(habit.id);
  const last7 = getLast7Days(habit.id);

  return (
    <div className="habit-card-new">
      <div className="habit-card-new__header">
        <div>
          <div className="habit-card-new__theme-row">
            <div className="habit-card-new__dot" style={{ background: t.color }} />
            <div className="habit-card-new__theme-label" style={{ color: t.deep }}>
              Thema 0{t.num}
            </div>
          </div>
          <div className="habit-card-new__title">{habit.displayTitle || habit.title}</div>
          {streak > 0 && (
            <div className="habit-card-new__streak" style={{ background: t.soft }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M5 0c1 2 3 3 3 5.5A3 3 0 015 9 3 3 0 012 5.5C2 3.5 4 3 5 0z" fill={t.color} />
              </svg>
              <span style={{ color: t.deep }}>{streak} Tage Serie</span>
            </div>
          )}
        </div>
        <button className="habit-card-new__remove" onClick={() => onRemove(habit.id)} aria-label="Entfernen">
          ×
        </button>
      </div>

      <div className="habit-card-new__week">
        {last7.map((day, k) => (
          <div key={day.date} className="habit-card-new__day">
            <div
              className="habit-card-new__day-cell"
              style={{
                background: day.done ? t.color : 'var(--color-bg)',
                border: day.done ? 'none' : '1px solid var(--color-hair)',
              }}
            >
              {day.done && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5L4.5 8L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="habit-card-new__day-label">{DAY_LABELS[k]}</div>
          </div>
        ))}
      </div>

      <button
        className="habit-card-new__checkin"
        onClick={() => onCheckin(habit.id)}
        disabled={checkedToday}
        style={{
          background: checkedToday ? 'var(--color-bg)' : t.color,
          color: checkedToday ? 'var(--color-ink-soft)' : '#fff',
          border: checkedToday ? '1px solid var(--color-hair)' : 'none',
          boxShadow: checkedToday ? 'none' : `0 4px 12px -4px ${t.color}90`,
        }}
      >
        {checkedToday ? (
          <>
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path d="M1 4.5L4.5 8L11 1" stroke="var(--color-ink-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Heute erledigt
          </>
        ) : (
          'Heute abhaken'
        )}
      </button>
    </div>
  );
}

function Habits() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState(() => getHabits());
  const [, forceUpdate] = useState(0);

  const doneToday = habits.filter((h) => isCheckedInToday(h.id)).length;
  const activeT = THEMES[habits[0]?.themeIdx ?? 0];

  const handleCheckin = (id) => {
    checkInToday(id);
    forceUpdate((n) => n + 1);
  };

  const handleRemove = (id) => {
    removeHabit(id);
    setHabits(getHabits());
  };

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div>
          <div className="habits-header__eyebrow">Routinen</div>
          <h1 className="habits-header__title">
            <span style={{ fontStyle: 'italic' }}>Gewohnheiten</span>
          </h1>
        </div>
        <button className="habits-header__close" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1L3 7l6 6" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {habits.length > 0 && (
        <div
          className="habits-summary"
          style={{ background: `linear-gradient(135deg, ${activeT.color} 0%, ${activeT.deep} 100%)` }}
        >
          <div className="habits-summary__ring-decor" />
          <ProgressRing
            size={56}
            stroke={4}
            progress={habits.length > 0 ? doneToday / habits.length : 0}
            fillColor="white"
            trackColor="rgba(255,255,255,0.25)"
          />
          <div>
            <div className="habits-summary__count">
              {doneToday}{' '}
              <span style={{ fontStyle: 'italic', opacity: 0.7 }}>von</span>{' '}
              {habits.length}
            </div>
            <div className="habits-summary__label">Routinen heute erledigt</div>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="card-soft card-centered" style={{ margin: '0 20px' }}>
          <div className="card-centered__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 22V12" stroke="var(--color-ink-mute)" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 12C12 12 8 10 6 6c4 0 6 2 6 6z" stroke="var(--color-ink-mute)" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M12 15C12 15 16 13 18 9c-4 0-6 3-6 6z" stroke="var(--color-ink-mute)" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
          <p className="card-centered__title">Noch keine Gewohnheiten</p>
          <p className="card-centered__text">
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

      <div className="page-bottom-spacer" />
    </div>
  );
}

export default Habits;
