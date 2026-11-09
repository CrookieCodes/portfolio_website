// Landing -> Touchpoints block-wipe (motion.md v2 section 2, CAROL).
//
// The Landing is pinned (css/wipe.css) for one screen of scrolling. Over that
// distance, a 16 x 9 grid of blocks turns white over it, one block at a time:
// progress 0 = nothing covered, 1 = every block white. It is tied to the scroll
// position, so scrolling back up un-covers the blocks again.
//
// Each block gets a threshold between 0 and 1 and turns white once progress passes
// it. Thresholds follow a vertical sweep (CAROL), row by row: from the bottom up
// (WIPE.direction 'up') or from the top down ('down'), with some random jitter so
// the edge is ragged. They are fixed per page load.
//
// At WIPE.swapAt (50%), the Landing takes on the Touchpoints theme and logo, so
// the header turns dark and the logo spins to the pinwheel (js/header-theme.js and
// js/header-logo.js react to the attributes). Below it, the Landing's own values
// come back. With reduced motion there is no wipe (CSS shows plain screens).

import { WIPE } from './motion-config.js';

export function initWipe() {
  const wrapper = document.querySelector('[data-js="wipe"]');
  const grid = wrapper?.querySelector('[data-js="wipe-grid"]');
  const screen = wrapper?.querySelector('[data-js~="screen"]');
  if (!wrapper || !grid || !screen) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // The theme and logo before and after the swap.
  const before = { theme: screen.dataset.screenTheme, logo: screen.dataset.screenLogo };
  const after = { theme: wrapper.dataset.wipeTheme, logo: 'secondary' };

  // Build the blocks with their thresholds.
  const cells = [];
  const fragment = document.createDocumentFragment();
  for (let row = 0; row < WIPE.rows; row += 1) {
    for (let column = 0; column < WIPE.columns; column += 1) {
      const fromTop = row / (WIPE.rows - 1);                                 // 0..1
      const sweep = WIPE.direction === 'down' ? fromTop : 1 - fromTop;       // 0 = first row to fill
      const mixed = sweep * (1 - WIPE.jitter) + Math.random() * WIPE.jitter; // 0..1
      // Squeeze into [margin, 1 - margin] so nothing is white at the very start
      // and everything is white just before the end.
      const threshold = WIPE.margin + mixed * (1 - 2 * WIPE.margin);
      const element = document.createElement('div');
      element.className = 'wipe__cell';
      fragment.append(element);
      cells.push({ element, threshold, on: false });
    }
  }
  grid.append(fragment);

  let lastProgress = -1;
  let swapped = false;

  function update() {
    const box = wrapper.getBoundingClientRect();
    const travel = box.height - window.innerHeight; // one screen
    const progress = travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 0;
    if (progress === lastProgress) return;
    lastProgress = progress;

    cells.forEach((cell) => {
      const on = progress > cell.threshold;
      if (on !== cell.on) {
        cell.on = on;
        cell.element.classList.toggle('wipe__cell--on', on);
      }
    });

    // Fully covered (allowing for sub-pixel scroll positions): show Touchpoints.
    wrapper.classList.toggle('wipe--covered', progress >= WIPE.coveredAt);

    const shouldSwap = progress >= WIPE.swapAt;
    if (shouldSwap !== swapped) {
      swapped = shouldSwap;
      const values = swapped ? after : before;
      screen.dataset.screenTheme = values.theme;
      screen.dataset.screenLogo = values.logo;
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
  window.addEventListener('resize', schedule);
  update();
}
