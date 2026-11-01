# Handoff Guide

Run `npm run handoff -- "Concrete current status and next action"` after updating
docs/planning/To-do.md and docs/dev-ledger.md. The tool creates
`docs/handoffs/HANDOFF.md` plus an ignored timestamped snapshot with Git state,
foundation, plan and recent ledger context. Read HANDOFF.md at the next session.

Application code is under src/, shared/ and electron/. Build/packaging/testing
commands live in package.json and tools/build/ plus tools/testing/. Only dist/
is distributable. Runtime JSON and test screenshots stay outside artifacts;
progress.md preserves the original game request and gameplay-test observations.

Final delivery notes must identify changed surfaces, completed validation,
dist rebuild, profile/database migration status and any deployment still needed.
