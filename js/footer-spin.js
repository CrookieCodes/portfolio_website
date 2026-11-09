// Footer cross (motion.md section 6): the large pale-teal cross spins one full
// turn every SPIN.interval. Time only counts while the footer is on screen and
// the tab is visible, so the first spin comes 25 s after the footer first
// enters view. A spin in progress pauses with it. None under reduced motion.

import { SPIN } from './motion-config.js';

export function initFooterSpin() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cross = document.querySelector('[data-js="footer-cross"]');
  if (!cross) return;
  const footer = cross.closest('[data-js~="screen"]');

  let inView = false;
  let waited = 0;        // ms of visible time since the last spin started
  let activeSince = 0;   // when the current visible stretch began (0 = not active)
  let timer = 0;
  let spin = null;

  function startSpin() {
    waited = 0;
    activeSince = performance.now();
    spin = cross.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: SPIN.duration, easing: SPIN.easing });
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(startSpin, Math.max(0, SPIN.interval - waited));
  }

  function update() {
    const active = inView && !document.hidden;
    if (active && !activeSince) {
      activeSince = performance.now();
      if (spin && spin.playState === 'paused') spin.play();
      schedule();
    } else if (!active && activeSince) {
      waited += performance.now() - activeSince;
      activeSince = 0;
      clearTimeout(timer);
      if (spin && spin.playState === 'running') spin.pause();
    }
  }

  document.addEventListener('visibilitychange', update);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }, { rootMargin: '-1px 0px' }).observe(footer);
}
