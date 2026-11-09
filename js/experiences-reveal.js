// Experiences: "light reveals the scene" (motion.md v2 section 4, CAROL's prototype).
// Once per page load, when Experiences has arrived (slid in to PUSH.arriveAt):
//   1. The photo has come in under a near-black veil (css/scene.css, .scene__veil).
//   2. After startDelay, a soft band of light sweeps the veil away, left to right,
//      over sweepDuration (one translate of the veil element: no layout changes).
//   3. As the band's centre passes the middle of each person, that person's glyphs
//      switch on (figureLag later), fading in over figureFade (js/ascii-effect.js
//      'gated': the canvas waits until the first person is switched on).
//   4. At textAt the heading and bullets load (js/reveal.js waits on the promise
//      returned here).
// Scrolling away and back does not replay it. With reduced motion there is no veil
// and no sweep: the photo, a still glyph frame on everyone and the text show at once.
// The veil is only switched on here, so without JavaScript the photo simply shows.
// Values: EXPERIENCES_REVEAL and PUSH in js/motion-config.js.

import { EXPERIENCES_REVEAL as REVEAL, PUSH } from './motion-config.js';

export function initExperiencesReveal(effect) {
  const screen = document.getElementById('experiences');
  const veil = screen?.querySelector('[data-js="veil"]');
  const canvas = screen?.querySelector('[data-js~="ascii-experiences"]');
  const figures = [...(screen?.querySelectorAll('[data-js="figure"]') ?? [])];
  if (!screen || !veil || !canvas || !effect || figures.length === 0) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  // The veil element is (1 + band) screens wide: a soft edge `band` wide, then solid.
  // Start: shifted left by the edge, so the solid part covers the screen.
  // End: shifted right by a whole screen, off it. (Translate % is of its own width.)
  const band = REVEAL.bandWidth;
  const from = `${(-band / (1 + band)) * 100}% 0`;
  const to = `${(1 / (1 + band)) * 100}% 0`;
  veil.style.translate = from;
  veil.classList.add('scene__veil--active');

  // Where each person's middle is on screen (the figures are drawn in the canvas's
  // 1920 x 1080 frame, which covers the screen).
  function middles() {
    const box = canvas.getBoundingClientRect();
    const unit = box.width / 1920;
    return figures.map((figure) => {
      const b = figure.getBBox();
      const m = figure.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix();
      return { name: figure.dataset.figure, x: box.left + (m.e + (b.x + b.width / 2) * m.a) * unit };
    });
  }

  return new Promise((resolve) => {
    let played = false;

    function play() {
      played = true;
      window.removeEventListener('scroll', check);
      const width = screen.getBoundingClientRect().width;
      veil.animate([{ translate: from }, { translate: to }], {
        delay: REVEAL.startDelay,
        duration: REVEAL.sweepDuration,
        easing: 'linear',
        fill: 'forwards',
      }).finished.then(() => veil.classList.remove('scene__veil--active'), () => {});
      // The band's centre runs from half a band left of the screen to half a band
      // past its right edge, at a steady speed: when does it pass x?
      const passes = (x) => {
        const share = (Math.min(width, Math.max(0, x)) + (band * width) / 2) / (width + band * width);
        return REVEAL.startDelay + share * REVEAL.sweepDuration;
      };
      middles().forEach(({ name, x }) => {
        setTimeout(() => effect.show(name, REVEAL.figureFade), passes(x) + REVEAL.figureLag);
      });
      setTimeout(resolve, REVEAL.textAt);
    }

    // Arrived: how far Experiences has slid in over the screen before it (0 to 1).
    function check() {
      if (played) return;
      const top = screen.getBoundingClientRect().top;
      if (1 - top / window.innerHeight >= PUSH.arriveAt) play();
    }

    let frame = 0;
    window.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; check(); });
    }, { passive: true });
    check();
  });
}
