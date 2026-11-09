// Splash (motion.md v2 section 1): plays once per page load, then reveals the Landing.
//
//   1. The square mark fades in at the centre                 (SPLASH.fadeIn)
//   2. It turns 360 degrees clockwise, then stops             (spinDuration + spinPause)
//   3. It turns 360 degrees again, then stops                 (spins = 2)
//   4. The mark and the teal ground dissolve into the Landing (SPLASH.dissolve)
//   Total 3.5 s.
//
// Uses the Web Animations API: each step is an animation with a delay, so the
// whole sequence is one timeline that can be finished at once when skipped.
// All durations and easings come from js/motion-config.js.
//
// Starts itself: index.html loads this module on its own (async, right after the
// splash markup), so the sequence begins as soon as this small file arrives instead
// of waiting for every other script. main.js imports the same module instance and
// waits on splashDone, a promise that resolves when the Landing is showing.

import { SPLASH } from './motion-config.js';

const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel'];

// Keyframes for the turns: each turn eases in and out, then the mark holds still
// for the pause. Offsets are fractions of the whole turning step.
function spinKeyframes(total) {
  const frames = [{ rotate: '0deg', offset: 0, easing: SPLASH.spinEasing }];
  let time = 0;
  for (let spin = 1; spin <= SPLASH.spins; spin += 1) {
    const angle = `${spin * SPLASH.spinAngle}deg`;
    time += SPLASH.spinDuration;
    frames.push({ rotate: angle, offset: time / total, easing: 'linear' }); // end of the turn
    time += SPLASH.spinPause;
    frames.push({ rotate: angle, offset: time / total, easing: SPLASH.spinEasing }); // end of the stop
  }
  return frames;
}

function startSplash() {
  const splash = document.querySelector('[data-js="splash"]');
  if (!splash) return Promise.resolve();

  // The rest of the page, made inert (not focusable, not clickable) while the splash
  // plays. The page may still be loading, so this runs again once it has all arrived.
  const pageParts = () => [...document.body.children].filter((el) => el !== splash && el.tagName !== 'SCRIPT');
  let playing = false;
  const makeInert = () => { if (playing) pageParts().forEach((el) => { el.inert = true; }); };

  function reveal() {
    playing = false;
    pageParts().forEach((el) => { el.inert = false; });
    splash.remove();
  }

  // Skip the sequence entirely: reduced motion, or the page was opened at an
  // address inside the page (e.g. #work, or coming back with the Back button).
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || location.hash) {
    reveal();
    return Promise.resolve();
  }

  playing = true;
  makeInert();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeInert, { once: true });

  const logo = splash.querySelector('[data-js="splash-logo"]');

  // Start times of each step, one after the other.
  const spinsAt = SPLASH.fadeIn;
  const spinsDuration = SPLASH.spins * (SPLASH.spinDuration + SPLASH.spinPause);
  const dissolveAt = spinsAt + spinsDuration;

  const timing = (delay, duration, easing) => ({ delay, duration, easing, fill: 'both' });

  const animations = [
    // Step 1: the mark fades in.
    logo.animate([{ opacity: 0 }, { opacity: 1 }], timing(0, SPLASH.fadeIn, 'linear')),
    // Steps 2-3: the turns and stops, as one animation with a keyframe per stop.
    logo.animate(spinKeyframes(spinsDuration), timing(spinsAt, spinsDuration, 'linear')),
    // Step 4: the whole overlay (mark and teal ground) fades out. No transform.
    splash.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      timing(dissolveAt, SPLASH.dissolve, SPLASH.dissolveEasing),
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

    // Any click, key press or scroll jumps straight to the end: the Landing.
    function skip() {
      finish();
    }

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { capture: true, passive: true }));

    // The sequence ends when the last animation (the dissolve) finishes.
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);
  });
}

// Runs once, however many times this module is imported.
export const splashDone = startSplash();
