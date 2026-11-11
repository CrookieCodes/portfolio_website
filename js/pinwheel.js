// Selected Works pinwheel (motion.md v2 section 5, CAROL). It cannot spin freely:
// each turn() is a quarter turn clockwise about the hub, and the angle only ever
// grows (90, 180, 270, 360...), so it keeps going round the same way and locks at each
// stop. It rests in Figma's pose (49:291).
//
// The pinwheel is a fixed painting (CAROL, FINAL EDITS): its colours never change
// (css/works.css, tokens), the turn alone moves them. One quarter turn from rest gives
// Figma 49:416: the light flaps left and right, the brown triangles upper-right and
// lower-left. Values: WORKS.turnDuration and turnEasing in js/motion-config.js.
// Reduced motion: the new pose at once.

import { WORKS } from './motion-config.js';

export function createPinwheel(svg) {
  const flaps = svg.querySelector('[data-js="pinwheel-flaps"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let angle = 0;     // the resting pose (Figma's)
  let turning = null;

  function turn() {
    const from = angle;
    angle += 90;
    turning?.cancel();
    flaps.style.rotate = `${angle}deg`;
    if (reduceMotion.matches) return;
    turning = flaps.animate([{ rotate: `${from}deg` }, { rotate: `${angle}deg` }], {
      duration: WORKS.turnDuration,
      easing: WORKS.turnEasing,
    });
  }

  return { turn };
}
