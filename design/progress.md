# Progress (handoff note)

Updated 2026-11-10. Branch: `phase-6-main-flow` (not pushed yet).

## Where we are
**Phase 6 is complete** after the final corrections from the FINAL EDITS frames (About 47:251, Footer 49:455, Selected Works 49:291 and 49:416). Phase 7 (`about.html`) has not started.

## Done and approved
1. Shared pieces: standard load animation (`reveal.js`), scroll cue, header logo swap.
2. Splash: square mark only, two full turns, 3.5 s.
3. Landing: eyes, "I design for" + keywords (gray, wipe-in label on hover/focus), header hover dot.
4. Landing -> Touchpoints: blinds up (12 bars), Touchpoints revealed in place through them.
5. Touchpoints (Figma 32:306, assembly, glyphs, hand colours), Experiences (people first, then photo wipe), push-in slides.
6. Selected Works: pinwheel + card reel, domain view, image links with cursor label, Experiences -> Works blinds.
7. About section, footer, Works -> About push-in.
8. Header on every screen.

## Final corrections (2026-11-10), in plain words
- **About:** light ground, wine C mark, dark heading with "Carol," in burgundy, wine Learn More. The C mark is drawn once (`mark-c` in index.html) and reused by the splash, the header, About and the footer, each recoloured with a token. That is why there is no about-mark.svg any more.
- **Footer:** a full-height wine section. The pink mark and "< Click to Return Home" are one link: an instant jump to the top (`js/nav.js`). The header fades out over the footer (`js/header-footer.js`) and cannot be tabbed to while hidden.
- **Works:** the pinwheel is one fixed painting that only turns; one quarter turn moves every colour to the next flap. The column is wider (x 961 to 1834) and each card is its own panel.
- **Links:** link targets that may change live in one file, `js/site-config.js`: `NAV.contact` (the footer for now), `NAV.about` (the About section) and `ABOUT_PAGE_URL` (empty, so Learn More does nothing yet). Resume opens the Drive viewer.
- **Tab title and favicon:** "Carol Design Portfolio 2026"; favicon.svg plus .ico and .png versions rendered from it.

## Decisions by Carol not (fully) in motion.md
- The interactive Touchpoints wave was dropped. It lives only on the local branch `backup-before-wave-revert` (not pushed).
- Touchpoints text block: shifted right by 40% of its own width, capped at 64 px from the window's right edge (`--touchpoints-text-shift`, `--touchpoints-text-gap`). At 1920 and 1440 the cap applies.
- Glyph cells: 8 design px everywhere (`ASCII.cell`), bright pink/blue/orange on a deep-teal ground.
- Blinds: header items (logo, each link) swap one by one as the bar beneath covers them; the whole header at 0.98.
- No snap points on the Landing, Touchpoints, Experiences or Works (they fought slow mouse-wheel scrubbing).
- Header band off on the Landing, during the Touchpoints -> Experiences push and while any blinds rise; the Work theme has no band.
- Experiences -> Works is a blinds transition too (not a push-in).
- Header hover dot: pink #F2909F on the dark themes (Landing, Experiences), burgundy #993746 on the light ones.

## Known issues
- Direct `#hash` links (opening the page at `#work`, `#about`...) scroll late, once the page has loaded. The in-page jumps (About, Contact, Return home) are instant and not affected.
- Project links are placeholders (`#`, marked unavailable): no project pages yet.
- Desktop only; phones are deferred.
- The Helvetica Neue Medium font file is missing: Medium text (About heading, footer headline) falls back to the system's Helvetica/Arial weight.
- The About bio copy is longer than Figma's ("multiple scales and in context... silos"), so it wraps to four lines instead of three; spacing below follows Figma.
- First, cold load of Experiences runs ~0.25 s slow (the street photo loads lazily).
- The title and favicon tags are written into index.html. A static site with no build step cannot share head markup between pages without JavaScript; decide how `about.html` gets them in Phase 7.

## Next step
Carol's review of Phase 6, then merge. Phase 7 (`about.html`) after that.
