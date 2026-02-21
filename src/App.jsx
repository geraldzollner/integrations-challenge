import { Routes, Route } from "react-router-dom";
import ChallengeOverview from "./ChallengeOverview";
import ChallengeDetail from "./ChallengeDetail";
import "./styles.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChallengeOverview />} />
      <Route path="/challenge/:id" element={<ChallengeDetail />} />
    </Routes>
  );
}

export default App;
