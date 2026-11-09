// Selected Works pinwheel (motion.md v2 section 5, CAROL). It cannot spin freely:
// each turn() is a quarter turn clockwise about the hub, and the angle only ever
// grows (90, 180, 270, 360...), so it keeps going round the same way and locks at each
// stop. It rests a quarter turn from Figma's pose, with flap pair one horizontal.
//
// Colours (CAROL): every turn swaps which pair is horizontal. The horizontal pair is
// brown or burgundy, alternating step by step (brown at project 1); the vertical pair
// is always light pink. Pair one is the one horizontal on even steps, so it is brown
// or pink; pair two, burgundy or pink. The colours crossfade over the turn
// (css/works.css); with reduced motion everything changes at once.
// Values: WORKS in js/motion-config.js.

import { WORKS } from './motion-config.js';

export function createPinwheel(svg) {
  const flaps = svg.querySelector('[data-js="pinwheel-flaps"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let step = 0;      // turns so far
  let angle = 90;    // the resting pose (css/works.css)
  let turning = null;

  function paint() {
    const evenStep = step % 2 === 0;
    svg.style.setProperty('--flap-one', `var(${evenStep ? WORKS.flapBrown : WORKS.flapPink})`);
    svg.style.setProperty('--flap-two', `var(${evenStep ? WORKS.flapPink : WORKS.flapBurgundy})`);
  }

  function turn() {
    const from = angle;
    angle += 90;
    step += 1;
    paint();
    turning?.cancel();
    flaps.style.rotate = `${angle}deg`;
    if (reduceMotion.matches) return;
    turning = flaps.animate([{ rotate: `${from}deg` }, { rotate: `${angle}deg` }], {
      duration: WORKS.turnDuration,
      easing: WORKS.turnEasing,
    });
  }

  paint();
  return { turn };
}
