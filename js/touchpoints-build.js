// Touchpoints diagram assembly (motion.md v2 section 3, CAROL), once per page load.
//
// After the heading and bullets have loaded (the screen's "reveal:done" event from
// js/reveal.js), the diagram builds itself piece by piece:
//   1. the base square appears
//   2. the hand rises in behind it
//   3. the lines draw outward from the base square (stroke-dashoffset)
//   4. the other squares pop in at the line ends (scale 0.6 -> 1), with their glyphs
//   5. the dots appear, then start flowing (js/dot-flow.js waits for data-scene-built)
// Timings: BUILD in js/motion-config.js. With reduced motion everything is simply
// there (no build), and the screen is marked built straight away.

import { BUILD } from './motion-config.js';
import { REVEAL_DONE } from './reveal.js';

export function initTouchpointsBuild() {
  const diagram = document.querySelector('[data-js~="diagram"]');
  const screen = diagram?.closest('[data-js~="screen"]');
  if (!diagram || !screen) return;

  const done = () => { screen.dataset.sceneBuilt = 'true'; };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    done();
    return;
  }

  const base = diagram.querySelector('[data-square="teal-base"]');
  const squares = [...diagram.querySelectorAll('[data-square]')].filter((square) => square !== base);
  const lines = [...diagram.querySelectorAll('.scene__line')];
  const dots = [...diagram.querySelectorAll('[data-js="dot-group"]')];
  const hands = [...screen.querySelectorAll('[data-js="build-hand"]')];
  const canvas = screen.querySelector('[data-js~="ascii-touchpoints"]');

  // Every step is an animation made now, paused, with fill 'both': until it plays,
  // each piece shows its first keyframe (hidden). Playing them all at once runs the
  // build, as each has its own delay.
  const at = (delay, duration) => ({ delay, duration, easing: BUILD.easing, fill: 'both' });
  const steps = [];
  const add = (element, keyframes, timing) => { if (element) steps.push(element.animate(keyframes, timing)); };

  const grow = [{ opacity: 0, scale: BUILD.squareFrom }, { opacity: 1, scale: 1 }];
  add(base, grow, at(BUILD.baseAt, BUILD.baseDuration));
  hands.forEach((hand) => add(hand, [
    { opacity: 0, translate: `0 ${BUILD.handRise * 100}%` },
    { opacity: 1, translate: '0 0' },
  ], at(BUILD.handAt, BUILD.handDuration)));
  lines.forEach((line) => {
    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    add(line, [{ strokeDashoffset: length }, { strokeDashoffset: 0 }], at(BUILD.linesAt, BUILD.linesDuration));
  });
  squares.forEach((square, index) => add(square, grow, at(BUILD.squaresAt + index * BUILD.squareStagger, BUILD.squareDuration)));
  // The glyphs cover the squares (and the base square's own colours), so they come in
  // with the squares and are in place when the last square has popped in.
  const squaresEnd = (squares.length - 1) * BUILD.squareStagger + BUILD.squareDuration;
  add(canvas, [{ opacity: 0 }, { opacity: 1 }], at(BUILD.squaresAt, squaresEnd));
  dots.forEach((group) => add(group, [{ opacity: 0 }, { opacity: 1 }], at(BUILD.dotsAt, BUILD.dotsDuration)));

  steps.forEach((step) => step.pause());

  function play() {
    steps.forEach((step) => step.play());
    // The dots start flowing once they have appeared.
    setTimeout(done, BUILD.dotsAt + BUILD.dotsDuration);
  }

  if (screen.dataset.revealed) {
    play();
  } else {
    screen.addEventListener(REVEAL_DONE, play, { once: true });
  }
}
