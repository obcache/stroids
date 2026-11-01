# Build Guide

## Toolchain

Windows x64, Node 22.12+ and npm; validated on Node 24.11.1. `npm ci` installs
pinned dependencies. Electron 45 downloads its binary on first use. Inno Setup 6
is required for `npm run package`; set ISCC_PATH for a nonstandard compiler.
No credentials or network services are required after dependencies are installed.

## Commands and artifacts

- `npm run dev`: Vite at http://127.0.0.1:5173 (strict port).
- `npm run dev:desktop`: compiles Electron and starts Vite and the desktop app.
- `npm run build:icons`: builds original SVG branding into multi-size ICO and PNG.
- `npm run build:notices`: assembles bundled runtime/font licenses into
  public/THIRD_PARTY_NOTICES.txt for inclusion in renderer and packaged app.
- `npm run typecheck`: checks renderer/shared and desktop TypeScript.
- `npm run build`: icons, license notices, type checking, Vite into dist/renderer and desktop JS
  into build/electron plus build/shared. Both build/ and .tmp/ are intermediate.
- `npm start`: loads the built renderer locally through stroids://app/.
- `npm run preview`: serves the built renderer for browser checks.
- `npm run package`: builds, stages only runtime files in .tmp/package-source,
  creates dist/desktop/STROIDS-win32-x64 with ASAR, compiles the Inno installer
  and validates dist/. It fails explicitly if Inno Setup is unavailable.
- `npm run deploy:check`: checks the renderer, art/icon, desktop EXE/ASAR and
  version-matched installer; emits dist/SHA256SUMS.txt.

All font files and game assets are bundled. Production renderer access to Node
is disabled; typed named preload methods bridge validated profile and window
operations. New windows, navigation, permissions and external network requests
are blocked. Main-process protocol fetches are restricted to the renderer tree.

STROIDS_DATA_DIR overrides the desktop profile directory for isolated tests or a
separate local profile. It is never copied into artifacts. STROIDS_DEV=1 selects
the fixed local Vite origin only in an unpackaged development run.
