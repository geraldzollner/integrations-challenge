import { useState } from "react";

const STORAGE_KEY = "onboarding_seen";

function WelcomeModal() {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  );

  if (!visible) return null;

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-emoji">🌍</div>
        <h2 className="modal-title">Willkommen zur Integrations-Challenge!</h2>
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
        <button className="button-primary" onClick={handleClose}>
          Los geht's →
        </button>
      </div>
    </div>
  );
}

export default WelcomeModal;
