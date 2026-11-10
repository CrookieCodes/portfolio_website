// Push-in slides (css/push.css): Touchpoints -> Experiences, Selected Works -> About and
// About -> footer. All run on this same code, each pair with its own values (PUSH,
// PUSH_ABOUT, PUSH_FOOTER in js/motion-config.js). A pair whose incoming screen has no
// header theme (the footer: the header fades out over it, js/header-footer.js) leaves
// the header items alone. The slide itself is CSS: the screen being left is pinned
// (sticky) and the next one scrolls up over it. This adds, per scroll frame and pair:
//
//   - Drift and veil (motion.md "Transitions between screens", CAROL): with q = how far
//     the incoming screen has entered the window (0 = its top edge at the bottom,
//     1 = covering the screen), the screen beneath drifts up by q x drift % and a black
//     veil (its data-js="push-dim") fades over it to `veil`. Transforms and opacity only.
//   - Covered: once the incoming screen covers the window, the one beneath is marked
//     data-scene-covered, so its canvas effects rest (js/ascii-effect.js, js/dot-flow.js).
//   - Header during the push: the band is off, and each header item (logo and links)
//     takes the incoming theme once the incoming top edge has passed it (headerCover).
//     The whole header follows when the screen has arrived (arriveAt): until then it is
//     hidden from js/header-theme.js.
//   - Arrival: the first time q reaches arriveAt, the pair's promise resolves (About's
//     load animation waits on it, js/reveal.js).
// Scrolling back up runs all of it in reverse. With reduced motion the screens are not
// pinned (plain scrolling), none of this runs and the promises resolve at once.

import { PUSH, PUSH_ABOUT, PUSH_FOOTER } from './motion-config.js';
import { leaveScreen } from './reveal.js';

const clamp01 = (value) => Math.min(1, Math.max(0, value));

// Returns { experiences, about, footer }: promises that resolve when each screen first arrives.
export function initPushIn() {
  const header = document.querySelector('[data-js="site-header"]');
  const headerItems = [...(header?.querySelectorAll('[data-js~="header-item"]') ?? [])];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pairs = [
    { name: 'experiences', under: document.querySelector('.scene--touchpoints'), over: document.getElementById('experiences'), values: PUSH },
    { name: 'about', under: document.querySelector('[data-js~="works"]'), over: document.getElementById('about'), values: PUSH_ABOUT },
    { name: 'footer', under: document.getElementById('about'), over: document.querySelector('[data-js~="footer"]'), values: PUSH_FOOTER },
  ].filter((pair) => pair.under && pair.over);

  const promises = {};
  pairs.forEach((pair) => {
    promises[pair.name] = new Promise((resolve) => { pair.resolveArrived = resolve; });
    if (reduceMotion) pair.resolveArrived();
  });
  if (reduceMotion) return promises;

  pairs.forEach((pair) => {
    pair.dim = pair.under.querySelector('[data-js="push-dim"]');
    pair.theme = pair.over.dataset.screenTheme;
    pair.items = headerItems.map((element) => ({ element, edge: 0, own: null }));
    pair.lastQ = null;
    pair.covered = null;
    pair.pushing = null;
  });

  function measureItems() {
    pairs.forEach((pair) => pair.items.forEach((item) => {
      const box = item.element.getBoundingClientRect();
      item.edge = box.bottom - box.height * pair.values.headerCover; // the incoming edge must pass this
    }));
  }
  measureItems();

  function updatePair(pair) {
    const top = pair.over.getBoundingClientRect().top;
    const q = clamp01(1 - top / window.innerHeight);
    if (q === pair.lastQ) return;
    pair.lastQ = q;

    // The push has started: the screen beneath must be fully loaded now.
    if (q > 0 && !pair.leaving) leaveScreen(pair.under);
    pair.leaving = q > 0;

    const covered = top <= 0;
    if (covered !== pair.covered) {
      pair.covered = covered;
      if (covered) pair.under.dataset.sceneCovered = 'true';
      else delete pair.under.dataset.sceneCovered;
    }

    pair.under.style.translate = q > 0 ? `0 ${(-q * pair.values.drift).toFixed(3)}%` : '';
    if (pair.dim) pair.dim.style.opacity = (q * pair.values.veil).toFixed(4);

    // Only on a change, so two pairs (and the blinds, js/wipe.js) never undo each other.
    const pushing = q > 0 && q < pair.values.arriveAt;
    if (pushing !== pair.pushing) {
      pair.pushing = pushing;
      if (header) {
        if (pushing) header.dataset.band = 'off';
        else delete header.dataset.band;
      }
      if (pushing) pair.over.dataset.screenHidden = 'true';
      else delete pair.over.dataset.screenHidden;
    }

    if (pair.theme) pair.items.forEach((item) => {
      const own = pushing && top <= item.edge;
      if (own === item.own) return;
      item.own = own;
      if (own) item.element.dataset.theme = pair.theme;
      else if (item.element.dataset.theme === pair.theme) delete item.element.dataset.theme;
    });

    if (q >= pair.values.arriveAt) pair.resolveArrived();
  }

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; pairs.forEach(updatePair); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    measureItems();
    pairs.forEach((pair) => { pair.lastQ = null; });
    schedule();
  });
  pairs.forEach(updatePair);
  return promises;
}
