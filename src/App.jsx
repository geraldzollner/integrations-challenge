import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import ChallengeOverview from "./ChallengeOverview";
import ThemeDetail from "./ThemeDetail";
import ChallengeDetail from "./ChallengeDetail";
import Done from "./Done";
import Habits from "./Habits";
import WelcomeModal from "./WelcomeModal";
import "./styles.css";

function TabBar() {
  return (
    <nav className="tab-bar">
      <NavLink to="/" end className={({ isActive }) => `tab-bar__item${isActive ? " tab-bar__item--active" : ""}`}>
        {({ isActive }) => (
          <>
            <span className={`tab-bar__icon-wrap${isActive ? " tab-bar__icon-wrap--active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="2" fill="currentColor" />
              </svg>
            </span>
            <span className="tab-bar__label">Aufgaben</span>
          </>
        )}
      </NavLink>
      <NavLink to="/habits" className={({ isActive }) => `tab-bar__item${isActive ? " tab-bar__item--active" : ""}`}>
        {({ isActive }) => (
          <>
            <span className={`tab-bar__icon-wrap${isActive ? " tab-bar__icon-wrap--active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="4.5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="8.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="tab-bar__label">Routine</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}

function App() {
  const location = useLocation();
  const hideTabs = location.pathname === '/done';

  return (
    <>
      <WelcomeModal />
      <Routes>
        <Route path="/" element={<ChallengeOverview />} />
        <Route path="/theme/:themeIndex" element={<ThemeDetail />} />
        <Route path="/challenge/:id" element={<ChallengeDetail />} />
        <Route path="/done" element={<Done />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
      {!hideTabs && <TabBar />}
    </>
  );
}

export default App;
