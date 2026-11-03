// Every motion value on the site, in one place, so it can be tuned here.
// Source: design/motion.md. Each value is tagged:
//   FIGMA    = read from the Figma prototype
//   CAROL    = stated by Carol
//   PROPOSED = starting value in motion.md, not yet approved
//   STARTER  = not in motion.md at all; a starting value Claude chose. Review in the browser.
// Durations are in milliseconds. Easings are CSS easing keywords.

// 1. Splash (motion.md section 1). Total: 600 + 600 + 500 + 1400 + 700 = 3800 ms.
export const SPLASH = {
  sweepDuration: 600,        // PROPOSED: each duplicate-and-sweep (there are two)
  sweepEasing: 'ease-out',   // PROPOSED
  createDuration: 500,       // PROPOSED: the central logo is created
  createEasing: 'ease-out',  // STARTER: motion.md gives no easing for this step
  spinDuration: 1400,        // PROPOSED (CAROL tweak): one full turn, slower
  spinEasing: 'ease-in-out', // PROPOSED
  dissolveDuration: 700,     // PROPOSED: logo and teal ground fade into the hero (no growing)
  dissolveEasing: 'ease-out',// CAROL
};

// 2. Hero headline cycle (motion.md section 2).
export const HEADLINE = {
  delay: 1600,               // FIGMA: time each word stays before changing
  duration: 300,             // FIGMA: Smart animate
  easing: 'ease-out',        // FIGMA
};

// 2. Hero eyes (motion.md section 2).
export const EYES = {
  pupilLag: 120,             // PROPOSED: smooth follow behind the cursor
  pupilEasing: 'ease-out',   // STARTER: motion.md gives no easing for the follow
  pupilReach: 371,           // STARTER: design px from the eye's centre at which the
                             //          pupil reaches the edge of its range (one eye width)
  labelFade: 150,            // PROPOSED: "Click to Explore" fades in
  labelEasing: 'ease-out',   // STARTER: motion.md gives no easing for the fade
  labelOffset: 16,           // STARTER: design px from the cursor ("slight offset")
  labelFontSize: 12,         // PROPOSED: design px at 1920 wide
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

// 5 and 6. Loading animation for Selected Works and About (motion.md, CAROL: "simple").
export const REVEAL = {
  distance: 16,              // motion.md: design px the items rise as they fade in
  stagger: 80,               // motion.md: delay between one item and the next
  duration: 400,             // motion.md
  easing: 'ease-out',        // motion.md
  threshold: 0.15,           // STARTER: share of the screen in view before it plays
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
// read the same numbers as the scripts (e.g. var(--motion-headline-duration)).
export function applyMotionVariables() {
  const root = document.documentElement.style;
  root.setProperty('--motion-headline-duration', `${HEADLINE.duration}ms`);
  root.setProperty('--motion-headline-easing', HEADLINE.easing);
  root.setProperty('--motion-pupil-lag', `${EYES.pupilLag}ms`);
  root.setProperty('--motion-pupil-easing', EYES.pupilEasing);
  root.setProperty('--motion-label-fade', `${EYES.labelFade}ms`);
  root.setProperty('--motion-label-easing', EYES.labelEasing);
  root.setProperty('--eye-label-font-size', String(EYES.labelFontSize));
  root.setProperty('--card-lift', String(CARDS.liftDistance));
  root.setProperty('--motion-card-lift-duration', `${CARDS.liftDuration}ms`);
  root.setProperty('--motion-card-lift-easing', CARDS.liftEasing);
  root.setProperty('--reveal-distance', String(REVEAL.distance));
  root.setProperty('--motion-reveal-duration', `${REVEAL.duration}ms`);
  root.setProperty('--motion-reveal-stagger', `${REVEAL.stagger}ms`);
  root.setProperty('--motion-reveal-easing', REVEAL.easing);
  root.setProperty('--motion-photo-duration', `${PHOTO.showDuration}ms`);
  root.setProperty('--motion-photo-easing', PHOTO.showEasing);
}
