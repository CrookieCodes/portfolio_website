# Progress (handoff note)

Updated 2026-11-11. Branch: `phase-6-main-flow`, pushed; pull request "Launch: portfolio v2" into main.

## Where we are
**Phase 6 is complete** after the final corrections from the FINAL EDITS frames (About 47:251, Footer 49:455, Selected Works 49:291 and 49:416). Phase 7 (`about.html`) has not started.

## Launched (launch-lite, 2026-11-11)
The main page goes live on https://carolelizabeth.netlify.app/ when Carol merges the pull request "Launch: portfolio v2" (phase-6-main-flow into main; it carries phases 1 to 6). Netlify deploys main; no CLI.
- Cards: `caseStudyUrl` per project in js/projects.js, empty. While empty the card image is a plain image (descriptive alt text, no link, no focus stop) and its cursor label reads "Case study coming soon".
- Learn More is hidden while `ABOUT_PAGE_URL` (js/site-config.js) is empty.
- Head: meta description, Open Graph and Twitter tags, theme-color #F7F7F7; preview image assets/og-image.png (1200 x 630, rendered with headless Chrome; replace freely, keep the name).
- Alt text on every meaningful image; decorative ones alt="" or aria-hidden. The third logo on the Aangan card (assets/logos/aangan-mark.webp) has empty alt until Carol names it.
- Below 1024 px wide: a full-screen notice (css/narrow.css, `NARROW_QUERY`) instead of the desktop page, with email, LinkedIn and Resume links.
- netlify.toml (redirect rules only) answers 404 for internal files: /design, /review, CLAUDE.md, README.md, .gitignore, .mcp.json, .claude, netlify.toml. New 404.html.
- Opening the page at a #hash (/#about, /#work) now lands there at once.

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
- **To come:** about.html (Phase 7) and the case study pages. Until then Learn More is hidden and the project cards have no links (`caseStudyUrl` empty).
- **Desktop only:** below 1024 px wide a notice is shown instead; a mobile version is to come.
- The Helvetica Neue Medium font file is missing: Medium text (About heading, footer headline) falls back to the system's Helvetica/Arial weight.
- The About bio copy is longer than Figma's, so it wraps to four lines instead of three.
- First, cold load of Experiences runs ~0.25 s slow (the street photo loads lazily).
- The title, favicon and preview tags are written into index.html. A static site with no build step cannot share head markup between pages without JavaScript; decide how about.html gets them in Phase 7.
- The four older pull requests (#1 to #4, phases 1 to 5) are still open; their work is all inside the launch pull request.

## Next step
Carol merges "Launch: portfolio v2"; Netlify deploys main. Then Phase 7 (`about.html`) and the case studies.
