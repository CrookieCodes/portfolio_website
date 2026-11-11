// Header logo swap (motion.md v2 "Header", CAROL).
//
// The header holds two marks: the primary logo (tan square mark, Landing only) and
// the secondary logo (the pinwheel, coloured per screen by CSS). js/header-theme.js
// sets data-logo="primary|secondary" on the header; this module watches it.
//
// When the mark changes: both marks spin 90 degrees together over LOGO.spinDuration,
// and at the midpoint the old mark disappears and the new one appears (an opacity
// swap). Going down (to the pinwheel) it turns clockwise 0 -> 90; going back up it
// turns 90 -> 0. Each spin ends on a pose that matches the resting pose (the
// pinwheel looks the same at 0 and 90 degrees), so nothing jumps when it finishes.
// A colour change alone is instant. Reduced motion: an instant swap, no spin.

import { LOGO } from './motion-config.js';

export function initHeaderLogo() {
  const header = document.querySelector('[data-js="site-header"]');
  const primary = header?.querySelector('[data-js="logo-primary"]');
  const secondary = header?.querySelector('[data-js="logo-secondary"]');
  if (!header || !primary || !secondary) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let shown = null;    // 'primary' | 'secondary'
  let running = [];    // the animations of the current swap

  // Resting state: one mark visible, no transform.
  function settle(mark) {
    primary.classList.toggle('site-header__mark--hidden', mark !== 'primary');
    secondary.classList.toggle('site-header__mark--hidden', mark !== 'secondary');
  }

  function swap(to) {
    running.forEach((animation) => animation.cancel());
    running = [];
    settle(to);
    if (reduceMotion.matches) return;

    const toSecondary = to === 'secondary';
    const from = toSecondary ? 0 : LOGO.spinAngle;
    const end = toSecondary ? LOGO.spinAngle : 0;
    const timing = { duration: LOGO.spinDuration, easing: LOGO.spinEasing };
    // Opacity is a hard switch at the midpoint (linear, so offset 0.5 is the
    // midpoint in time). Visibility comes from the classes once it ends.
    const opacity = (appearing) => {
      const before = appearing ? 0 : 1;
      const after = appearing ? 1 : 0;
      return [
        { opacity: before },
        { opacity: before, offset: 0.5 },
        { opacity: after, offset: 0.5 },
        { opacity: after },
      ];
    };
    const incoming = toSecondary ? secondary : primary;
    const outgoing = toSecondary ? primary : secondary;

    [incoming, outgoing].forEach((mark) => {
      // While spinning, both marks need to be rendered; the opacity keyframes hide them.
      mark.classList.remove('site-header__mark--hidden');
      running.push(mark.animate(
        [{ rotate: `${from}deg` }, { rotate: `${end}deg` }],
        timing,
      ));
      running.push(mark.animate(opacity(mark === incoming), { duration: LOGO.spinDuration }));
    });

    const these = running;
    Promise.all(these.map((animation) => animation.finished)).then(() => {
      if (running !== these) return; // a newer swap took over
      running = [];
      settle(to);
    }, () => {});
  }

  function update() {
    const want = header.dataset.logo === 'primary' ? 'primary' : 'secondary';
    if (want === shown) return;
    const first = shown === null;
    shown = want;
    if (first) {
      settle(want); // no spin on page load
    } else {
      swap(want);
    }
  }

  new MutationObserver(update).observe(header, { attributeFilter: ['data-logo'] });
  update();
}
