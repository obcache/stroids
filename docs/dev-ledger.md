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
