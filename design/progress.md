# Progress (handoff note)

Updated 2026-11-09. Branch: `phase-6-main-flow` (base `phase-5-work-about`, pushed; phase 6 not pushed yet).

## Where we are
Phase 6 (main flow, FINAL EDITS). Checkpoints 1-6 approved. Checkpoints 7 (About section, footer, Works -> About push-in) and 8 (header on every screen) in progress.

## Done and approved
1. Shared pieces: standard load animation (`reveal.js`), scroll cue, header logo swap.
2. Splash: square mark only, two full turns, 3.5 s.
3. Landing: eyes, "I design for" + keywords (gray, wipe-in label on hover/focus), header hover dot.
4. Landing -> Touchpoints: blinds up (12 bars), Touchpoints revealed in place through them.
5. Touchpoints (Figma 32:306, assembly, glyphs, hand colours), Experiences (people first, then photo wipe), push-in slides.
6. Selected Works: pinwheel + card reel, domain view, image links with cursor label, Experiences -> Works blinds.

## Decisions by Carol not (fully) in motion.md
- The interactive Touchpoints wave was dropped. It lives only on the local branch `backup-before-wave-revert` (not pushed).
- Touchpoints text block: shifted right by 40% of its own width, capped at 64 px from the window's right edge (`--touchpoints-text-shift`, `--touchpoints-text-gap`). At 1920 and 1440 the cap applies.
- Glyph cells: 8 design px everywhere (`ASCII.cell`), bright pink/blue/orange on a deep-teal ground.
- Blinds: header items (logo, each link) swap one by one as the bar beneath covers them; the whole header at 0.98.
- No snap points on the Landing, Touchpoints, Experiences or Works (they fought slow mouse-wheel scrubbing).
- Header band off on the Landing, during the Touchpoints -> Experiences push and while any blinds rise; the Work theme has no band.
- Experiences -> Works is a blinds transition too (not a push-in).
- Keyword hover label and header dot: burgundy #993746 (pink #F2909F on the burgundy About ground).

## Pending or known issues
- About section + footer and the header targets (Resume link, About -> about.html): checkpoints 7 and 8.
- Direct `#hash` links scroll late, once the page has loaded (Phase 8).
- Header 70% link colour on the burgundy About ground is 4.29 : 1 (below 4.5).
- Missing favicon (404 in the console).
- First, cold load of Experiences runs ~0.25 s slow (the street photo loads lazily).

## Next step
Checkpoints 7 and 8, then Carol's review. Phase 7 (about.html) after that.
