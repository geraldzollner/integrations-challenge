import { useState } from "react";

const STORAGE_KEY = "onboarding_seen";

const PAGES = [
  {
    emoji: "🌍",
    title: "Willkommen zur Integrations-Challenge!",
    body: (
      <>
        <p className="modal-body">
          Diese App begleitet dich dabei, im DACH-Raum Fuß zu fassen – mit
          konkreten Alltagsaufgaben, die dir helfen, neue Kontakte zu knüpfen
          und am gesellschaftlichen Leben teilzuhaben.
        </p>
        <p className="modal-body modal-body--spaced">
          Du findest Challenges zu verschiedenen Themen. Klicke eine Challenge
          an, lies den Tipp – und hak sie ab, sobald du sie erledigt hast. So
          einfach ist das. 😊
        </p>
      </>
    ),
    button: "Weiter →",
  },
  {
    emoji: "💪",
    title: "Ein Hinweis vorab",
    body: (
      <p className="modal-body">
        Ein gewisses Maß an Unsicherheit und Nervosität gehört dazu – das ist
        normal und kein Zeichen, dass etwas falsch läuft. Es bedeutet nur, dass
        du dich wirklich auf das Leben einlässt.
      </p>
    ),
    button: "Los geht's →",
  },
];

function WelcomeModal() {
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  );

  if (!visible) return null;

  const current = PAGES[page];
  const isLast = page === PAGES.length - 1;

  function handleNext() {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, "true");
      setVisible(false);
    } else {
      setPage(page + 1);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-dots">
          {PAGES.map((_, i) => (
            <div key={i} className={`modal-dot${i === page ? " modal-dot--active" : ""}`} />
          ))}
        </div>
        <div className="modal-emoji">{current.emoji}</div>
        <h2 className="modal-title">{current.title}</h2>
        {current.body}
        <button className="button-primary" onClick={handleNext}>
          {current.button}
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;
