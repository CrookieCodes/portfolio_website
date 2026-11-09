// Landing -> Touchpoints "blinds up" (motion.md v2 section 2, CAROL).
//
// The Landing and Touchpoints are both pinned in the same place (css/wipe.css) for
// one screen of scrolling, Touchpoints on top. Touchpoints is masked so that it
// shows only through twelve vertical bars, which rise from the bottom of the screen
// to the top as the scroll progresses: p = 0 shows the Landing, p = 1 Touchpoints.
// It is tied to the scroll position, so scrolling back up lowers them again and
// reveals the Landing. They always rise bottom to top; never top to bottom.
//
// Stagger, left to right in a straight line: bar i (0 to bars - 1) starts at
// p = (i / (bars - 1)) * spread and its local progress is
//   q = clamp((p - start) / (1 - spread))
// Its height is smoothstep(q) = q * q * (3 - 2q) of the screen. Bar 0 starts at
// p = 0 and the last bar lands at p = 1.
//
// The bars are mask layers on Touchpoints: they are set up once here, and each
// frame only updates a custom property per bar (--bar-0 ... --bar-11) with its height.
//
// Header: each item (the logo and each nav link) takes the Touchpoints theme on its
// own, as soon as the bar(s) beneath it have risen over it (WIPE.headerCover), and
// gets the Landing theme back when they drop below it. The logo's change spins it
// to the pinwheel (js/header-logo.js reacts to the Landing's data-screen-logo).
// At WIPE.swapAt the whole header, band included, takes the Touchpoints theme
// (js/header-theme.js reacts to the Landing's data-screen-theme).
// Touchpoints is marked data-screen-hidden while it is not fully shown, so it cannot
// take over the header early, and data-scene-paused while no bar has risen, so its
// canvas effects rest while it is completely out of sight.
//
// At WIPE.coveredAt the mask comes off and the Landing is hidden. The first time that
// happens, the promise returned by initWipe() resolves; js/reveal.js waits on it to
// play the Touchpoints load animation (once per page load).
// With reduced motion there are no bars (CSS shows plain screens) and the promise
// resolves straight away.

import { WIPE } from './motion-config.js';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (q) => q * q * (3 - 2 * q);

export function initWipe() {
  const wrapper = document.querySelector('[data-js="wipe"]');
  const screen = wrapper?.querySelector('[data-js~="screen"]');
  const next = wrapper?.querySelector('[data-js~="wipe-next"]');
  if (!wrapper || !screen || !next) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  // The theme and logo before and after the swap.
  const before = { theme: screen.dataset.screenTheme, logo: screen.dataset.screenLogo };
  const after = { theme: wrapper.dataset.wipeTheme, logo: 'secondary' };

  // The mask: one solid layer per bar, each 1px wider than its share (so no seams
  // show), anchored to the bottom, its height read from --bar-i. Set once.
  const count = WIPE.bars;
  const indexes = Array.from({ length: count }, (_, index) => index);
  next.style.setProperty('--wipe-mask-image', indexes.map(() => 'linear-gradient(#000, #000)').join(', '));
  next.style.setProperty('--wipe-mask-size', indexes.map((index) => `calc(100% / ${count} + 1px) calc(var(--bar-${index}) * 100%)`).join(', '));
  // 1px past the bottom edge, so rounding never leaves a part-covered bottom row.
  next.style.setProperty('--wipe-mask-position', indexes.map((index) => `${(index / (count - 1)) * 100}% calc(100% + 1px)`).join(', '));

  const bars = indexes.map((index) => ({ name: `--bar-${index}`, start: (index / (count - 1)) * WIPE.spread, height: -1 }));

  // Header items and where they sit, to know which bars pass over each one.
  const header = document.querySelector('[data-js="site-header"]');
  const logoLink = header?.querySelector('.site-header__logo');
  const items = [...(header?.querySelectorAll('[data-js~="header-item"]') ?? [])]
    .map((element) => ({ element, isLogo: element === logoLink, covered: null, need: 1, first: 0, last: 0 }));

  // Each item needs the bars under its left-to-right span to rise above the part
  // of it given by WIPE.headerCover (1 = its top edge).
  function measureItems() {
    const width = window.innerWidth / count;
    items.forEach((item) => {
      const box = item.element.getBoundingClientRect();
      const edge = box.bottom - box.height * WIPE.headerCover;
      item.need = (window.innerHeight - edge) / window.innerHeight;
      item.first = Math.max(0, Math.floor(box.left / width));
      item.last = Math.min(count - 1, Math.floor((box.right - 1) / width));
    });
  }
  measureItems();

  let resolveCovered;
  const firstCovered = new Promise((resolve) => { resolveCovered = resolve; });

  let lastProgress = -1;
  let swapped = null;
  let covered = null;
  let paused = null;

  function update() {
    // The blinds run over the first screen of scrolling through the wrapper.
    const box = wrapper.getBoundingClientRect();
    const progress = clamp01(-box.top / window.innerHeight);
    if (progress === lastProgress) return;
    lastProgress = progress;

    bars.forEach((bar) => {
      const height = smoothstep(clamp01((progress - bar.start) / (1 - WIPE.spread)));
      if (height !== bar.height) {
        bar.height = height;
        next.style.setProperty(bar.name, height);
      }
    });

    const shouldSwap = progress >= WIPE.swapAt;
    if (shouldSwap !== swapped) {
      swapped = shouldSwap;
      screen.dataset.screenTheme = swapped ? after.theme : before.theme;
    }

    // Header items, one by one. Past swapAt the whole header has the new theme, so
    // the items drop their own.
    items.forEach((item) => {
      let isCovered = true;
      for (let index = item.first; index <= item.last; index += 1) {
        if (bars[index].height < item.need) isCovered = false;
      }
      const own = isCovered && !swapped; // needs its own theme only before swapAt
      if (own !== item.covered) {
        item.covered = own;
        if (own) {
          item.element.dataset.theme = after.theme;
        } else {
          delete item.element.dataset.theme;
        }
      }
      if (item.isLogo) {
        const logo = isCovered || swapped ? after.logo : before.logo;
        if (screen.dataset.screenLogo !== logo) screen.dataset.screenLogo = logo;
      }
    });

    const isCovered = progress >= WIPE.coveredAt;
    if (isCovered !== covered) {
      covered = isCovered;
      wrapper.classList.toggle('wipe--covered', covered);
      next.classList.toggle('wipe__next--masked', !covered);
      if (covered) {
        delete next.dataset.screenHidden;
        resolveCovered();
      } else {
        next.dataset.screenHidden = 'true';
      }
    }

    const isPaused = progress <= 0;
    if (isPaused !== paused) {
      paused = isPaused;
      if (paused) {
        next.dataset.scenePaused = 'true';
      } else {
        delete next.dataset.scenePaused;
      }
    }
  }

  let frame = 0;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    lastProgress = -1; // the screen size changed: recompute
    measureItems();
    schedule();
  });
  update();
  return firstCovered;
}
