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
// When the last item of a screen has finished, the screen fires a "reveal:done"
// event, so a screen's own build (the Touchpoints diagram, the Experiences figures)
// can start after its text. With reduced motion it fires straight away.
//
// Hold zones (HOLD in js/motion-config.js): a screen's load must be complete before the
// next transition covers it. The transitions (js/wipe.js, js/push-in.js) fire
// "screen:leave" on the screen being left as soon as they start; if its load is still
// running, it jumps to the end state, and a load that has not started yet plays
// instantly.

import { REVEAL } from './motion-config.js';

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
  const items = [...document.querySelectorAll('[data-js~="reveal"]')];

  // Group the items by screen.
  const groups = new Map();
  items.forEach((item) => {
    const screen = item.closest('[data-js~="screen"]');
    if (!screen) return;
    if (!groups.has(screen)) groups.set(screen, []);
    groups.get(screen).push(item);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Everything is already visible: tell each screen it is done once it is in the page.
    groups.forEach((group, screen) => queueMicrotask(() => announceDone(screen)));
    return;
  }

  // Number each item by its step, for the stagger, and hide it ready to rise.
  const stepCounts = new Map();
  groups.forEach((group, screen) => {
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
    let remaining = group.length;
    const finishOne = (item) => {
      if (!cleanUp(item)) return;
      remaining -= 1;
      if (remaining === 0) announceDone(screen);
    };
    finishers.set(screen, () => group.forEach((item) => {
      if (!item.classList.contains('reveal--in')) return;
      settleNow(item);
      finishOne(item);
    }));
    if (left.has(screen)) {
      group.forEach((item) => { settleNow(item); finishOne(item); });
      return;
    }
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
