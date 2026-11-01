# STROIDS

A little ship. A lot of space.

An independent asteroid arcade homage built for offline Windows desktop. Turn,
thrust, drift and shoot through an endless belt. Large rocks split into smaller
ones, each cleared wave gets faster, and your best runs stay on your device.
Original line art, branding and synthesized audio give the familiar mechanics a
new identity. This project is not affiliated with the creators of Asteroids.

## Play

Run `dist/desktop/STROIDS-win32-x64/STROIDS.exe`, or install
`dist/STROIDS-Setup-<version>.exe`. Installation is per-user and needs no administrator
account. This initial local build is unsigned.

- Enter: launch or play again.
- Left / right or A / D: rotate. Up or W: thrust. Space: fire (hold to repeat).
- P / Escape: pause or resume. F: toggle fullscreen. Escape exits fullscreen.
- Enable on-screen controls in Settings for touch input.

You start with three ships. Large / medium / small rocks award 20 / 50 / 100
points. Earn another ship every 10,000 points. Space wraps at every edge.

## Develop

Requires Windows, Node.js 22.12+ (validated with Node 24), npm, and Inno Setup 6
for installers. No account, API key or runtime service is required.

```powershell
npm ci
npm run dev            # browser preview at http://127.0.0.1:5173
npm run dev:desktop    # Vite + Electron
npm run build          # renderer and Electron compilation
npm start              # built desktop app
npm test
npm run test:smoke     # requires npm run dev in another terminal
npm run test:desktop   # requires npm run build
npm run package        # portable app + Inno Setup installer under dist/
npm run deploy:check
npm run test:installer # isolated install/start/uninstall; refuses existing install
```

Install the test browser with `npx playwright install chromium` if needed.
`ISCC_PATH` can identify an Inno Setup compiler outside its standard location.

## Local data

Windows desktop uses `%APPDATA%/STROIDS/profile.json`, with a separate
`window.json` for layout. Files stay outside the application and survive upgrades
and uninstall. The flight log stores the latest 100 completed runs. Settings
persist immediately. Browser preview has a separate localStorage profile.

Flight Log exports and imports versioned JSON including settings. Invalid files
are rejected; valid imports require an explicit replacement action. Export first
to retain a backup. Unreadable desktop profiles are preserved in a `.bak` file.

## Project record

Read [the user guide](docs/user/UserGuide.md), [build guide](docs/developer/build.md),
[testing guide](docs/developer/testing.md) and [active plan](docs/planning/To-do.md).
The game implementation is in `src/game/`, React surfaces in `src/components/`,
the trusted desktop boundary in `electron/`, and shared JSON rules in `shared/`.
`dist/` is the only distribution boundary; `build/` and `.tmp/` are intermediates.

```powershell
npm run todo
npm run version:show
npm run handoff
```

The application version is synchronized across package.json, root lock metadata, VERSION
and installer/stroids.iss. Commit requests default to a patch bump. Release
signing, publisher metadata and first-party licensing remain release decisions;
no publication or remote deployment has been performed. Bundled third-party
licenses must accompany distributions.
