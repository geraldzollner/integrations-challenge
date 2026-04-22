import { Routes, Route, NavLink } from "react-router-dom";
import ChallengeOverview from "./ChallengeOverview";
import ChallengeDetail from "./ChallengeDetail";
import Habits from "./Habits";
import WelcomeModal from "./WelcomeModal";
import "./styles.css";

function TabBar() {
  return (
    <nav className="tab-bar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `tab-bar__item${isActive ? " tab-bar__item--active" : ""}`}
      >
        <span className="tab-bar__icon">🎯</span>
        <span className="tab-bar__label">Challenges</span>
      </NavLink>
      <NavLink
        to="/habits"
        className={({ isActive }) => `tab-bar__item${isActive ? " tab-bar__item--active" : ""}`}
      >
        <span className="tab-bar__icon">🔄</span>
        <span className="tab-bar__label">Gewohnheiten</span>
      </NavLink>
    </nav>
  );
}

function App() {
  return (
    <>
      <WelcomeModal />
      <Routes>
        <Route path="/" element={<ChallengeOverview />} />
        <Route path="/challenge/:id" element={<ChallengeDetail />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
      <TabBar />
    </>
  );
}

export default App;
