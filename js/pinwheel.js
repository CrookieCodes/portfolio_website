// Selected Works pinwheel (motion.md v2 section 5, CAROL). It cannot spin freely:
// each turn() is a quarter turn clockwise about the hub, and the angle only ever
// grows (90, 180, 270, 360, 450...), so it keeps going round the same way and locks
// at each stop. On every stop the coloured flaps switch between set A (tan and
// burgundy) and set B (pink and bronze): a class swaps the colours and CSS crossfades
// them over the same time (css/works.css). assemble() slides the flaps in from
// around the hub. Values: WORKS in js/motion-config.js.

import { WORKS } from './motion-config.js';

const HUB = { x: 383.32, y: 382.32 }; // where the flaps meet, in the SVG's units

export function createPinwheel(svg) {
  const flaps = svg.querySelector('[data-js="pinwheel-flaps"]');
  const pieces = [...svg.querySelectorAll('[data-js="pinwheel-flap"]')];
  const stick = svg.querySelector('.pinwheel__stick');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let angle = 0;
  let turning = null;

  function turn() {
    const from = angle;
    angle += 90;
    svg.classList.toggle('pinwheel--alt');
    turning?.cancel();
    flaps.style.rotate = `${angle}deg`;
    if (reduceMotion.matches) return;
    turning = flaps.animate([{ rotate: `${from}deg` }, { rotate: `${angle}deg` }], {
      duration: WORKS.turnDuration,
      easing: WORKS.turnEasing,
    });
  }

  // Hide the flaps until assemble() (not with reduced motion, and only from script,
  // so without JavaScript the pinwheel simply shows).
  function prepare() {
    if (reduceMotion.matches) return;
    [stick, ...pieces].forEach((piece) => { piece.style.opacity = '0'; });
  }

  // Each flap slides in from outward of the hub and settles. Resolves when done.
  function assemble() {
    if (reduceMotion.matches) return Promise.resolve();
    const moves = pieces.map((piece, index) => {
      const box = piece.getBBox();
      const dx = box.x + box.width / 2 - HUB.x;
      const dy = box.y + box.height / 2 - HUB.y;
      const length = Math.hypot(dx, dy) || 1;
      const offset = `${(dx / length) * WORKS.flapDistance}px ${(dy / length) * WORKS.flapDistance}px`;
      piece.style.opacity = '';
      return piece.animate([{ opacity: 0, translate: offset }, { opacity: 1, translate: '0 0' }], {
        duration: WORKS.flapDuration,
        delay: index * WORKS.flapStagger,
        easing: WORKS.flapEasing,
        fill: 'backwards',
      }).finished;
    });
    stick.style.opacity = '';
    moves.push(stick.animate([{ opacity: 0 }, { opacity: 1 }], { duration: WORKS.flapDuration, fill: 'backwards' }).finished);
    return Promise.all(moves).then(() => {}, () => {});
  }

  return { turn, prepare, assemble };
}
