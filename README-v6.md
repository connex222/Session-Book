# The Session Book — V6

V6 adds the first coaching-tool layer to the site: a practical **Session Planner**.

## What is new

- `planner.html` — build a session from the 50-session library using:
  - player numbers
  - total session length
  - main coaching theme
  - level
- Planner builds a four-block rhythm: arrival/warm-up, technical practice, main practice, game/challenge.
- Suggestions are selected from the real 50-session library and weighted for squad size, theme, level and the purpose of each block.
- Sessions are clickable so the coach can inspect the full drill before running it.
- **Shuffle alternatives** rebuilds the plan with different suggestions.
- **Save plan** stores the current plan locally in the browser; no account or server is required.
- **Print session** produces a clean touchline-friendly printout.
- Added a Session Planner link to the homepage and drill pages.
- Retained all V5 features, including Back to top on every page.

## Architecture

The site remains a static GitHub Pages project. No backend, framework or database was introduced. Planner data is generated from the existing session catalogue and stored in `assets/planner-data.js`.

## V6 philosophy

The planner is deliberately a recommendation tool rather than a claim that there is one perfect session for every squad. The coach remains in control and can open, inspect, swap and print any suggested practice.
