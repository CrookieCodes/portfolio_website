// Optional settle (SETTLE in js/motion-config.js; off unless SETTLE.enabled).
//
// If the visitor stops scrolling for SETTLE.idle ms while a transition is part-way
// played (between SETTLE.from and SETTLE.to of it), the page scrolls the rest of the way
// to the nearer end over SETTLE.duration ms. It never blocks or captures input: every
// listener is passive and nothing calls preventDefault. Any wheel, touch, key or pointer
// input, or any scroll that is not its own (the scrollbar), stops it at once.
// Off with reduced motion.
//
// The transitions, as scroll ranges in page coordinates:
//   - blinds (data-js "wipe"): one screen of scrolling after the hold on the screen
//     being left (data-wipe-hold names its HOLD entry);
//   - push-ins (data-js "push-from", the incoming screen's wrapper): from the moment its
//     top edge is at the bottom of the window until it reaches the top.

import { SETTLE, HOLD } from './motion-config.js';

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);

function transitionRanges() {
  const h = window.innerHeight;
  const pageTop = (element) => element.getBoundingClientRect().top + window.scrollY;
  const ranges = [];
  document.querySelectorAll('[data-js~="wipe"]').forEach((wrapper) => {
    const start = pageTop(wrapper) + ((HOLD[wrapper.dataset.wipeHold] ?? 0) / 100) * h;
    ranges.push([start, start + h]);
  });
  document.querySelectorAll('[data-js~="push-from"]').forEach((wrapper) => {
    const end = pageTop(wrapper);
    ranges.push([end - h, end]);
  });
  return ranges;
}

export function initSettle() {
  if (!SETTLE.enabled) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let idleTimer = 0;
  let frame = 0;
  let ownY = null; // the scroll position the settle last set, while it runs

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    ownY = null;
  }

  function settleTo(from, to) {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / SETTLE.duration);
      ownY = Math.round(from + (to - from) * easeInOut(t));
      window.scrollTo({ top: ownY, behavior: 'instant' });
      frame = t < 1 ? requestAnimationFrame(step) : 0;
      if (!frame) ownY = null;
    };
    frame = requestAnimationFrame(step);
  }

  function checkIdle() {
    const y = window.scrollY;
    for (const [start, end] of transitionRanges()) {
      const p = (y - start) / (end - start);
      if (p > SETTLE.from && p < SETTLE.to) {
        settleTo(y, p < 0.5 ? start : end);
        return;
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (ownY !== null) {
      // A scroll that is not the settle's own (e.g. the scrollbar dragged): stop.
      if (Math.abs(window.scrollY - ownY) > 1) stop();
      return;
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(checkIdle, SETTLE.idle);
  }, { passive: true });

  // Any input stops a settle straight away (and the scroll it causes restarts the wait).
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => {
    window.addEventListener(type, () => { if (ownY !== null) stop(); clearTimeout(idleTimer); }, { passive: true, capture: true });
  });
}
