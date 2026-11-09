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
  - Touchpoints -> Experiences, and Experiences -> Selected Works (dark to light): **simple push-in slide**. The next screen slides up over the current one, as if the photo is pushed into the space. ~0.8 s, ease-out, scroll-linked, reversible. Reuse the existing scene mechanism if it already does this.
  - Selected Works -> About section: keep the existing behaviour (plain scroll).
- **Loading animation (CAROL: simple, consistent everywhere):** when a screen enters view for the first time, its elements slide up 24 px (PROPOSED) and fade in, staggered 90 ms (PROPOSED), 600 ms each, ease-out. Plays once per page load. Reference feel: slide-up and fade, whole screen settled in about 1.5 s. Each screen below lists its own order.
- **Header:** fixed, always on top, one per page, themed per screen via `data-theme`. Nav: About, Work, Resume, Contact; the active item has a dot. The top scrim from Phase 3 stays.
  - **Logo (CAROL):** the Landing screen shows the PRIMARY logo (tan square mark). From Touchpoints onwards the header shows the SECONDARY logo (the pinwheel) in a per-screen colour. The swap is a clean spin-and-change: spin 90 degrees over 0.5 s, change the mark at the midpoint (opacity swap), spin back out. Same in reverse when scrolling up. The pinwheel colours per screen are read from each Figma frame (header mark).
  - The splash has no header.
- **Scroll cue (CAROL):** the text "Scroll down for more details" with a small chevron. Its opacity pulses between 1 and 0.35 (PROPOSED) on a 1.6 s ease-in-out loop so people notice it. Shared component used on Landing and on the Experience section. Reduced motion: static, full opacity.
- **Cursor label (CAROL):** one shared component. Small label next to the cursor, black background, white text, 12 px at 1920 wide (scaled with clamp), padding 4px 8px, fades in 150 ms. Used for "Click to view more" (About hero photo). Hidden on touch devices. Reduced motion: shown static near the target.
- Every screen fits the browser: `100svh`, `clamp()`/`vw`, no horizontal overflow at 1024-2560. Desktop only; phones deferred.
- **Reduced motion:** no splash sequence (show Landing), static final states for every animation, instant transitions, no pulsing cue, no spin, no blur.
- **Brighter glyph colours (CAROL):** pink #F28B9D, blue #4FA8E0, orange #F5A04A (PROPOSED hex, tune by eye). Used by every ASCII/glyph effect from now on. The old palette (burgundy, deep-teal, bronze) stays for flat colour use.

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
  - Stagger left to right in a straight line: bar i (0 to 11) has local progress q = clamp((p - (i / 11) x 0.5) / 0.5) and height smoothstep(q) = q x q x (3 - 2q) of the screen. Bar 0 starts at p = 0, the last bar lands at p = 1. Built as 12 absolutely positioned divs scaled with transform: scaleY() from the bottom, each overlapping the next by 1px so no seams show.
  - Header: the band, nav and logo keep the Landing theme until the last bar lands. At swapAt (0.98) they switch to the Touchpoints theme and the logo spins from the tan mark to the burgundy pinwheel; scrolling back past it reverses this.
  - Then the elements load: the Touchpoints elements stay hidden while the bars rise, so the white ground arrives first. At coveredAt (0.995) the standard load animation plays (heading, the bullets one after another, then the diagram assembly). Once per page load (CAROL).
  - Values in `WIPE` (js/motion-config.js), all PROPOSED: bars 12, spread 0.5, swapAt 0.98, coveredAt 0.995, color = the Touchpoints ground token.
  - Reduced motion: no bars; the Landing and Touchpoints are plain screens, one after the other, and the Touchpoints elements are visible straight away.

## 3. Touchpoints (32:306)
- White background, dark text, header pinwheel in burgundy.
- **Loading:** heading and bullets slide up and fade in, staggered. Then the diagram assembles piece by piece (CAROL), once, when the screen scrolls into view, ~2-2.5 s total: base square -> the hand/thumb rises in behind it -> lines draw outward (stroke-dashoffset) -> small squares pop in at the line ends (scale 0.6 -> 1) -> dots appear and start flowing along the routes.
- Dot flow and the glyph (ASCII) effect on the squares stay as built, but with the brighter glyph colours.
- The thin pink line at the bottom edge of the frame is ignored (a Figma artefact).

## 4. Experiences (32:359)
- Layout unchanged. Header pinwheel in bronze.
- **Loading order (CAROL, Option A):**
  1. The photo appears.
  2. The silhouettes fade in as coloured shapes on the photo (pink, blue, brown, flat shapes from the frame).
  3. They crossfade into the glyph effect on the deep-teal ground (the glyph effect keeps its top-to-bottom sweep; brighter colours).
  4. The text "To crafting stories, experiences." and the bullets slide up and fade in.
- Transition in from Touchpoints is the push-in slide.

## 5. Selected Works (32:377, 32:417)
Left: a large pinwheel. Right: a framed panel with a vertical card reel.
- **Pinwheel (CAROL):** it cannot spin freely. Each step turns it a quarter turn (90 degrees) clockwise, cumulatively, so it keeps repeating. It locks at each stop. Four flaps; the colours of its coloured flaps alternate between two sets on each stop (CAROL: "pink and brown alternately"): set A as in frame 32:377 (tan + burgundy), set B as in frame 32:417 (pink + bronze). Read the exact hex values from Figma. Crossfade the colours during the 0.8 s turn.
- **Buttons:** "Next Project >" and "Sort by Domain >", both real buttons. In the default view Next Project is burgundy (active) and Sort by Domain grey; in the domain view they swap (frame 32:417).
- **Reel (CAROL: jackpot-machine slot):** the cards sit in a vertical track clipped by the panel; the next card peeks in below the current one. Next Project rolls the track **bottom to top only**, never top to bottom: ~0.9 s, a quick start, a slow settle with a small overshoot (PROPOSED easing `cubic-bezier(0.2, 0.9, 0.25, 1.08)`), and a slight vertical motion blur and stretch (blur 1.5 px, scaleY 1.02) while moving. The card arriving goes from dimmed and slightly smaller to full size and brightness; the card leaving does the reverse. Wrap around at the end, still rolling upward (clone the first cards after the last, and jump back without animation after the roll ends). The pinwheel's quarter turn runs in sync with the roll.
- **Domain view (CAROL):** "Sort by Domain" regroups the cards into one domain. A title shows the domain name ("Service Design") with small < > buttons beside it. Domains: **Product Design, Service Design, UX Design.** The < > buttons cycle between domains; each change rolls the new domain's cards up into the reel and the pinwheel turns a quarter and locks. Next Project moves within the current domain. Pressing Sort by Domain again returns to the full list (ASSUMPTION; confirm).
- **Cards:** the featured card (frame 32:377) has the project image, title, one-line description, institution logos, tags and "View Project >". The smaller card style (Nest, Petting Zoo) is for the cards waiting in the reel. For now reuse the existing three projects and their images, duplicated as needed so the reel and each domain have at least 2 cards (placeholders). Project data lives in one file (`js/projects.js`) with a `domains` array per project. PROPOSED assignment: Aangan -> service, ux; Nest -> service, product; Petting Zoo -> product, ux. Carol to correct.
- **Loading:** the pinwheel assembles first (flaps slide in and settle), then the buttons, then the cards. Stagger as global.
- Transition in from Experiences: push-in slide.
- Accessibility: reel is a list; the arriving card is announced via `aria-live="polite"` ("Project 2 of 3: Nest"); the buttons are labelled; the off-focus cards are `aria-hidden` and not tabbable. Reduced motion: no blur, no overshoot, instant change.

## 6. About section + footer (32:475)
- **About section (index):** burgundy ground; pink glyph mark on the left (the old weave/photo hover is REMOVED, CAROL); "Hello, I'm Carol," (Carol in mint) with the bio, the two achievement lines (trophy icons) and a mint "Learn More >" button. Learn More goes to `about.html`.
- **Loading:** the mark, then the heading, the bio, the two achievements one after the other, then the button.
- **Footer:** deep-teal ground. Tag line "SERVICE DESIGN • UX DESIGN • SYSTEMS DESIGN • UX STRATEGY • UX RESEARCH", then "Let's Build something good.", then the links (email beth.carol00@gmail.com as `mailto:`, LinkedIn, Behance, Instagram), then "All Rights Reserved by Carol Elizabeth © 2026" and "• DELHI, IN". The big tan cross on the left is STATIONARY: the 25 s spin is REMOVED (CAROL).
- **Footer loading:** the cross slides in from the left, then the tag line, the headline, the links and the small print stagger up.
- Same footer on `about.html`.

## 7. About Page (`about.html`, 32:516)
- Reached from the header About link on `index.html` and from Learn More. The header About item is active here.
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
- **Download Resume:** the Drive direct-download link `https://drive.google.com/uc?export=download&id=1vKV2FjA22p_7p2cgtlvxRMRCWcCI1144` (file must be shared "Anyone with the link"). The same file is the target of the header Resume item, `rel="noopener noreferrer"`, `target="_blank"`.
- Ends with the footer.

## Still unknown (do not invent)
- Exact flap hex values on the Works pinwheel and per-screen header mark colours: read from Figma.
- Project domain assignments (PROPOSED above), real project pages.
- Whether Sort by Domain toggles back to the full list.
- Final glyph colour tuning and splash timings: review in the browser, then lock.