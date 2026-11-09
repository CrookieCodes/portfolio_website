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
  columns: 28,               // motion.md reference: about 28 cells across a shape
  minCell: 6,                // STARTER: smallest cell, so small squares stay legible
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

// Hover feedback: the Landing keyword label and the header link dot (CAROL: about 150 ms).
export const HOVER = {
  fade: 150,                 // CAROL: "about 150 ms"
  easing: 'ease-out',        // STARTER: no easing given
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
  root.setProperty('--cue-low-opacity', String(CUE.lowOpacity));
  root.setProperty('--motion-cue-period', `${CUE.period}ms`);
  root.setProperty('--motion-cue-easing', CUE.easing);
  root.setProperty('--motion-photo-duration', `${PHOTO.showDuration}ms`);
  root.setProperty('--motion-photo-easing', PHOTO.showEasing);
}
