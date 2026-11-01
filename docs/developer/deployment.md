# Deployment Guide

Desktop distribution is the delivery target. `npm run package` creates:

- dist/desktop/STROIDS-win32-x64/ — complete portable Windows x64 folder.
- dist/STROIDS-Setup-<version>.exe — per-user Inno Setup installer.
- dist/SHA256SUMS.txt — installer checksum from deploy:check.
- dist/renderer/ — bundled offline web assets used by desktop packaging.

Ship the complete portable folder or the installer, never source or build/.
Inno installs under LocalAppData/Programs/STROIDS with a Start menu shortcut and
an optional desktop shortcut. It requires no administrator account. Profiles
remain in Electron's userData directory, normally AppData/Roaming/STROIDS, and
are preserved during upgrade and uninstall. Export before any manual data edits.

Run npm test, test:smoke against the local dev server, test:desktop, package,
deploy:check and test:installer before a local release. The installer lifecycle
test uses a temporary destination, no shortcuts and an isolated profile; it stops
if an existing registered STROIDS installation would be affected.

The initial build is unsigned. Signing, publisher metadata, licensing and public
release channels remain explicit release work. No auto-update service, upload,
remote publication or external deployment is configured or performed. Retain
Electron/Chromium and bundled font license notices in any distributed build.
Rollback uses the previous complete distribution and a version 1 profile export;
there are no database migrations. Imported unsupported schemas are rejected.
