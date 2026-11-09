// Push-in slides (css/push.css). The slide itself is CSS: the screen being left is
// pinned (sticky) and the next one scrolls up over it. This adds, per scroll frame:
//
//   - Covered screens: once the next screen has slid all the way over, the one
//     beneath is marked data-scene-covered, so its canvas effects stop
//     (js/ascii-effect.js, js/dot-flow.js).
//   - Touchpoints -> Experiences (motion.md "Transitions between screens", CAROL):
//     with q = how far Experiences has entered the window (0 = its top edge at the
//     bottom, 1 = covering the screen), Touchpoints drifts up by q x PUSH.drift % and a
//     black veil fades over it to PUSH.veil. Transforms and opacity only.
//   - Header during that push: the band is off, and each header item (logo and links)
//     takes the Experiences theme once the incoming top edge has passed it
//     (PUSH.headerCover). The whole header follows when Experiences has arrived
//     (PUSH.arriveAt): until then Experiences is hidden from js/header-theme.js.
// With reduced motion the screens are not pinned (plain scrolling) and none of this runs.

import { PUSH } from './motion-config.js';

export function initPushIn() {
  const touchpoints = document.querySelector('[data-js~="wipe-next"]');
  const experiences = document.getElementById('experiences');
  const works = document.getElementById('work');
  const dim = touchpoints?.querySelector('[data-js="push-dim"]');
  const header = document.querySelector('[data-js="site-header"]');
  if (!touchpoints || !experiences || !works) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pairs = [
    { under: touchpoints, over: experiences, covered: null },
    { under: experiences, over: works, covered: null },
  ];

  const theme = experiences.dataset.screenTheme;
  const items = [...(header?.querySelectorAll('[data-js~="header-item"]') ?? [])]
    .map((element) => ({ element, edge: 0, own: null }));
  function measureItems() {
    items.forEach((item) => {
      const box = item.element.getBoundingClientRect();
      item.edge = box.bottom - box.height * PUSH.headerCover; // the incoming edge must pass this
    });
  }
  measureItems();

  let lastQ = null;

  function update() {
    // Covered screens.
    pairs.forEach((pair) => {
      const covered = pair.over.getBoundingClientRect().top <= 0;
      if (covered === pair.covered) return;
      pair.covered = covered;
      if (covered) pair.under.dataset.sceneCovered = 'true';
      else delete pair.under.dataset.sceneCovered;
    });

    // Touchpoints -> Experiences.
    const top = experiences.getBoundingClientRect().top;
    const q = Math.min(1, Math.max(0, 1 - top / window.innerHeight));
    if (q === lastQ) return;
    lastQ = q;

    touchpoints.style.translate = q > 0 ? `0 ${(-q * PUSH.drift).toFixed(3)}%` : '';
    if (dim) dim.style.opacity = (q * PUSH.veil).toFixed(4);

    const pushing = q > 0 && q < PUSH.arriveAt;
    if (header) {
      if (pushing) header.dataset.band = 'off';
      else delete header.dataset.band;
    }
    if (pushing) experiences.dataset.screenHidden = 'true';
    else delete experiences.dataset.screenHidden;

    items.forEach((item) => {
      const own = pushing && top <= item.edge;
      if (own === item.own) return;
      item.own = own;
      if (own) item.element.dataset.theme = theme;
      else delete item.element.dataset.theme;
    });
  }

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measureItems(); lastQ = null; schedule(); });
  update();
}
