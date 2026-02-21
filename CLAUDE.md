# Integrations-Challenge — Project Context

## What this app is
A mobile-first, German-language challenge tracker to help people build social connections and integrate into their community. Users work through weekly challenges (e.g. "start a conversation with a stranger"), mark them as done, and track progress per week.

## Tech stack
- **React 19** + **React Router DOM 7** (client-side routing)
- **Vite 7** (build tool)
- **No UI library** — custom CSS only (styles.css)
- **Deployed on Vercel** — `vercel.json` contains SPA rewrite rule

## Project structure
```
src/
  App.jsx              # Route definitions (/ and /challenge/:id)
  ChallengeOverview.jsx # Week list + progress bars + challenge cards
  ChallengeDetail.jsx  # Single challenge view + "mark as done" button
  challenges.js        # All challenge data (static, exported as challengesByWeek)
  doneStorage.js       # localStorage helpers: getDoneChallenges, markChallengeDone, isChallengeDone
  styles.css           # Full design system (see below)
  main.jsx             # App entry point
```

## Data model
Challenges live in `challenges.js` as a static array of week objects:
```js
{ week: "Woche 1", title: "Soziale Kontakte erweitern", challenges: [...] }
```
Each challenge has: `id` (e.g. `w1c1`), `title`, `displayTitle` (with emoji), `description`, `guidance`.

Done state is persisted in **localStorage** as a JSON array of completed IDs.
Scroll position is saved in **sessionStorage** when navigating to a detail page and restored on back navigation.

## Design system (styles.css)
- **Font**: Inter (Google Fonts)
- **Max page width**: 452px, centered
- **Background**: `#f8f8f8`
- **CSS variables**: `--page-width`, `--space` (24px), `--radius` (18px), `--font-app-title` (32px), `--font-section-title` (24px), `--font-body` (16px)
- **Cards**: `.card` (white, border `#e8e8e8`) / `.card-soft` (background `#f7f7f7`, no border)
- **Primary button**: `rgb(241, 78, 78)` red, full width, rounded (22px radius)
- **Progress bar**: track `#e0e0e0`, fill `#4caf50` green, 8px height, animated width

## Content language
All UI text and challenge content is in **German**. New challenges or UI copy should follow the same tone: warm, encouraging, action-oriented.

## Currently implemented
- Week overview with per-week progress bar (done / total)
- Challenge detail page with description and guidance ("Tip")
- Mark challenge as done (persisted in localStorage)
- Completed challenges shown with strikethrough + reduced opacity
- Scroll position restored on back navigation

## Weeks of content
- **Woche 1** — "Soziale Kontakte erweitern" (10 challenges)
- **Woche 2** — "Teilhabe am Gemeinschaftsleben" (10 challenges)
- More weeks can be added by extending the `challengesByWeek` array in `challenges.js`

## Dev commands
```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

## Deployment
Deployed on **Vercel**. Push to main or run `vercel --prod` to deploy.
The `vercel.json` rewrites all routes to `index.html` for client-side routing.

## Working style preferences
- Owner has a PM background — user stories and Figma links are good inputs
- Figma MCP is available in Claude Code for direct design imports
- Keep changes focused and incremental; ask before large refactors
