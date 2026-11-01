# Versioning Guide

Root package.json is the version source. The explicit first-party inventory is
package.json, package-lock.json (top-level and packages[empty-string] metadata),
VERSION and installer/stroids.iss (MyAppVersion and VersionInfoVersion).
Runtime Electron metadata, executable resources and installer names derive from
these during packaging. No version string is duplicated in renderer source.

`npm run version:show` lists all four locations. `version:sync -- --set X.Y.Z`
synchronizes them. `version:bump:patch`, `version:bump:minor` and
`version:bump:major` increment the requested part and synchronize all targets.
The tooling never walks dependencies, dist, build, backups or nested packages.
The versioning tests verify all three bump kinds in disposable directories and
assert that third-party package/lock entries remain unchanged.

Commit requests default to a patch bump. `npm run commit -- "message"`,
`commit:minor` and `commit:major` use the existing release helper. That helper can
push when a remote exists; only invoke it when committing/pushing is authorized.
Rebuild and repackage after a version change before distributing artifacts.
Profile schemaVersion is independent of the application version and remains 1.
