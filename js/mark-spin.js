// The C mark's own entrance (CAROL), shared by About and the footer: when its screen
// arrives, the mark turns in from MARK_SPIN.rotateFrom degrees, grows from
// MARK_SPIN.scaleFrom and fades in, over MARK_SPIN.duration with a strong ease-out.
// A cue that belongs to the mark (the footer's "< Click to Return Home") fades in as the
// mark settles (MARK_SPIN.cueDelay). js/reveal.js plays it, once per page load, and
// starts the screen's text stagger MARK_SPIN.textDelay after the mark begins.
//
// The turn and growth use the `transform` property, so they add to the mark's own
// resting tilt (its `rotate` in CSS) instead of replacing it. The animations are made
// at once, paused, with fill 'both', so the mark and cue stay hidden until they play.
// Reduced motion: a plain fade, no turn and no growth.

import { MARK_SPIN } from './motion-config.js';

export function createMarkSpin(mark, cue, reduceMotion) {
  const turn = reduceMotion
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [
      { opacity: 0, transform: `rotate(${MARK_SPIN.rotateFrom}deg) scale(${MARK_SPIN.scaleFrom})` },
      { opacity: 1, transform: 'none' },
    ];
  const animations = [
    mark.animate(turn, { duration: MARK_SPIN.duration, easing: reduceMotion ? 'linear' : MARK_SPIN.easing, fill: 'both' }),
  ];
  if (cue) {
    animations.push(cue.animate([{ opacity: 0 }, { opacity: 1 }], {
      delay: reduceMotion ? 0 : MARK_SPIN.cueDelay,
      duration: MARK_SPIN.cueDuration,
      easing: 'ease-out',
      fill: 'both',
    }));
  }
  animations.forEach((animation) => animation.pause());

  return {
    play() { animations.forEach((animation) => animation.play()); },
    finish() { animations.forEach((animation) => animation.finish()); },
  };
}
