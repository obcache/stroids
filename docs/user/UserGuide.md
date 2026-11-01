# STROIDS User Guide

## Start a flight

Open STROIDS from its shortcut or STROIDS.exe. Select **LAUNCH RUN** or press
Enter. No login, network connection or setup is required.

Turn with left/right or A/D. Hold up or W to thrust, then release to drift. Hold
Space to fire. Your ship and shots wrap at the edges of space. Large rocks break
into two medium rocks; medium rocks break into two small rocks. Clear every rock
to start the next, faster wave.

Large, medium and small rocks award 20, 50 and 100 points. You have three ships
and earn an extra one every 10,000 points. A dotted shield marks the brief safe
period after launch or a lost ship. When all ships are lost, the run is recorded.
Select **ONE MORE RUN** to start fresh.

## Pause and navigation

Press P or Escape, or select the pause icon during flight. **RESUME FLIGHT**
continues the same run. **END RUN & RETURN HOME** discards an unfinished run;
completed runs are saved automatically. Opening help, settings or the flight log
pauses your flight. Close the inline panel and resume when ready. Escape closes
an inline panel. Switching away from the app also pauses play.

F toggles fullscreen. Escape exits fullscreen and pauses an active flight.
The desktop titlebar provides minimize, maximize/restore and close. Window size
and maximize state are remembered.

## Settings

- Sound effects: on by default, with original synthesized sounds at 45% volume.
- Volume: adjust from 0–100%.
- Reduced effects: hide debris and reduce flame animation. The operating system's
  reduced-motion preference is also respected.
- On-screen controls: show rotate, thrust and fire buttons. Touch devices show
  these automatically. You can hold thrust and fire together with multiple fingers.

Settings save on this device. They also travel with exported flight logs.

## Flight log and backups

Flight Log shows the latest 100 completed runs and your best score among them.
**EXPORT LOG** saves `stroids-flight-log.json`, including settings, runs and schema
version 1. **IMPORT LOG** validates the file before showing a replacement prompt.
Select **REPLACE FLIGHT LOG** to replace this device's log and settings, or cancel.
Export your current log before replacement if you want to retain it. Invalid or
unsupported files leave the existing log unchanged. Maximum import size: 250 KB.

On Windows, data lives in `%APPDATA%/STROIDS/`, outside the installed program.
`profile.json` contains preferences and runs; `window.json` contains window size.
Uninstalling leaves these files intact. If a desktop profile cannot be read, a
copy is preserved beside it with an `.unreadable-<timestamp>.bak` suffix and a
notice explains the recovery. Browser preview saves separately in localStorage.

## Troubleshooting

If controls stop when switching windows, return and resume the paused flight.
If audio is silent, check Sound Effects and Volume, then launch or resume a run.
If saving fails, the app displays a notice; check disk space and export a backup.
If an import fails, use a genuine version 1 STROIDS export. No file is partially
imported. Older or newer schemas need an explicit future migration.

This is an independent tribute to the early arcade era, with original assets and
no affiliation with the original Asteroids creators.
