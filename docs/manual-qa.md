# Manual QA

Automated coverage and commands are in docs/developer/testing.md.

1. Launch the installed or portable app with networking unavailable. Confirm all
   fonts/art load, the custom titlebar works and no login is requested.
2. Launch a run; rotate, thrust then drift, hold fire and fly through an edge.
   Break each rock size, clear a wave and verify 20/50/100-point scoring.
3. Lose a ship and observe the temporary dotted shield. Lose all ships, inspect
   the completed log entry, restart and verify a clean three-ship run.
4. Pause/resume with P, Escape and the pause button. Open each inline panel and
   confirm play pauses. Switch windows and resume on return. F toggles fullscreen.
5. Change sound/volume and listen for shot, hit, break and start cues. Verify
   reduced effects and simultaneous thrust/fire on a touch-capable device.
6. Close/reopen: settings, completed runs and window size/maximize state persist.
7. Use the native export/save and import/open file choosers. Cancel each chooser;
   then import a valid backup, cancel replacement, and finally confirm replacement.
   Reject invalid JSON, version 99 and files over 250 KB without data changes.
8. Review 1536×1024, 900×680 and 390×844 layouts for clipping and visible focus.
9. Run test:installer only without an existing installation. For a release, also
   inspect the interactive installer, optional shortcut and normal uninstall UI.

Automated browser and Electron suites cover these program flows; listening,
physical multi-touch and native dialog/wizard appearance require human review.
No claim of manual acoustic or physical-device testing is made by automation.
