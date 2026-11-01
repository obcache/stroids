# Project Handoff

Generated: 2026-11-01T11:44:50.209Z

## Summary

Complete: STROIDS playable desktop game, original art/audio, local JSON profile, portable build and unsigned Inno installer. Final 17 tests, browser workflow, desktop workflow, installed-app smoke/uninstall, checksum and zero-vulnerability audit pass. dist rebuilt; initial schema 1, no database migrations, commit or publication. See docs/design/visual-review.md and docs/manual-qa.md for deliberate visual differences and human release checks.

## Current Branch

main

## Working Tree

M .env.example
 M .gitignore
 M AGENTS.md
 M README.md
 M docs/PROJECT_FOUNDATION.md
 M docs/dev-ledger.md
 M docs/developer/build.md
 M docs/developer/deployment.md
 M docs/developer/handoff.md
 M docs/developer/testing.md
 M docs/developer/versioning.md
 M docs/developer/workflow.md
 M docs/manual-qa.md
 M docs/planning/To-do.md
 M docs/user/UserGuide.md
 M package.json
 M tools/project-mgmt/foundation.json
 M tools/project-mgmt/manifest.json
 M tools/project-mgmt/version-show.js
 M tools/project-mgmt/version-sync.js
?? .prettierrc.json
?? docs/design/
?? docs/handoffs/
?? electron/
?? index.html
?? installer/
?? package-lock.json
?? progress.md
?? public/
?? shared/
?? src/
?? tests/
?? tools/build/
?? tools/testing/
?? tsconfig.electron.json
?? tsconfig.json
?? vite.config.mts

## Recent Commits

25f7523 chore: bootstrap project foundation

## Foundation

# stroids: Project Foundation

These selections were supplied through Reponator's creation wizard. They define
the implementation environment. The user's feature request supplies application
functionality. Scaffolding these decisions does not implement an application or login.

## Application and delivery

- stack: Electron / React / Vite / TypeScript
- platform: Windows desktop
- deployment: Desktop distribution
- packaging: Windows installer (Inno Setup)
- connectivity: Offline-first / local operation

## UX and branding

- theme: High contrast
- density: Touch-friendly
- layout: Arcade gameplay workflow (user's first functional request)
- primarySurface: Canvas flight arena with inline help, flight log and settings
- overlays: Inline expand / collapse
- chrome: Custom themed titlebar and window controls
- scrollbars: Themed scrollbars and form controls
- tray: No tray integration
- branding: Create logo, app and launcher icons
- iconStates: Single application icon
- visualStyle: Expressive branded controls
- settings: Persist settings and workspace layout

## Storage and data exchange

- storage: Local JSON files
- interchange: Versioned JSON import / export

## Users and access

- users: Single user
- authentication: No application login
- authorization: No role system
- adminSetup: No administrator account

## Verification

- testing: Unit + integration + key workflow smoke tests

## Implemented Product

STROIDS is an independent asteroid arcade homage. Original generated line-art
sprites, an original ship mark and synthesized sound accompany momentum-based
flight, wraparound space, rock splitting, waves, score chasing and three lives.
The game request supersedes the creation wizard's generic form-first workspace.
No login, administrator bootstrap, credentials, server or tray are required.

Electron loads local bundled files through `stroids://app/`. The renderer is
sandboxed with context isolation and no Node access. Named preload operations
validate IPC senders and JSON at the main-process boundary. Network access and
new browser windows are blocked. Fonts and art are bundled for offline use.

Profiles use schema version 1 JSON in Electron's userData directory, outside
dist/. A separate window.json records dimensions and maximize state. Browser
preview uses localStorage instead. Import validates before showing a replacement
confirmation; export preserves settings and the latest 100 completed runs.

## Administrator Bootstrap (Not Applicable)

- Initial admin username / identity: Not applicable
- Credentials: No bootstrap password is stored.
- No authentication or enrollment code is present or required by this product.

## Delivery And Data Boundaries

Use package.json as the command surface and dist/ as the distribution boundary.
Keep mutable user data outside the installed application. Use migrations for
relational data, and test backup/restore. Shared databases live behind a trusted
server API; desktop/browser clients must not contain database credentials.
Electron implementations isolate the renderer from Node with a typed preload
bridge and validated IPC. Any settings, tray, icon and overlay decisions above
are foundation preferences; feature-specific behavior comes from the user request.

## Additional User Constraints

- Independent respectful homage to the retro game Asteroids; no reused original
  artwork, logos, recordings or claim of affiliation.
- First release is Windows x64, with an unsigned per-user Inno Setup installer.

## Implementation Handoff

1. Read AGENTS.md and the startup documents before designing application behavior.
2. Implement the user's functional request within this foundation.
3. Replace failing build/test/package placeholders with real stack commands.
4. Once the source layout is settled, review package.json, manifest.json, foundation,
   planning and all docs; reconcile paths, dependencies and runtime assumptions.
5. Adapt version-sync.js/version-show.js to the real stack-specific version files,
   excluding third-party modules and libraries. Test patch/minor/major behavior.
6. Record assumptions and validation; update the handoff before context is exhausted.

## Decision Sources

The original example separated Electron/React/Vite/TypeScript, local SQLite, dense
VS Code dark styling, collapsible panels, pinnable in-page previews, custom chrome,
tray lifecycle, logo/icons and state variants from product-specific monitoring rules.
This foundation generalizes those environmental decisions. It does not seed the
example application's features or its transcript.

Selection guidance: [Electron security](https://www.electronjs.org/docs/latest/tutorial/security/),
[SQLite deployment tradeoffs](https://www.sqlite.org/whentouse.html),
[OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).


## Planning Snapshot

# Project Plan And To-Do

This file is the planning mechanism for active work. Keep it current enough that a new developer or a fresh chat session can understand the next move without reconstructing the whole project history.

## Current Objective

- [x] Deliver STROIDS: an original, playable asteroid arcade homage for offline Windows desktop.

## Next Actions

- [x] Design launch/game screen and original assets.
- [x] Implement momentum, wraparound, rock splitting, waves, scores, lives, pause and restart.
- [x] Add keyboard/touch input, audio, JSON profile and versioned import/export.
- [x] Build isolated Electron runtime, custom chrome, icons and Inno Setup package.
- [x] Validate engine, persistence, core workflows, visuals and built desktop artifact.
- [x] Reconcile foundation, manifest, docs and version tooling; run handoff.

## Backlog

- [ ] Gamepad input and additional original game modes.
- [ ] Release signing and public distribution after publisher/licensing decisions.
- [ ] Human listening, physical multi-touch and native chooser/installer visual review before public release.

## Risks And Questions

- Unsigned local Windows builds are expected for this first implementation.
- Game-first surface supersedes the generic scaffold form workspace preference.

## Done

- [x] Initial planning file created.
- [x] First playable build, complete portable Windows app and Inno installer; details in docs/dev-ledger.md.


## Dev Ledger Tail

# Dev Ledger

This ledger is the development journal and changelog source for the project. Use it to preserve decisions, rationale, validation, rollback plans, and handoff context.

## Purpose

- Track meaningful development progress before and after commits.
- Preserve why a change was made, not only what changed.
- Keep rollback and follow-up tasks close to the work that created them.
- Provide source material for commit messages, release notes, and session handoffs.

## How To Use

- Add an entry for behavior changes, build changes, dependency updates, infrastructure work, or important investigations.
- Use `Status: Planned`, `Status: Draft`, or `Status: Complete`.
- Set entries to `Complete` when they should be considered ready for commit/release tooling.
- Include validation commands and rollback notes whenever practical.

## Entry Template

### [YYYY-MM-DD] Entry Title (Status: Planned)
Author: <name/initials>

Summary
- What changed and why.

Impact
- Areas/modules: <paths or systems>
- Risk: Low | Medium | High

Validation
- [ ] Command or manual check.

Follow-ups
- [ ] Remaining work.

Rollback Strategy
- How to revert or disable the change.

## Entries

### [2026-11-01] STROIDS first playable Windows build (Status: Complete)
Author: Codex

Summary
- Replaced the application-free scaffold with an original Electron / React / Vite / TypeScript asteroid arcade homage. Momentum, edge wrapping, rock splitting, waves, 20/50/100 scoring, three lives, extra ships, invulnerability, pause and restart are implemented.
- Added original Image Gen line-art ship/rocks, SVG brand/icon and generated multi-size launcher icon; bundled fonts and runtime license notices; synthesized original sound effects. Concept and exact selected prompts live in docs/design/.
- React owns accessible HTML controls, HUD and inline help/log/settings. Canvas owns animation. Keyboard and pointer controls work; deterministic time/text hooks support game testing. Responsive world dimensions preserve geometry on resize.
- Main-process validated IPC owns serialized atomic profile JSON writes and native import/export. Schema 1 imports validate before replacement confirmation. Unreadable profiles retain a backup. Window dimensions/maximize state persist separately. Browser preview uses localStorage.
- Sandbox/context isolation are enabled, renderer Node access is disabled, and a local protocol serves packaged files. Navigation, popups, permissions and external requests are blocked. Fixed main-process local asset fetching after the first desktop smoke test exposed an overly broad request block. Decisions follow Electron's official security/IPC guidance linked from the foundation.
- Added real dev/build/test/package/deploy-check scripts and a per-user Windows x64 Inno installer. Only dist/ is distributable. Changed root build/dist ignore patterns to preserve first-party tools/build scripts.
- Reconciled AGENTS.md, foundation JSON/docs, manifest source/tool/test/asset paths, README, all implementation guides, environment example and user guide against actual files/commands. The user game request replaces the wizard's generic form-first surface. Generic administrator/bootstrap guidance was removed from applicable app documentation.
- Restricted version sync/show to package.json, package-lock root metadata, VERSION and installer/stroids.iss; packaged metadata derives from them. No version bump or commit was requested.

Impact
- Areas/modules: src/, shared/, electron/, public/, installer/, tools/build/, tools/testing/, tests/, package scripts and project records.
- Risk: Medium for a first desktop application; local artifacts are unsigned. No remote publication, service deployment or account changes.
- Persistence: initial profile schema 1; no existing application-data or database migration. Imports of unsupported schemas are rejected.

Validation
- [x] npm test: 17 unit/integration cases, including patch/minor/major synchronization in disposable projects and vendor exclusion.
- [x] npm run build / typecheck and npm run package: rebuilt dist/renderer, complete ASAR portable app and version-matched Inno installer with runtime/font license notices.
- [x] npm run test:smoke: launch/help, settings reload, fullscreen, movement/rotation/fire, pause/resume, inline panels/Escape, pointer release, natural game over, completed-run save, JSON export/import/rejection and restart.
- [x] Required develop-web-game client: repeated arrow/Space bursts, screenshots and state snapshots; no new console errors. Actual screenshots opened with view_image.
- [x] Browser host/native pipe unavailable; Playwright Chromium used at 1536x1024, 900x680 and 390x844. Direct concept/implementation view_image comparison reviewed copy, composition, typography, palette, art, controls and responsive geometry. Corrected dim art, stretched mobile objects and type-scale drift. Intentional differences recorded in docs/design/visual-review.md.
- [x] npm run test:desktop: actual built renderer/protocol, sandbox/preload isolation, validated JSON IPC, disk save/reload/relaunch, dialog-backed import/export with deterministic dialog response stubs, gameplay/pause, maximize/restore and popup denial.
- [x] npm run test:installer: temporary no-shortcut per-user install, installed EXE smoke suite and uninstall, with isolated profile and protection for an existing normal install.
- [x] npm run deploy:check: artifact existence/shape and SHA-256 installer checksum.
- [x] npm audit: zero vulnerabilities after compatible build-tool dependency overrides.
- [x] npm run version:show / version:sync and Git whitespace review; manifest inventories checked against disk. Runtime data and QA screenshots are outside artifacts/committed docs.

Follow-ups
- [ ] Public-release publisher/licensing/signing decisions, gamepad support or new modes only when requested.
- [ ] Human acoustic, physical multi-touch, native file chooser and interactive installer visual checks remain in docs/manual-qa.md. Automation verifies their program flows, not physical presentation or listening.

Rollback Strategy
- Restore the prior source scaffold from Git and remove newly added app/tool files, or retain the previous complete dist build for a binary rollback. Keep the user's external profile directory untouched; export schema 1 JSON before manual data changes. No database rollback is required.

### [2026-11-01] Initial Project Bootstrap (Status: Complete)
Author: reponator

Summary
- Created the initial project-management, documentation, handoff, and versioning scaffold.

Impact
- Areas/modules: docs, tools/project-mgmt, package.json
- Risk: Low

Validation
- [ ] Run `npm run version:show`.
- [ ] Run `npm run handoff`.

Follow-ups
- [ ] Replace README outline text with project-specific content.
- [ ] Add build, test, and deployment commands once the application stack is chosen.
- [ ] After choosing the application stack, update version tooling for all real version locations.
- [ ] Reconcile package.json, manifest.json, foundation and docs once the structure is finalized.

Rollback Strategy
- Revert the initial scaffold commit or remove generated workflow files.

## Changelog

Committed ledger entries can be moved here by project tooling.

## Rollback Task Template

### Rollback: <Title/ID>

Prereqs
- Current branch/commit: <ref>
- Backups/snapshots: <paths or links>

Steps
- [ ] Step 1.
- [ ] Step 2.

Verification
- [ ] Build/test pass: <commands>
- [ ] Manual checks: <list>

Restore Plan
- Outline how to recover if the rollback fails.


## Next Session

Read AGENTS.md and its startup documents. Validate current state before editing.
