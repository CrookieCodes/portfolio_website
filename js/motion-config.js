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

// 5. Experiences -> Selected Works "blinds up" (CAROL): the same transition, same values.
export const WIPE_WORKS = {
  bars: 12,                  // PROPOSED
  spread: 0.5,               // PROPOSED
  swapAt: 0.98,              // PROPOSED
  headerCover: 1,            // PROPOSED
  coveredAt: 0.995,          // PROPOSED: Selected Works' load animation starts here
};

// Each blinds wrapper's data-wipe-name -> its values (js/wipe.js).
export const WIPES = { touchpoints: WIPE, works: WIPE_WORKS };

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

// 4. Experiences loading (motion.md v2 section 4, CAROL): the people first, then the
// photo wipes in behind them from the left, then the text. Once per page load, from the
// moment Experiences has arrived (PUSH.arriveAt). Times are ms from that moment.
export const EXPERIENCES_REVEAL = {
  ground: '#070606',         // PROPOSED: near-black ground before the photo
  figureStart: 200,          // PROPOSED: the first person's glyphs switch on
  figureStagger: 200,        // PROPOSED: then each next person (left to right)
  figureFade: 500,           // PROPOSED: each person's glyphs fade in over this long
  photoStart: 900,           // PROPOSED: the photo starts to wipe in from the left edge
  photoWipe: 1600,           // PROPOSED: ... reaching the right edge after this long
  photoSettleFrom: 1.06,     // PROPOSED: the photo eases from this scale to 1 as it wipes in
  photoEasing: 'cubic-bezier(0.22, 1, 0.36, 1)', // STARTER: "ease out, fast start, slow finish"
  textAt: 2400,              // PROPOSED: the heading and bullets start their load animation
  glyphCycle: 4000,          // PROPOSED: one top-to-bottom glyph sweep on the people
};

// Push-in slides (css/push.css, js/push-in.js). q = how far the incoming screen has
// entered the window: 0 with its top edge at the bottom, 1 when it covers the screen.
export const PUSH = {
  arriveAt: 0.98,            // PROPOSED: the incoming screen counts as arrived
  drift: 12,                 // PROPOSED: Touchpoints drifts up by q x 12% of the screen
  veil: 0.12,                // PROPOSED: ... under a black veil fading to 12% at q = 1
  headerCover: 1,            // PROPOSED: each header item takes the incoming theme once the
                             //           incoming top edge has covered this share of it
                             //           (1 = passed its top edge)
};

// Push-in, Selected Works -> About (motion.md v2 "Transitions between screens"): the
// same push-in as Touchpoints -> Experiences, run by the same code with these values.
export const PUSH_ABOUT = {
  arriveAt: 0.98,            // PROPOSED: About counts as arrived; its load starts here
  drift: 12,                 // PROPOSED: Works drifts up by q x 12% of the screen
  veil: 0.12,                // PROPOSED: ... under a black veil fading to 12% at q = 1
  headerCover: 1,            // PROPOSED: as PUSH.headerCover
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

// 5. Selected Works (motion.md v2 section 5, CAROL): the pinwheel and the card reel.
export const WORKS = {
  turnDuration: 900,         // CAROL: the pinwheel's quarter turn (and its colour crossfade)
  turnEasing: 'ease-in-out', // CAROL
  rollDuration: 900,         // PROPOSED: the reel rolls one card up, in sync with the turn
  rollEasing: 'cubic-bezier(0.2, 0.9, 0.25, 1.08)', // PROPOSED: quick start, slow settle, small overshoot
  rollBlur: 1.5,             // PROPOSED: px of vertical motion blur while rolling
  rollStretch: 1.02,         // PROPOSED: vertical stretch while rolling
  rollBlurPeak: 0.35,        // STARTER: when in the roll the blur and stretch peak (0-1)
  cardDim: 0.6,              // STARTER: brightness of a card arriving or leaving (1 = full)
  cardShrink: 0.94,          // STARTER: scale of a card arriving or leaving
  // Flap colours (CAROL): the two horizontal flaps are brown or burgundy, alternating
  // with each step (brown at project 1), the two vertical flaps always light pink.
  flapBrown: '--color-bronze',   // PROPOSED
  flapBurgundy: '--color-burgundy', // PROPOSED
  flapPink: '--color-pink',      // PROPOSED (#F2909F); colours crossfade over turnDuration
};

// Standard loading animation, every screen (motion.md v2 "Global", CAROL: simple and
// consistent). Items slide up and fade in, one after another, once per page load.
export const REVEAL = {
  distance: 24,              // PROPOSED: design px the items rise as they fade in
  stagger: 90,               // PROPOSED: delay between one item and the next
  duration: 600,             // CAROL: each item
  easing: 'ease-out',        // CAROL
  threshold: 0.15,           // STARTER: share of the screen in view before it plays
  fromRight: 80,             // PROPOSED: design px an item with data-reveal-from="right"
                             //           slides in from as it fades in (the footer cross)
};

// Header over the footer (CAROL): the header is not shown over the footer. It fades out
// once the footer reaches the header band, and back in when scrolling up.
export const HEADER = {
  footerFade: 300,           // PROPOSED: the fade out and back in
  footerEasing: 'ease-out',  // PROPOSED
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

// Shared cursor label (js/cursor-label.js), e.g. "Click to view project".
export const LABEL = {
  fade: 150,                 // PROPOSED: fades in on enter, out on leave
  easing: 'ease-out',        // STARTER
  offset: 16,                // STARTER: design px between the cursor and the label
  fontSize: 12,              // PROPOSED: design px at 1920 wide
};

// Copy the values CSS needs onto :root as custom properties, so CSS transitions
// read the same numbers as the scripts (e.g. var(--motion-reveal-duration)).
export function applyMotionVariables() {
  const root = document.documentElement.style;
  root.setProperty('--motion-pupil-lag', `${EYES.pupilLag}ms`);
  root.setProperty('--motion-pupil-easing', EYES.pupilEasing);
  root.setProperty('--motion-label-fade', `${LABEL.fade}ms`);
  root.setProperty('--motion-label-easing', LABEL.easing);
  root.setProperty('--label-font-size', String(LABEL.fontSize));
  root.setProperty('--motion-works-turn', `${WORKS.turnDuration}ms`);
  root.setProperty('--motion-works-turn-easing', WORKS.turnEasing);
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
  root.setProperty('--cue-low-opacity', String(CUE.lowOpacity));
  root.setProperty('--motion-cue-period', `${CUE.period}ms`);
  root.setProperty('--motion-cue-easing', CUE.easing);
  root.setProperty('--motion-header-fade', `${HEADER.footerFade}ms`);
  root.setProperty('--motion-header-easing', HEADER.footerEasing);
}
