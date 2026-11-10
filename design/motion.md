# Motion spec (v2, FINAL EDITS)

Replaces the earlier motion.md. Source of truth for layout: the Figma file `aG0PPre8bqx95SER6BXyaz`, FINAL EDITS frames (x=7389 and x=12374). The original frames (x=3193) are OUT OF DATE; do not build from them.

Tags: **FIGMA** = read from Figma. **CAROL** = stated by Carol. **PROPOSED** = starting value, to be tuned by eye. Every PROPOSED timing, colour and distance lives in `js/motion-config.js` (mirrored to `:root` custom properties where CSS needs it). Never hard-code a timing anywhere else.

## Figma frames

| Screen | Node |
|---|---|
| Splash | 32:633 |
| Landing | 32:656 |
| Touchpoints ("Service designer") | 32:306 |
| Experiences ("UX designer") | 32:359 |
| Selected Works | 32:377 |
| Selected Works by domain | 32:417 |
| About section + footer (index) | 32:475 |
| About Page (`about.html`) | 32:516 |
| Experience / Education / Conferences | 32:534 |
| Skills | 32:585 |

## Global
- **Two pages:** `index.html` (the main flow) and `about.html` (hero, Experience section, Skills section, footer). Shared header, footer, tokens, motion config and effects.
- **Main flow (scroll):** Splash -> Landing -> Touchpoints -> Experiences -> Selected Works -> About section + footer. Scrolling up goes back one screen.
- **Transitions between screens (CAROL):**
  - Landing -> Touchpoints (dark to white): **blinds up**, see section 2. Twelve vertical bars in the Touchpoints ground colour rise from the bottom of the screen to the top, staggered left to right, tied to the scroll; the header swaps when the last bar lands, then the Touchpoints load animation plays. This is the only blinds transition.
  - Touchpoints -> Experiences: **push-in** (CAROL). Experiences is a dark layer that slides up over the pinned Touchpoints at scroll speed, scroll-tied and reversible, transforms and opacity only. With q = how far Experiences has entered the window (0 = its top edge at the bottom, 1 = covering the screen), Touchpoints drifts up by q x 12% (`PUSH.drift`) and a black veil fades over it to 12% at q = 1 (`PUSH.veil`). Header: the band is off during the push; each item (logo, each link) takes the Experiences theme once the dark layer's top edge has passed it (`PUSH.headerCover`), and the whole header follows on arrival (`PUSH.arriveAt`, 0.98). Between two pinwheel screens the logo only changes colour (the spin is for the tan mark <-> pinwheel swap).
  - Experiences -> Selected Works: **blinds up** (CAROL), the same transition as Landing -> Touchpoints and the same code (js/wipe.js, css/wipe.css, values in `WIPE_WORKS`, all PROPOSED and equal to `WIPE`): Experiences pinned in a 200svh wrapper, Selected Works shown through 12 rising bars (its light ground), the header band off while they rise, the header items swapping one by one as their bar passes (ending in the Work theme: deep-teal mark, dark text), the whole header at 0.98, and Selected Works' load starting once covered (0.995). `#work` is an anchor at the end of the blinds. No snap points; reduced motion: plain screens.
  - A screen that has been fully covered pauses its effects.
- **Snap points (CAROL):** none on the Landing, Touchpoints, Experiences or Selected Works. Every transition between them is scrubbed by the scroll, and proximity snapping pulled slow mouse-wheel scrolling back to the nearest screen.
  - Selected Works -> About section: **push-in** (CAROL), the same code and values as Touchpoints -> Experiences (`PUSH_ABOUT`, all PROPOSED: drift 12%, veil 0.12, headerCover 1, arriveAt 0.98). About slides up over the pinned Works at scroll speed; Works drifts up q x 12% under a black veil. Header items take the About theme one by one as About's top edge passes them (about q 0.93 to 0.95 at 1920 x 1080); the whole header on arrival (0.98). About's load starts on arrival. No snap, no scroll lock. Reduced motion: plain screens, instant cut. About section -> footer: plain scroll.
- **Loading animation (CAROL: simple, consistent everywhere):** when a screen enters view for the first time, its elements slide up 24 px (PROPOSED) and fade in, staggered 90 ms (PROPOSED), 600 ms each, ease-out. Plays once per page load. Reference feel: slide-up and fade, whole screen settled in about 1.5 s. Each screen below lists its own order.
- **Header:** fixed, always on top, one per page, themed per screen via `data-theme`. Nav: About, Work, Resume, Contact; the active item has a dot. The top scrim from Phase 3 stays.
  - **Links (CAROL, FINAL EDITS):** About jumps instantly to the About section (`NAV.about` in `js/site-config.js`; About's load plays on arrival; on `about.html` it will be the active item and go to the top). Work scrolls to `#work` as before. Resume opens the Drive viewer in a new tab. Contact jumps instantly to the footer for now (`NAV.contact`; no contact page). Instant jumps move focus to the target's heading.
  - **Hover dot (CAROL):** pink #F2909F on the dark themes (Landing, Experiences), burgundy #993746 on the light ones (Touchpoints, Work, About). Work's active dot is brown #9F723C (Figma 49:299).
  - **Logo (CAROL):** the Landing screen shows the PRIMARY logo (tan square mark). From Touchpoints onwards the header shows the SECONDARY logo (the pinwheel) in a per-screen colour. The swap is a clean spin-and-change: spin 90 degrees over 0.5 s, change the mark at the midpoint (opacity swap), spin back out. Same in reverse when scrolling up. The pinwheel colours per screen are read from each Figma frame (header mark).
  - The splash has no header.
- **Scroll cue (CAROL):** the text "Scroll down for more details" with a small chevron. Its opacity pulses between 1 and 0.35 (PROPOSED) on a 1.6 s ease-in-out loop so people notice it. Shared component used on Landing and on the Experience section. Reduced motion: static, full opacity.
- **Cursor label (CAROL):** one shared component (text and target are parameters). Small label that follows the cursor with a small offset, black background, white text, 12 px at 1920 wide (scaled with clamp), padding 4px 8px, fades in 150 ms. Used for "Click to view more" (About hero photo). Hidden on touch devices. Keyboard focus and reduced motion: shown static next to the target.
- Every screen fits the browser: `100svh`, `clamp()`/`vw`, no horizontal overflow at 1024-2560. Desktop only; phones deferred.
- **Reduced motion:** no splash sequence (show Landing), static final states for every animation, instant transitions, no pulsing cue, no spin, no blur.
- **Brighter glyph colours (CAROL):** pink #F28B9D, blue #4FA8E0, orange #F5A04A (PROPOSED hex, tune by eye), always on a deep-teal #0B2F32 ground (as in Carol's prototype; on the squares' own light gradients the bright glyphs were only 1.0 to 2.1 : 1). Used by every ASCII/glyph effect. The old palette (burgundy, deep-teal, bronze) stays for flat colour use.
- **Glyph cell size (CAROL):** 8 design px per cell at 1920 wide, scaled with the screen, on every glyph effect (`ASCII.cell`).

## 1. Splash (32:633)
Sequence (CAROL, revised: much simpler), 3.5 s in total from the first frame to the Landing fully visible. Only the main square mark ("C" logo); no corner crosses, no duplicate-and-sweep assembly, no other shapes.
1. The mark fades in at the centre: 0.4 s.
2. It rotates a full 360 degrees clockwise (0.7 s, ease-in-out), then stops (0.5 s).
3. It rotates a full 360 degrees again (0.7 s, ease-in-out), then stops (0.5 s).
4. It dissolves into the Landing: 0.7 s. No expanding.
Values in `SPLASH` (js/motion-config.js): fadeIn 400, spins 2, spinAngle 360, spinDuration 700, spinPause 500, dissolve 700.
Skippable by click, key or scroll. Page underneath is `inert` while it plays. No splash when the URL has a hash. Plays once per load. Reduced motion: no splash.

## 2. Landing (32:656)
- **Layout:** the pair of eyes centred at the top. Below: "Hey, I'm Carol Elizabeth. I design." Then three always-visible keywords on separate burgundy-highlighted labels: Products, Services, Experiences. Then the scroll cue. Header shows the primary logo.
- **Eyes:** pupils still follow the cursor (clamped, smooth, ~120 ms lag). The old per-eye click-to-explore behaviour and its label are REMOVED.
- **Hover (CAROL):** when the cursor is on any of the three keywords, BOTH eyes turn into the pinwheel logo (the burgundy cross state from before is replaced by the pinwheel mark). Leaving restores the pupils. Keyboard focus on a keyword does the same.
- **Click (CAROL):** each keyword is a link into Selected Works in the domain view for that domain: Products -> Product Design, Services -> Service Design, Experiences -> UX Design. Navigate by smooth scroll to the Works screen and open the domain view.
- **Loading order:** eyes, then the heading text, then the three keywords (staggered), then the scroll cue.
- **Landing -> Touchpoints: blinds up (CAROL, chosen from a prototype).**
  - Twelve vertical bars, each 1/12 of the screen width, in the Touchpoints ground colour (#F7F7F7). Each is the full screen height and rises from the bottom to the top, never top to bottom.
  - Scroll-tied and reversible. The Landing stays pinned (sticky, in a 200svh wrapper) while the bars rise over one screen of scrolling. No scroll-snap points on the Landing or Touchpoints (snapping pulled every gesture back to one end).
  - Stagger left to right in a straight line: bar i (0 to 11) has local progress q = clamp((p - (i / 11) x 0.5) / 0.5) and height smoothstep(q) = q x q x (3 - 2q) of the screen. Bar 0 starts at p = 0, the last bar lands at p = 1.
  - The bars are Touchpoints itself: the Landing and Touchpoints are both pinned in the same place, Touchpoints on top, masked so that it shows only through the twelve bars (mask layers set up once, each 1px wider than its share so no seams show; each frame only updates one height variable per bar). So the white that arrives is the Touchpoints screen, in place, and scrolling back up lowers the bars to reveal the Landing; there is never an empty white screen.
  - The header band is hidden on the Landing (it is pinned, so nothing scrolls under the header), so the bars reach the very top.
  - Header: the band, nav and logo keep the Landing theme until the last bar lands. At swapAt (0.98) they switch to the Touchpoints theme and the logo spins from the tan mark to the burgundy pinwheel; scrolling back past it reverses this.
  - Then the elements load: the Touchpoints elements stay hidden while the bars rise, so the white ground arrives first. At coveredAt (0.995) the standard load animation plays (heading, the bullets one after another, then the diagram assembly). Once per page load (CAROL).
  - Values in `WIPE` (js/motion-config.js), all PROPOSED: bars 12, spread 0.5, swapAt 0.98, coveredAt 0.995, color = the Touchpoints ground token.
  - Reduced motion: no bars; the Landing and Touchpoints are plain screens, one after the other, and the Touchpoints elements are visible straight away.

## 3. Touchpoints (32:306)
- Light ground #F7F7F7, dark text, header pinwheel in burgundy. Lines #0E1819, dots #323232, square gradients and hand colours as in the frame.
- **Text block (CAROL):** placed as in the frame (lower right, heading second line bold), then shifted right by 40% of the block's own width (`--touchpoints-text-shift`), but never closer than 64 px to the window's right edge (`--touchpoints-text-gap`).
- **Loading:** heading and bullets slide up and fade in, staggered. Then the diagram assembles piece by piece (CAROL), once, ~2-2.5 s: base square -> the hand/thumb rises in behind it -> lines draw outward (stroke-dashoffset) -> small squares pop in at the line ends (scale 0.6 -> 1) with their glyphs -> dots appear and start flowing along the routes. Step timings in `BUILD` (STARTER).
- **Dots and glyphs:** once the diagram has assembled, the dots flow along the routes (looping while in view) and the glyph effect on the squares sweeps outward from the base square (looping), in the brighter colours on deep teal. Both pause when off-screen, covered or the tab is hidden.
- The thin pink line at the bottom edge of the frame is ignored (a Figma artefact).

## 4. Experiences (32:359)
- Layout unchanged. Header pinwheel in bronze.
- **Loading: the people first, then the photo wipes in behind them (CAROL; replaces "light reveals the scene" and the earlier photo-first orders).** Once per page load, from arrival (`PUSH.arriveAt`):
  - Before: a near-black ground (#070606). The photo is wiped out of sight; no part of it shows.
  1. The people: the three glyph silhouettes switch on, left to right, from 0.2 s, 0.2 s apart, each fading in over 0.5 s. Inside each person's shape the deep-teal ground (#0B2F32) is opaque from the moment it switches on (only the glyphs fade), and the glyph canvas sits above the photo, so a real person from the photo is never visible before or without its glyph shape. The glyphs keep their top-to-bottom sweep, looping every ~4 s, in the brighter pink, blue and orange at 8 px cells. The silhouette shapes are only masks, never shown flat.
  2. The photo wipes in: from 0.9 s, left edge to right edge over 1.6 s, behind the glyph people, eased out (fast start, slow finish). Built from transforms: a clipping wrapper translates from -100% to 0 while the photo inside counter-translates from +100% to 0, and the photo eases from scale 1.06 to 1. The glyph layer takes exactly the same scale, so the shapes always sit on the people.
  3. The text: the heading and bullets load with the standard animation at 2.4 s (measured: in place 3.4-3.7 s after arrival).
  - The glyph canvas stays paused until the first person switches on, and pauses when off-screen or the tab is hidden (30 fps cap).
  - Scrolling away and back keeps the end state and does not replay.
  - Values in `EXPERIENCES_REVEAL` (js/motion-config.js), all PROPOSED: ground '#070606', figureStart 200, figureStagger 200, figureFade 500, photoStart 900, photoWipe 1600, photoSettleFrom 1.06, textAt 2400, glyphCycle 4000; plus photoEasing (STARTER).
  - Reduced motion: no motion; the end state at once (photo, one still glyph frame on the people, text). Without JavaScript: the photo and text, no ground.
- Transition in from Touchpoints is the push-in slide.

## 5. Selected Works (32:377, 32:417)
Left: a large pinwheel. Right: a framed panel with a vertical card reel.
- **Pinwheel (CAROL, FINAL EDITS 49:291 / 49:416):** it cannot spin freely. Each step turns it a quarter turn (90 degrees) clockwise, cumulatively, so it keeps repeating. It locks at each stop. It is a **fixed painting**: no colour rule and no crossfade; the turn alone moves the colours. At rest (Figma's pose, 49:291): top and bottom flaps #DBBE9B, left and right flaps #AF997E, small triangles brown #9F723C upper-left and lower-right, deep teal upper-right and lower-left, stick #746149. One turn gives 49:416. Tokens `--color-pinwheel-*`; timing `WORKS.turnDuration` / `turnEasing`. (Replaces the earlier alternating colours and "a brown flap points at the cards".)
- **Buttons (49:291):** "Next Project >" (183 x 62 at 714, 868: light grey #B7B7B7, dark text #242424) and "Sort by Domain >" (213 x 62 at 684, 939: deep teal, off-white text), right edges lined up. Fixed colours in both views.
- **Reel (CAROL: jackpot-machine slot):** the cards sit in a vertical track clipped by the panel; the next card peeks in below the current one. Next Project rolls the track **bottom to top only**, never top to bottom: ~0.9 s, a quick start, a slow settle with a small overshoot (PROPOSED easing `cubic-bezier(0.2, 0.9, 0.25, 1.08)`), and a slight vertical motion blur and stretch (blur 1.5 px, scaleY 1.02) while moving. The card arriving goes from dimmed and slightly smaller to full size and brightness; the card leaving does the reverse. Wrap around at the end, still rolling upward (clone the first cards after the last, and jump back without animation after the roll ends). The pinwheel's quarter turn runs in sync with the roll.
- **Domain view (CAROL):** "Sort by Domain" regroups the cards into one domain. A title shows the domain name ("Service Design") with small < > buttons beside it. Domains: **Product Design, Service Design, UX Design.** The < > buttons cycle between domains; each change rolls the new domain's cards up into the reel and the pinwheel turns a quarter and locks. Next Project moves within the current domain. Pressing Sort by Domain again returns to the full list (ASSUMPTION; confirm).
- **Cards:** the featured card (frame 32:377) has the project image, title, one-line description, institution logos, tags and "View Project >". The smaller card style (Nest, Petting Zoo) is for the cards waiting in the reel. For now reuse the existing three projects and their images, duplicated as needed so the reel and each domain have at least 2 cards (placeholders). Project data lives in one file (`js/projects.js`) with a `domains` array per project. PROPOSED assignment: Aangan -> service, ux; Nest -> service, product; Petting Zoo -> product, ux. Carol to correct.
- **Loading:** the pinwheel assembles first (flaps slide in and settle), then the buttons, then the cards. Stagger as global.
- Transition in from Experiences: push-in slide.
- Accessibility: reel is a list; the arriving card is announced via `aria-live="polite"` ("Project 2 of 3: Nest"); the buttons are labelled; the off-focus cards are `aria-hidden` and not tabbable. Reduced motion: no blur, no overshoot, instant change.
- **Layout (FINAL EDITS 49:291):** the grey column runs x 961 to 1834 (873 wide), its right edge 34 design px past the header's right page margin at any width. Every card is its own whole light panel (790 x 833, 16 px radius, 38 apart, the current one at y 153) with its own title row: "Selected Works" (43 px) and "2024 - 2026" (Plex Light, upright), or in the domain view the domain title with the < > buttons. Image 693 x 390. The panels roll up as whole units (same roll, blur and overshoot) inside the grey column, which stays fixed; the column's top and bottom edges fade over 24 design px (a mask), so nothing shows a hard cut. Tags 156 x 40, two to a row, filled in turn light green, tan, blue-grey. Header: brown active dot on Work.
- **As built (checkpoint 6):** cards come from `js/projects.js` (Aangan -> service, ux; Nest -> service, product; Petting Zoo -> product, ux: every domain has two projects, so no duplicate cards). Sort by Domain opens the current project's first domain; pressed again, it returns to the full list at its first card. Clicks during a roll are ignored (rolls do not queue). Cards that are not current are `inert` (no Tab, no clicks) and `aria-hidden`. Changing views announces the view first ("Service Design. Project 1 of 2: Aangan", "All projects. ..."). Values in `WORKS` (js/motion-config.js). The Work header has no band (it would hide the grey column).
- **Checkpoint 6 changes (CAROL):**
  - The grey column is lined up with the header nav (now 34 design px past the right page margin, see Layout above).
  - Loading: the grey column first, then the pinwheel (one piece, stick included, no per-flap assembly), the buttons, the title row and the cards, with the standard load, 90 ms apart. Once per page load.
  - Card links: the card image is the link ("View project: <title>"), with the shared cursor label "Click to view project" (js/cursor-label.js, css/cursor-label.css; desktop only, never on cards that are not current or during a roll). "View Project >" is removed. No project pages exist yet, so all three links are placeholders.

## 6. About section (47:251) + footer (49:455)
FINAL EDITS (CAROL, 2026-11-10). The older frame 32:475 is OUT OF DATE (burgundy About, teal footer); the tan and burgundy strip at the bottom of 47:251 is the old footer left in that frame and is not built.
- **About section (index), Figma 47:251:** light ground #F7F7F7; the C mark on the left in solid wine #783942 (the same shape as the splash and header mark, one shared SVG symbol `mark-c` recoloured with tokens); "Hello, I'm" dark #272727 with "Carol," in burgundy #993746; bio #2C2C2C; achievements #121212 with gold trophies #DBB07C; wine "Learn More >" button with white text. Copy unchanged. The weave/photo hover stays REMOVED.
- **Learn More:** no destination yet. Its target is `ABOUT_PAGE_URL` in `js/site-config.js` (empty for now): while empty, the button is a disabled link with no `href` (no jump, no `#` in the address, no 404).
- **Header on About:** dark text #1B1B1B, wine logo, light band, burgundy hover dot.
- **Works -> About:** the push-in, unchanged (`PUSH_ABOUT`).
- **About loading (CAROL):** standard stagger, once, starting when About has arrived: mark, heading, bio, first achievement, second achievement, button.
- **Footer, Figma 49:455:** a full-height section (`min-height: 100svh`) on the wine ground #783942, after About with a plain scroll. Layout on the 1920 x 1080 stage: the small pink C mark #EBC0C7 (167 px, turned -11.05 degrees) at the top left with the cue "< Click to Return Home" beside it (Helvetica Neue Light 25 px, #EDCFAA); the tag line "SERVICE DESIGN • UX DESIGN • SYSTEMS DESIGN • UX STRATEGY • UX RESEARCH" at y 497; the gold #E1B27A headline "Let's build something good." / "Say Hello!" (Helvetica Neue Medium 82/105) at y 580; the underlined links with arrows at y 843 (email as `mailto:`, LinkedIn, Behance, Instagram, new tab, `rel="noopener noreferrer"`); the small print at y 985 ("All Rights Reserved by Carol Elizabeth © 2026" left, "• DELHI, IN" right, the Unsplash credit centred because the Experiences photo is still used). A large darker cross (#5B2E34 at 80%, flattened to #613037) at the right, cropped by the window's right edge, stationary.
- **Return home (CAROL):** the mark and the cue are one link ("Return to home"). Click or Enter: an instant jump to the top (js/nav.js, `behavior: 'instant'`, overriding smooth scrolling), no splash, the address becomes `#landing`, focus moves to the Landing heading. The cue pulses with the shared scroll-cue component and values (`CUE`).
- **Header over the footer (CAROL):** the header fades out once the footer's top edge reaches the bottom of the header band, and is then `visibility: hidden` with no pointer events (its links cannot be tabbed to); it fades back in when scrolling up. `HEADER.footerFade` 300 ms (PROPOSED). There is no footer header theme.
- **Footer loading:** the mark and cue first, then the tag line, headline, links and small print staggering up (standard stagger), then the cross fades in sliding from the right (`REVEAL.fromRight`, 80 design px, PROPOSED). Once, when the footer scrolls into view.
- Same footer on `about.html`.

## 7. About Page (`about.html`, 32:516)
- Reached from Learn More once `ABOUT_PAGE_URL` (js/site-config.js) is set. The header About link on `index.html` goes to the About section instead. The header About item is active here.
- Burgundy ground; mint secondary logo in the header.
- Left: the photo inside four white flaps arranged as a pinwheel (rotated rectangles). Right: "Have we met?" (light weight) and "I'm Carol Elizabeth," (mint, bold), then two paragraphs.
- **Loading (CAROL):** the four flaps and the photo load together (the flaps slide in from their sides and settle while the photo fades in), then the two heading lines slide up, then the paragraphs one after the other.
- Cursor label on the photo and flaps: "Click to view more" (shared component).

## 8. Experience / Education / Conferences (32:534)
Second section of `about.html`.
- **Two ways in (CAROL):** scroll down from the hero, or click the photo and flaps. Both play the same transition.
- **Transition (CAROL): paper unfold.** From her origami clip: the folded paper opens out hinge by hinge. The four white flaps and the photo are the folded paper; they open outward one after another, hinging on their edges (CSS 3D transforms, `perspective`, `transform-origin` at each hinge edge), the burgundy gives way to a white sheet that becomes the next section's ground. One-shot of ~1.2 s (PROPOSED: 4 flaps x 0.7 s, staggered 130 ms), not scroll-scrubbed. Scroll is locked while it plays. Scrolling up from the top of this section plays it in reverse (folds back). State flag `data-state="hero | unfolded"`.
- White ground, dark text, header mark dark teal.
- **Content:** three groups.
  - Experience: First Consulting Group (Kochi, Kerala), UI/UX Design Intern. Fusie Engineers (Kochi, Kerala), Junior UI/UX Design Intern. Jibu & Thomas Architects (Kochi, Kerala), Architectural Intern.
  - Education: Indian Institute of Technology, Delhi (New Delhi), Master of Design | CGPA 9.71 | Department Rank 1. TKM College of Engineering (Kollam, Kerala), Bachelor of Architecture | CGPA 8.52. Rajagiri Public School (Kochi, Kerala), CBSE | 95.6%.
  - Conferences: ServDes India Symposium (Pune, Maharashtra), "Presented Service Design project to a panel of academicians & practitioners". UX India Conference (Bangalore, Karnataka), "Presented as Social Impact project to a panel of investors & tech enthusiasts".
- **Loading after the unfold:** the Experience and Education headings, then the rows one after the other, then the Conferences heading and entries, then the scroll cue (pulsing) which leads to Skills.

## 9. Skills (32:585)
Third section of `about.html`, burgundy ground, header mark mint.
- **Left (CAROL):** the roles graphic, reduced to the simple version. A fixed S-shaped pink curve with five pinwheels at fixed positions on it (colours in order: #9EC1C6, #E08BD6, #DBBE9B, #F28B9D, #A9DAAF). Roles in order: Service Design, UX Design, Systems Design, UX Strategy, UX Research. No camera zoom. The pinwheel shape is the one from the Pinwheel Roles artifact (polygon in Prompt B).
- **Scroll-driven:** the left column is `position: sticky` for the whole section; progress = scroll through the section. Pinwheels appear and disappear one node to the next as the user scrolls: node N fades/scales in while spinning 90 degrees (the spin as it arrives), shows its role label on the side with the most room, then hands over to node N+1 (N fades down). At the last stretch (~20% of the progress) all five show together with their labels, plus a few extra small pinwheels without labels and a few faint white constellation lines (0.8 px, alpha 0.42, 10 shortest links). Reversible.
- **Right:** "Skills" with four groups (Service & Systems; Product & Experience Design; AI-Integrated Workflow; Prototyping Tools), then "My Creative Process" and a mint "Download Resume >" button. These load with the standard slide-up stagger as the section enters view.
- **Download Resume:** opens the Drive viewer (not a direct download): `https://drive.google.com/file/d/1vKV2FjA22p_7p2cgtlvxRMRCWcCI1144/view?usp=sharing` (file must be shared "Anyone with the link"). The same link is the header Resume item, `rel="noopener noreferrer"`, `target="_blank"`.
- Ends with the footer.

## Still unknown (do not invent)
- Exact flap hex values on the Works pinwheel and per-screen header mark colours: read from Figma.
- Project domain assignments (PROPOSED above), real project pages.
- Whether Sort by Domain toggles back to the full list.
- Final glyph colour tuning and splash timings: review in the browser, then lock.