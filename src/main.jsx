import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import posthog from "posthog-js";
import App from "./App";

posthog.init("phc_yd2AiEQmoxJACrKwZiKfa9ToVyRUh6LsWzgv8C4CtCfw", {
  api_host: "https://eu.i.posthog.com",
  capture_pageview: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
