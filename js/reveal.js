// Standard loading animation (motion.md v2 "Global"): when a screen comes into view for
// the first time, its items (data-js containing "reveal") slide up and fade in, one
// after another, once per page load. With reduced motion, nothing is hidden or moved.
//
// Order: items play in DOM order unless they carry data-reveal-order="n" (lower
// numbers first; items with the same number start together, so a group can share a
// step). Items without an order come after the ordered ones, in DOM order.
//
// An item with data-reveal-from="right" slides in from the right (REVEAL.fromRight
// design px) as it fades in, instead of rising (the footer cross).
//
// A screen with data-reveal-wait="name" waits for the promise passed in as
// waitFor[name] before it plays (the Landing waits for the splash to finish).
//
// A screen with a C mark (data-js "mark-spin": About, the footer) plays the mark's own
// entrance first (js/mark-spin.js) and starts the stagger MARK_SPIN.textDelay later.
// With reduced motion the text is simply visible and the mark fades in.
//
// When the last item of a screen has finished, the screen fires a "reveal:done"
// event, so a screen's own build (the Touchpoints diagram, the Experiences figures)
// can start after its text. With reduced motion it fires straight away.
//
// Hold zones (HOLD in js/motion-config.js): a screen's load must be complete before the
// next transition covers it. The transitions (js/wipe.js, js/push-in.js) fire
// "screen:leave" on the screen being left as soon as they start; if its load is still
// running, it jumps to the end state, and a load that has not started yet plays
// instantly.

import { REVEAL, MARK_SPIN } from './motion-config.js';
import { createMarkSpin } from './mark-spin.js';

export const REVEAL_DONE = 'reveal:done';
export const SCREEN_LEAVE = 'screen:leave';

// Tells a screen that the next transition has started to cover it.
export function leaveScreen(screen) {
  screen?.dispatchEvent(new CustomEvent(SCREEN_LEAVE));
}

// Sort key for one item: its data-reveal-order, or after every ordered item.
function orderOf(item) {
  const order = Number.parseFloat(item.dataset.revealOrder);
  return Number.isFinite(order) ? order : Infinity;
}

// Groups a screen's items into steps: [[items of step 0], [items of step 1], ...].
function stepsOf(items) {
  const sorted = items
    .map((item, domIndex) => ({ item, domIndex, order: orderOf(item) }))
    .sort((a, b) => (a.order - b.order) || (a.domIndex - b.domIndex));
  const steps = [];
  let lastOrder = null;
  sorted.forEach(({ item, order }) => {
    // Unordered items each get their own step; ordered items share one per number.
    if (order === Infinity || order !== lastOrder) steps.push([]);
    steps[steps.length - 1].push(item);
    lastOrder = order;
  });
  return steps;
}

function announceDone(screen) {
  screen.dispatchEvent(new CustomEvent(REVEAL_DONE));
  screen.dataset.revealed = 'true'; // for modules that start later and need to check
}

export function initReveal({ waitFor = {} } = {}) {
  // Hidden items (e.g. Learn More with no destination yet) are left out of the stagger.
  const items = [...document.querySelectorAll('[data-js~="reveal"]')].filter((item) => !item.hidden);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screenOf = (element) => element.closest('[data-js~="screen"]');

  // Group the items by screen.
  const groups = new Map();
  items.forEach((item) => {
    const screen = screenOf(item);
    if (!screen) return;
    if (!groups.has(screen)) groups.set(screen, []);
    groups.get(screen).push(item);
  });

  // The C marks with their own entrance (js/mark-spin.js), by screen; each may have a cue
  // (data-js "mark-cue") in the same screen.
  const marks = new Map();
  document.querySelectorAll('[data-js~="mark-spin"]').forEach((mark) => {
    const screen = screenOf(mark);
    if (!screen) return;
    if (!groups.has(screen)) groups.set(screen, []);
    const cue = screen.querySelector('[data-js~="mark-cue"]');
    marks.set(screen, [...(marks.get(screen) ?? []), createMarkSpin(mark, cue, reduceMotion)]);
  });

  // Number each item by its step, for the stagger, and hide it ready to rise.
  // With reduced motion, the text is simply visible (only the marks fade in).
  const stepCounts = new Map();
  if (!reduceMotion) groups.forEach((group, screen) => {
    const steps = stepsOf(group);
    steps.forEach((step, index) => {
      step.forEach((item) => {
        item.style.setProperty('--reveal-index', index);
        if (item.dataset.revealFrom === 'right') {
          item.style.setProperty('--reveal-x', REVEAL.fromRight);
          item.style.setProperty('--reveal-y', 0);
        }
        item.classList.add('reveal--pending');
      });
    });
    stepCounts.set(screen, steps.length);
  });

  // When an item has finished, drop the classes so its own styles (for example a
  // hover transition) apply again.
  function cleanUp(item) {
    if (!item.classList.contains('reveal--in')) return false;
    item.classList.remove('reveal--in');
    item.style.removeProperty('--reveal-index');
    item.style.removeProperty('--reveal-x');
    item.style.removeProperty('--reveal-y');
    return true;
  }

  const left = new WeakSet();   // screens a transition has started to leave
  const finishers = new Map();  // screen -> jumps its running load to the end

  // Shows an item in its end state at once, with no transition.
  function settleNow(item) {
    item.style.transition = 'none';
    item.classList.remove('reveal--pending');
    item.classList.add('reveal--in');
    item.getBoundingClientRect(); // apply the end state now, before the transition comes back
    item.style.removeProperty('transition');
  }

  function play(screen) {
    const group = groups.get(screen);
    const screenMarks = marks.get(screen) ?? [];
    if (reduceMotion) {
      screenMarks.forEach((mark) => mark.play());
      announceDone(screen);
      return;
    }
    let remaining = group.length;
    const finishOne = (item) => {
      if (!cleanUp(item)) return;
      remaining -= 1;
      if (remaining === 0) announceDone(screen);
    };
    if (remaining === 0) announceDone(screen);
    let textTimer = 0;
    // The end state at once: the marks, and every item not finished yet.
    const finishAll = () => {
      clearTimeout(textTimer);
      screenMarks.forEach((mark) => mark.finish());
      group.forEach((item) => {
        if (!item.classList.contains('reveal--pending') && !item.classList.contains('reveal--in')) return;
        settleNow(item);
        finishOne(item);
      });
    };
    finishers.set(screen, finishAll);
    if (left.has(screen)) {
      finishAll();
      return;
    }
    // The stagger, after the mark has begun its entrance (if the screen has one).
    const startText = () => {
      // Fallback in case end events never come (e.g. the tab was hidden).
      const longest = (stepCounts.get(screen) - 1) * REVEAL.stagger + REVEAL.duration;
      group.forEach((item) => {
        item.classList.add('reveal--in');
        item.classList.remove('reveal--pending');
        item.addEventListener('transitionend', function done(event) {
          if (event.target !== item || event.propertyName !== 'opacity') return;
          item.removeEventListener('transitionend', done);
          finishOne(item);
        });
        setTimeout(() => finishOne(item), longest + 500);
      });
    };
    screenMarks.forEach((mark) => mark.play());
    if (screenMarks.length) textTimer = setTimeout(startText, MARK_SPIN.textDelay);
    else startText();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const screen = entry.target;
      observer.unobserve(screen); // once only
      const wait = waitFor[screen.dataset.revealWait];
      if (wait) {
        wait.then(() => play(screen));
      } else {
        play(screen);
      }
    });
  }, { threshold: REVEAL.threshold });

  groups.forEach((group, screen) => {
    observer.observe(screen);
    screen.addEventListener(SCREEN_LEAVE, () => {
      left.add(screen);
      finishers.get(screen)?.();
    });
  });
}
