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
