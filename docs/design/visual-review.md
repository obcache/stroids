# Visual specification and review

## Reference and method

The built-in Image Gen concept is `docs/design/stroids-concept.png` (1536×1024).
Production art is `public/art/sprites.png` (a square four-cell original line-art
atlas). The black atlas is composited additively, preserving the field behind it.
Prompts and provenance are in `docs/design/prompts.md`.

The concept is the implementation reference selected autonomously for this first
build; the user did not request an approval checkpoint. Layout tokens: charcoal
#10120f, warm ivory #eeeee4, acid yellow #d9fa68, olive #414936 borders; 30px desktop
gutters; thin framed arena; 36px titlebar, 102px header, 50px HUD, 42px status strip.
Orbitron 700/900 supplies geometric display type; IBM Plex Mono 400/500 supplies
controls and utilities; Space Grotesk supplies supporting panel typography.

The app consists of titlebar, wordmark/navigation, inline help/log/settings,
arena, control legend and footer. It has no extra marketing sections or cards.
Code owns all actual text, controls, scores, physics and collision geometry.
Generated art owns rocks and ship. Simple HUD ship glyphs, crosshair, star dots,
debris and flame use code as intentional procedural visual effects, not substitute
ship/asteroid artwork.

The browser access host/native pipe was unavailable. Playwright Chromium captured
the implementation at the native 1536×1024 reference size plus 900×680 and 390×844.
`view_image` opened both the concept and actual full-page screenshots and gameplay
captures. Local browser path: http://127.0.0.1:5173. The built Electron app was
also captured at its window size. Screenshots remain in OS temp/stroids-qa and
OS temp/stroids-game-client, outside committed source and distributable artifacts.

## Fidelity ledger

| Point | Concept evidence | Render evidence and disposition |
| --- | --- | --- |
| Composition | Open header, single thin-bordered arena, footer/legend | Same hierarchy/gutters/rows; no card grid added |
| Palette | Charcoal, ivory, acid yellow, olive rules | Exact CSS tokens; no gradients or color wash |
| Display type | Wide squared wordmark and two-line launch message | Replaced initial generic display treatment with bundled Orbitron; enlarged wordmark and headline after comparison |
| Utility type | Legible monospaced nav/HUD/status | Bundled IBM Plex Mono, explicit control sizes and tracked labels; increased desktop navigation/status sizes |
| Artwork | Sparse outlined rocks, yellow ship, starfield | Original generated assets; replaced noisy draft, strengthened dim raster strokes, retained sparse scene |
| Primary control | Yellow rectangular LAUNCH RUN with diagonal arrow | Working HTML button and matching outline arrow; increased type/padding to reference proportions |
| Responsive geometry | Desktop arena is wide and uncluttered | Dynamic world dimensions keep rocks round at narrow sizes; no horizontal overflow at all checked sizes |
| State continuity | Launch screen supplies base visual language | Pause/game-over/inline panels reuse tokens; resume, restart and log changes verified |

## Copy audit and intentional deviations

Visible reference copy is preserved: STROIDS; HOW TO PLAY / FLIGHT LOG / SETTINGS;
SCORE / WAVE; A little ship. / A lot of space.; Drift. Dodge. Break things. /
One more run starts here.; LAUNCH RUN; or press ENTER; SECTOR / THE QUIET BELT;
ALL SYSTEMS READY; BUILT FOR THE LONG WAY HOME.; ROTATE / THRUST / FIRE / PAUSE;
the independent-tribute footer and LOCAL PLAY / NO QUARTERS REQUIRED.
No unrelated copy, hero badges or navigation were added. Conditional personal
best, real gameplay states, notices and functional inline panels are necessary
product states. The concept's redundant up/down glyphs beside ROTATE are omitted
because rotation actually uses left/right. Browser preview omits native window
buttons; Electron has working minimize/maximize/close. Artifact fonts are real
bundled fonts rather than an exact reconstruction of generated letter shapes.
The original ship/rock atlas is intentionally cleaner than the concept sketch.

The implementation was faithfully verified against the selected design in copy,
composition, typography, palette, art treatment, controls and spacing. Remaining
differences above are deliberate implementation choices. No material unresolved
visual mismatch was found in the final reviewed screenshots.
