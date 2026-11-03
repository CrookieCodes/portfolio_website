// Splash (motion.md section 1): plays once per page load, then reveals the hero.
//
//   1. One cross (bottom-left). It duplicates and sweeps right   -> 2 crosses
//   2. The pair duplicates and sweeps up                          -> 4 crosses
//   3. The pale-teal centre of the logo is created (fades in)
//   4. The whole logo spins once
//   5. The logo and the teal ground dissolve into the hero underneath (no growing)
//
// Uses the Web Animations API: each step is an animation with a delay, so the
// whole sequence is one timeline that can be finished at once when skipped.
// All durations and easings come from js/motion-config.js.
//
// initSplash() returns a promise that resolves when the hero is showing, so
// other hero animations (the headline cycle) can wait for it.

import { SPLASH } from './motion-config.js';

const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel'];

export function initSplash() {
  const splash = document.querySelector('[data-js="splash"]');
  if (!splash) return Promise.resolve();

  // The rest of the page, made inert (not focusable, not clickable) while the splash plays.
  const pageParts = [...document.body.children].filter((el) => el !== splash && el.tagName !== 'SCRIPT');

  function reveal() {
    pageParts.forEach((el) => { el.inert = false; });
    splash.remove();
  }

  // Skip the sequence entirely: reduced motion, or the page was opened at an
  // address inside the page (e.g. #work, or coming back with the Back button).
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || location.hash) {
    reveal();
    return Promise.resolve();
  }

  pageParts.forEach((el) => { el.inert = true; });

  const logo = splash.querySelector('[data-js="splash-logo"]');
  const centre = splash.querySelector('[data-js="splash-centre"]');
  const bottomRight = splash.querySelector('[data-js="splash-cross-bottom-right"]');
  const topLeft = splash.querySelector('[data-js="splash-cross-top-left"]');
  const topRight = splash.querySelector('[data-js="splash-cross-top-right"]');

  // Start times of each step, one after the other.
  const sweep1At = 0;
  const sweep2At = sweep1At + SPLASH.sweepDuration;
  const createAt = sweep2At + SPLASH.sweepDuration;
  const spinAt = createAt + SPLASH.createDuration;
  const dissolveAt = spinAt + SPLASH.spinDuration;

  const timing = (delay, duration, easing) => ({ delay, duration, easing, fill: 'both' });

  const animations = [
    // Step 1: the copy sweeps right.
    bottomRight.animate(
      [{ transform: 'translate(-130px, 0)' }, { transform: 'translate(0, 0)' }],
      timing(sweep1At, SPLASH.sweepDuration, SPLASH.sweepEasing),
    ),
    // Step 2: the copies of the pair sweep up. Top-right rides along with step 1 first,
    // so it is a single two-part animation (keyframe easing applies to each part).
    topLeft.animate(
      [{ transform: 'translate(-1px, 130px)' }, { transform: 'translate(0, 0)' }],
      timing(sweep2At, SPLASH.sweepDuration, SPLASH.sweepEasing),
    ),
    topRight.animate(
      [
        { transform: 'translate(-130px, 130px)', easing: SPLASH.sweepEasing },
        { transform: 'translate(0, 130px)', easing: SPLASH.sweepEasing },
        { transform: 'translate(0, 0)' },
      ],
      { delay: sweep1At, duration: SPLASH.sweepDuration * 2, fill: 'both' },
    ),
    // Step 3: the centre of the logo is created.
    centre.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      timing(createAt, SPLASH.createDuration, SPLASH.createEasing),
    ),
    // Step 4: one full spin.
    logo.animate(
      [{ rotate: '0deg' }, { rotate: '360deg' }],
      timing(spinAt, SPLASH.spinDuration, SPLASH.spinEasing),
    ),
    // Step 5: the whole overlay (logo and teal ground) fades out. No transform.
    splash.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      timing(dissolveAt, SPLASH.dissolveDuration, SPLASH.dissolveEasing),
    ),
  ];

  return new Promise((resolve) => {
    let done = false;

    function finish() {
      if (done) return;
      done = true;
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip, true));
      animations.forEach((animation) => animation.cancel());
      reveal();
      resolve();
    }

    // Any click, key press or scroll jumps straight to the end: the hero.
    function skip() {
      finish();
    }

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { capture: true, passive: true }));

    // The sequence ends when the last animation (the dissolve) finishes.
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);
  });
}
