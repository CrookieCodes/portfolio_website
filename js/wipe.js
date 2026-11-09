// Landing -> Touchpoints "blinds up" (motion.md v2 section 2, CAROL).
//
// The Landing is pinned (css/wipe.css) for one screen of scrolling. Over that
// distance, twelve vertical bars in the Touchpoints colour rise from the bottom of
// the screen to the top: progress p = 0 shows the Landing, p = 1 a fully covered
// screen. It is tied to the scroll position, so scrolling back up lowers them again.
// They always rise bottom to top; never top to bottom.
//
// Stagger, left to right in a straight line: bar i (0 to bars - 1) starts at
// p = (i / (bars - 1)) * spread and its local progress is
//   q = clamp((p - start) / (1 - spread))
// Its height is smoothstep(q) = q * q * (3 - 2q) of the screen. Bar 0 starts at
// p = 0 and the last bar lands at p = 1.
//
// The header keeps the Landing theme until the last bar has landed: at WIPE.swapAt
// the Landing takes on the Touchpoints theme and logo (js/header-theme.js and
// js/header-logo.js react to the attributes), and gets them back below it.
// Touchpoints is marked as hidden from the header (data-screen-hidden) while it is
// under the Landing, so it cannot take over the header early.
//
// At WIPE.coveredAt the Landing is hidden and Touchpoints shows. The first time that
// happens, the promise returned by initWipe() resolves; js/reveal.js waits on it
// to play the Touchpoints load animation (once per page load).
// With reduced motion there are no bars (CSS shows plain screens) and the promise
// resolves straight away.

import { WIPE } from './motion-config.js';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (q) => q * q * (3 - 2 * q);

export function initWipe() {
  const wrapper = document.querySelector('[data-js="wipe"]');
  const barsBox = wrapper?.querySelector('[data-js="wipe-bars"]');
  const screen = wrapper?.querySelector('[data-js~="screen"]');
  const next = document.getElementById(wrapper?.dataset.wipeNext ?? '');
  if (!wrapper || !barsBox || !screen) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  // The theme and logo before and after the swap.
  const before = { theme: screen.dataset.screenTheme, logo: screen.dataset.screenLogo };
  const after = { theme: wrapper.dataset.wipeTheme, logo: 'secondary' };

  // Build the bars.
  const bars = [];
  for (let index = 0; index < WIPE.bars; index += 1) {
    const bar = document.createElement('div');
    bar.className = 'wipe__bar';
    bar.style.setProperty('--bar-index', index);
    barsBox.append(bar);
    bars.push({ element: bar, start: (index / (WIPE.bars - 1)) * WIPE.spread, height: -1 });
  }

  let resolveCovered;
  const firstCovered = new Promise((resolve) => { resolveCovered = resolve; });

  let lastProgress = -1;
  let swapped = false;
  let covered = null;

  function update() {
    const box = wrapper.getBoundingClientRect();
    const travel = box.height - window.innerHeight; // one screen
    const progress = travel > 0 ? clamp01(-box.top / travel) : 0;
    if (progress === lastProgress) return;
    lastProgress = progress;

    bars.forEach((bar) => {
      const height = smoothstep(clamp01((progress - bar.start) / (1 - WIPE.spread)));
      if (height !== bar.height) {
        bar.height = height;
        bar.element.style.transform = `scaleY(${height})`;
      }
    });

    const shouldSwap = progress >= WIPE.swapAt;
    if (shouldSwap !== swapped) {
      swapped = shouldSwap;
      const values = swapped ? after : before;
      screen.dataset.screenTheme = values.theme;
      screen.dataset.screenLogo = values.logo;
    }

    const isCovered = progress >= WIPE.coveredAt;
    if (isCovered !== covered) {
      covered = isCovered;
      wrapper.classList.toggle('wipe--covered', covered);
      if (next) {
        if (covered) {
          delete next.dataset.screenHidden;
        } else {
          next.dataset.screenHidden = 'true';
        }
      }
      if (covered) resolveCovered();
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
    lastProgress = -1; // the screen height changed: recompute
    schedule();
  });
  update();
  return firstCovered;
}
