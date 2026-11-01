# Testing Guide

`npm test` runs Vitest engine, JSON profile/store and version-tool tests. Coverage
includes momentum/rotation, toroidal boundaries, firing cadence/lifetime,
splitting and score, next-wave transition, extra lives, invulnerability/game over,
pause, deterministic stepping, responsive field dimensions, strict versioned
imports, serialized atomic writes/corrupt-file backup and patch/minor/major bumps
in disposable projects without touching vendor versions.

Start `npm run dev`, then run `npm run test:smoke`. Playwright tests launch/help,
settings persistence after reload, F fullscreen toggle, movement/rotation/fire,
pause/resume, inline-panel pause/Escape, pointer control release, natural game
over, saved run, JSON download/import/rejection, restart and compact/mobile width.
Screenshots are written outside the repo under the OS temp stroids-qa directory.

`npm run build && npm run test:desktop` runs Electron against the actual built
renderer using stroids://app/. It checks sandbox/context isolation/absence of
Node, named IPC validation, JSON disk persistence and relaunch, import/export
through dialog response stubs, gameplay, window controls and popup denial.
Each launch has an isolated STROIDS_DATA_DIR. Dialog stubs verify the operation's
file IO and UI flow; the OS file chooser itself remains a manual check.

`npm run package && npm run test:installer` installs into a verified temporary
folder with no shortcuts, runs the installed executable smoke suite and uninstalls.
It refuses to proceed if a normal STROIDS installation is already registered.
Set STROIDS_EXECUTABLE to a packaged EXE for `npm run test:desktop` directly.

The develop-web-game skill client is also run with short arrow/Space bursts.
`window.render_game_to_text()` reports coordinates, mode, ship position/velocity,
rocks, bullets, score, wave, lives and cooldowns. `window.advanceTime(ms)` switches
the current page to deterministic manual stepping (reload restores real time).
There are no test-only state mutation hooks. Unit tests exercise precise collision
arrangements; browser smoke exercises natural collisions through game over.

Visual review uses the concept at docs/design/stroids-concept.png and screenshots
at native 1536×1024, compact 900×680, and 390×844. The current session's browser
access host and native pipe were unavailable, so local Playwright Chromium was
the verified fallback. See docs/design/visual-review.md and docs/manual-qa.md.
