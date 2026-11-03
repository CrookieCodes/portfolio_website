// Every motion value on the site, in one place, so it can be tuned here.
// Source: design/motion.md. Each value is tagged:
//   FIGMA    = read from the Figma prototype
//   CAROL    = stated by Carol
//   PROPOSED = starting value in motion.md, not yet approved
//   STARTER  = not in motion.md at all; a starting value Claude chose. Review in the browser.
// Durations are in milliseconds. Easings are CSS easing keywords.

// 1. Splash (motion.md section 1). Total: 600 + 600 + 500 + 800 + 700 = 3200 ms.
export const SPLASH = {
  sweepDuration: 600,        // PROPOSED: each duplicate-and-sweep (there are two)
  sweepEasing: 'ease-out',   // PROPOSED
  createDuration: 500,       // PROPOSED: the central logo is created
  createEasing: 'ease-out',  // STARTER: motion.md gives no easing for this step
  spinDuration: 800,         // PROPOSED: one full turn
  spinEasing: 'ease-in-out', // PROPOSED
  dissolveDuration: 700,     // PROPOSED: expand + dissolve into the hero
  dissolveEasing: 'ease-out',// STARTER: motion.md gives no easing for this step
  expandScale: 3,            // STARTER: how far the logo grows while it dissolves
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
  labelOffset: 16,           // STARTER: design px from the cursor ("slight offset")
  labelFontSize: 12,         // PROPOSED: design px at 1920 wide
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
  root.setProperty('--eye-label-offset', String(EYES.labelOffset));
  root.setProperty('--eye-label-font-size', String(EYES.labelFontSize));
}
