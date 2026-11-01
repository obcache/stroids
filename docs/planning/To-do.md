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
