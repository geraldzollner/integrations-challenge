import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import posthog from "posthog-js";
import { challengesByWeek } from "./challenges";
import { getDoneChallenges } from "./doneStorage";
import { initFirstSeen } from "./analyticsStorage";
import App from "./App";

posthog.init("phc_yd2AiEQmoxJACrKwZiKfa9ToVyRUh6LsWzgv8C4CtCfw", {
  api_host: "https://eu.i.posthog.com",
  capture_pageview: true,
});

const { ts: firstSeenAt, isNew: isFirstSession } = initFirstSeen();
const daysSince = Math.floor((Date.now() - firstSeenAt) / 86400000);
const doneIds = getDoneChallenges();
const totalCompleted = doneIds.length;
const themesTouched = challengesByWeek.filter((w) =>
  w.challenges.some((c) => doneIds.includes(c.id))
).length;

posthog.capture("app_opened", {
  is_first_session: isFirstSession,
  days_since_first_seen: daysSince,
  total_challenges_completed: totalCompleted,
  themes_touched: themesTouched,
});

posthog.setPersonProperties({
  first_seen_at: new Date(firstSeenAt).toISOString(),
  total_challenges_completed: totalCompleted,
  themes_touched: themesTouched,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
