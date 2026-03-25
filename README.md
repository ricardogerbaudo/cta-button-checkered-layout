# Colonist - Checkered CTA Button Layout

A/B test variant for colonist.io's landing page CTAs. Two buttons in a checkered (diagonal) grid layout, replacing the current stacked "Play with Friends" / "Play Online" buttons.

**Live demo:** [GitHub Pages](https://ricardogerbaudo.github.io/cta-button-checkered-layout/)

## Completion time

~3 hours

## AI usage

Code was written with Claude (Anthropic). I made all design decisions, reviewed every line, and verified the output across devices. Claude helped with:

- Writing HTML/SCSS/JS and iterating on responsive breakpoints
- Inspecting colonist.io's DOM for font and element choices
- Discovering the two separate APIs by probing endpoints:
  - `/api/room-list.json` (lobby rooms with open slots) for Quick Play
  - `/api/game-list.json` (active games in progress) for Watch Live
- Investigating the Spectate tab's click behavior via Chrome DevTools to confirm game IDs (e.g., `#217567276`) come from the game-list API

I also fed Claude the Colonist values and communication guidelines to align code comments and decisions with company standards.

## Decisions

### 1. Starter code fixes

- Duplicate `<html>` tags, SCSS inside `<style>` (browsers can't parse it)
- `position: absolute` + magic pixels (100px, 50px) -> CSS Grid + responsive units
- Four separate `border-radius` lines -> single shorthand
- Redundant hover re-declarations, irrelevant `$blue` variables
- `<div>` elements -> `<button>` elements (see point 4)
- Added button text, subtitles, click handlers, consistent 2-space indent

### 2. Layout

I chose CSS Grid for the checkered pattern.

- `grid-column`/`grid-row` places buttons at (1,1) and (2,2) naturally
- No empty placeholder divs needed; Grid creates the gaps implicitly
- Mobile (<=700px): single column, staggered left/right alignment
- Very narrow (<=400px): centered, full-width

### 3. Fonts

Madcap for titles, Open Sans for subtitles.

- Madcap matches the reference design and colonist.io's brand
- Open Sans is colonist.io's primary font (verified via DevTools)
- Typekit CSS added as External Resource in JSFiddle: `https://use.typekit.net/dfe0lwq.css`

### 4. Elements

I used `<button>` instead of `<div>` or `<a>`.

- Both CTAs fetch data from an API before navigating, making them actions, not simple links. `<button>` is the correct semantic element.
- Colonist.io uses `<a>` without `href` (verified via DevTools), but that's an accessibility anti-pattern. `<button>` gives native keyboard support, screen reader semantics, and focus handling for free.

### 5. API integration

Two different APIs for two different actions:

| Button | API | Logic | Fallback |
|--------|-----|-------|----------|
| Quick Play | `/api/room-list.json` | Picks a random visible room with open slots and at least one human | Creates a new room with a random code |
| Watch Live | `/api/game-list.json` | Picks a random game with 2+ human players to spectate | Redirects to the lobby page |

**CORS handling:** The APIs don't set `Access-Control-Allow-Origin` headers. `fetchAPI()` tries the direct URL first (works on colonist.io), then retries through a CORS proxy (`corsproxy.io`) for cross-origin contexts like JSFiddle or GitHub Pages.

I discovered these APIs by probing endpoints and inspecting the Spectate tab's navigation behavior (`colonist.io/#gameId`).

### 6. JSFiddle limitations

- API calls work from JSFiddle via CORS proxy (verified).
- Navigation to `colonist.io/#roomId` requires authentication. Since JSFiddle runs in a sandboxed iframe, Google OAuth popups are blocked.
- This is a non-issue in production: the A/B test runs on colonist.io where users are already authenticated.

### 7. Hover effects

Scale + glow + brightness, three complementary effects:

- Hover: `scale(1.03)`, colored `box-shadow`, `brightness(1.08)`
- Active: `scale(0.98)` for press feedback
- Focus-visible: 2px white outline for keyboard users
- All transitions: `0.2s ease-out`

## Files

| File | Purpose |
|------|---------|
| `index.html` | Local preview (compiled CSS + inline JS) |
| `jsfiddle-html.html` | JSFiddle HTML panel |
| `jsfiddle-style.scss` | JSFiddle SCSS panel |
| `jsfiddle-script.js` | JSFiddle JS panel |
