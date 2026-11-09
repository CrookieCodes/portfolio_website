// Every motion value on the site, in one place, so it can be tuned here.
// Source: design/motion.md. Each value is tagged:
//   FIGMA    = read from the Figma prototype
//   CAROL    = stated by Carol
//   PROPOSED = starting value in motion.md, not yet approved
//   STARTER  = not in motion.md at all; a starting value Claude chose. Review in the browser.
// Durations are in milliseconds. Easings are CSS easing keywords.

// 1. Splash (motion.md v2 section 1, CAROL). Total: 400 + 2 x (700 + 500) + 700 = 3500 ms.
export const SPLASH = {
  fadeIn: 400,               // CAROL: the mark fades in at the centre
  spins: 2,                  // CAROL: two full turns clockwise
  spinAngle: 360,            // CAROL: degrees per turn
  spinDuration: 700,         // CAROL: each turn
  spinEasing: 'ease-in-out', // CAROL
  spinPause: 500,            // CAROL: the stop after each turn
  dissolve: 700,             // CAROL: mark and teal ground fade into the Landing
  dissolveEasing: 'ease-out',// STARTER: kept from the old splash; no easing given for the new one
};

// 2. Landing eyes (motion.md v2 section 2).
export const EYES = {
  pupilLag: 120,             // PROPOSED: smooth follow behind the cursor
  pupilEasing: 'ease-out',   // STARTER: motion.md gives no easing for the follow
  pupilReach: 371,           // STARTER: design px from the eye's centre at which the
                             //          pupil reaches the edge of its range (one eye width)
};

// 2. Landing -> Touchpoints "blinds up" (motion.md v2 section 2, CAROL). Tied to the
// scroll, so it has no duration: it runs over one screen of scrolling.
export const WIPE = {
  bars: 12,                  // PROPOSED: vertical bars, each 1/12 of the screen width; the bars
                             //           show the Touchpoints screen itself (its ground is #F7F7F7)
  spread: 0.5,               // PROPOSED: share of the scroll over which the bars' starts are spread
                             //           (bar 0 starts at 0, the last at 0.5; each rises over 0.5)
  swapAt: 0.98,              // PROPOSED: the whole header (band included) takes the Touchpoints
                             //           theme once the last bar has landed
  headerCover: 1,            // PROPOSED: before that, each header item (logo, each link) swaps on
                             //           its own once the bar beneath it covers this share of it,
                             //           measured from its bottom edge (1 = fully covered)
  coveredAt: 0.995,          // PROPOSED: Touchpoints shows and its load animation starts
};

// 3. Touchpoints diagram assembly (motion.md v2 section 3, CAROL: piece by piece, once,
// about 2 to 2.5 s in all). The step timings are not in motion.md; these are starting
// values. Start times are from the moment the heading and bullets have loaded.
export const BUILD = {
  baseAt: 0,      baseDuration: 350,   // STARTER: the base square fades and grows in
  handAt: 200,    handDuration: 500,   // STARTER: the hand rises in behind it
  handRise: 0.3,                       // STARTER: share of the hand's height it rises through
  linesAt: 600,   linesDuration: 650,  // STARTER: the lines draw outward from the base square
  squaresAt: 1150, squareDuration: 300, squareStagger: 70, // STARTER: the squares pop in, one by one
  squareFrom: 0.6,                     // CAROL: squares scale from 0.6 to 1
  dotsAt: 1750,   dotsDuration: 350,   // STARTER: the dots appear, then start flowing (ends at 2.1 s)
  easing: 'ease-out',                  // STARTER
};

// 4. Experiences: "light reveals the scene" (motion.md v2 section 4, CAROL's prototype),
// once per page load, starting when Experiences has arrived (PUSH.arriveAt). Times are
// ms from that moment.
export const EXPERIENCES_REVEAL = {
  startDelay: 200,           // PROPOSED: before the band of light starts moving
  sweepDuration: 1900,       // PROPOSED: the band crosses from the left edge past the right edge
  bandWidth: 0.23,           // PROPOSED: the band's soft edge, as a share of the screen width
  veilAlpha: 0.97,           // PROPOSED: the veil ahead of the band, rgba(6, 5, 5, 0.97)
  figureLag: 250,            // PROPOSED: a person's glyphs switch on this long after the band passes
  figureFade: 500,           // PROPOSED: ... fading in over this long
  textAt: 2500,              // PROPOSED: the heading and bullets start their load animation
  glyphCycle: 4000,          // PROPOSED (added: "about 4 s"): one top-to-bottom glyph sweep on the people
};

// Push-in slides (css/push.css): when the incoming screen counts as arrived.
export const PUSH = {
  arriveAt: 0.98,            // STARTER: share of the screen slid in (0 to 1); not given in motion.md
};

// 3. Touchpoints dot flow (motion.md section 3: "loop gently while in view").
export const DOTS = {
  speed: 120,                // STARTER: design px per second along the lines
                             //          (a full route takes about 6-9 s)
};

// ASCII effect (motion.md "ASCII effect"), shared by screens 3 and 4.
// Distances are design px (the 1920 x 1080 frame).
export const ASCII = {
  passDuration: 5000,        // PROPOSED: one sweep of the band across all shapes, then it loops
                             //          (outward on screen 3, top to bottom on screen 4)
  fps: 30,                   // motion.md: frame-rate cap
  cell: 8,                   // CAROL: glyph cell size in design px (at 1920 wide; scales with the
                             //        screen like everything else), on every glyph effect
  bandWidth: 60,             // STARTER: depth of each zone: dense circles, then diamonds, then stars
  thinning: 0.7,             // STARTER: share of cells already empty by the end of the trail (0-1)
  staticAt: 0.45,            // STARTER: reduced motion draws the pass frozen at this point (0-1),
                             //          so every glyph stage is visible
};

// 5. Selected Works cards (motion.md section 5).
export const CARDS = {
  liftDistance: 4,           // PROPOSED: design px the card rises on hover
  liftDuration: 200,         // PROPOSED
  liftEasing: 'ease-out',    // PROPOSED
};

// Standard loading animation, every screen (motion.md v2 "Global", CAROL: simple and
// consistent). Items slide up and fade in, one after another, once per page load.
export const REVEAL = {
  distance: 24,              // PROPOSED: design px the items rise as they fade in
  stagger: 90,               // PROPOSED: delay between one item and the next
  duration: 600,             // CAROL: each item
  easing: 'ease-out',        // CAROL
  threshold: 0.15,           // STARTER: share of the screen in view before it plays
};

// Scroll cue "Scroll down for more details" (motion.md v2 "Global", CAROL).
export const CUE = {
  lowOpacity: 0.35,          // PROPOSED: the pulse goes from 1 down to this and back
  period: 1600,              // PROPOSED: one full pulse (1 -> 0.35 -> 1)
  easing: 'ease-in-out',     // PROPOSED
};

// Hover feedback (CAROL).
export const HOVER = {
  fade: 150,                 // CAROL: "about 150 ms": header link text and dot
  easing: 'ease-out',        // STARTER: no easing given for the fade
  wipe: 250,                 // CAROL: "about 250 ms": the keyword label wipes in from the left
                             //        (and back out); the word fades to white over the same time
  wipeEasing: 'ease-out',    // CAROL
  keywordRest: 0.7,          // PROPOSED: keyword text and underline at rest, share of full white
  navRest: 0.7,              // PROPOSED: header link text at rest, share of full contrast
                             //           (the active link stays at full contrast)
};

// Header logo swap, primary (Landing) <-> secondary pinwheel (motion.md v2 "Header", CAROL).
export const LOGO = {
  spinAngle: 90,             // CAROL: degrees per swap (clockwise going down, back going up)
  spinDuration: 500,         // CAROL: the whole spin; the mark changes at the midpoint
  spinEasing: 'ease-in-out', // STARTER: motion.md gives no easing for the spin
};

// 6. About photo reveal (motion.md section 6).
export const PHOTO = {
  showDuration: 300,         // FIGMA: Dissolve on mouse enter
  showEasing: 'ease-out',    // FIGMA
                             // FIGMA: mouse leave changes back instantly (no value needed)
};

// 6. Footer cross (motion.md section 6).
export const SPIN = {
  interval: 25000,           // CAROL: one full turn every 25 s of the footer being in view
  duration: 1200,            // PROPOSED
  easing: 'ease-in-out',     // PROPOSED
};

// Copy the values CSS needs onto :root as custom properties, so CSS transitions
// read the same numbers as the scripts (e.g. var(--motion-reveal-duration)).
export function applyMotionVariables() {
  const root = document.documentElement.style;
  root.setProperty('--motion-pupil-lag', `${EYES.pupilLag}ms`);
  root.setProperty('--motion-pupil-easing', EYES.pupilEasing);
  root.setProperty('--card-lift', String(CARDS.liftDistance));
  root.setProperty('--motion-card-lift-duration', `${CARDS.liftDuration}ms`);
  root.setProperty('--motion-card-lift-easing', CARDS.liftEasing);
  root.setProperty('--reveal-distance', String(REVEAL.distance));
  root.setProperty('--motion-reveal-duration', `${REVEAL.duration}ms`);
  root.setProperty('--motion-reveal-stagger', `${REVEAL.stagger}ms`);
  root.setProperty('--motion-reveal-easing', REVEAL.easing);
  root.setProperty('--motion-hover-fade', `${HOVER.fade}ms`);
  root.setProperty('--motion-hover-easing', HOVER.easing);
  root.setProperty('--motion-wipe', `${HOVER.wipe}ms`);
  root.setProperty('--motion-wipe-easing', HOVER.wipeEasing);
  root.setProperty('--keyword-rest-mix', `${HOVER.keywordRest * 100}%`);
  root.setProperty('--nav-rest-mix', `${HOVER.navRest * 100}%`);
  root.setProperty('--veil-band', String(EXPERIENCES_REVEAL.bandWidth));
  root.setProperty('--veil-colour', `rgba(6, 5, 5, ${EXPERIENCES_REVEAL.veilAlpha})`);
  root.setProperty('--cue-low-opacity', String(CUE.lowOpacity));
  root.setProperty('--motion-cue-period', `${CUE.period}ms`);
  root.setProperty('--motion-cue-easing', CUE.easing);
  root.setProperty('--motion-photo-duration', `${PHOTO.showDuration}ms`);
  root.setProperty('--motion-photo-easing', PHOTO.showEasing);
}
