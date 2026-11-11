// Experiences loading (motion.md v2 section 4, CAROL): the people first, then the photo
// wipes in behind them from the left, then the text. Once per page load, when
// Experiences has arrived (slid in to PUSH.arriveAt). Times from EXPERIENCES_REVEAL.
//
//   Before:  a near-black ground (`ground`); the photo is wiped out of sight, so no
//            part of it shows.
//   1. The three people's glyphs switch on, left to right, `figureStagger` apart from
//      `figureStart`, each fading in over `figureFade`. Their deep-teal ground is
//      opaque from the moment they switch on (js/ascii-effect.js), and the canvas sits
//      above the photo, so a real person from the photo is never visible.
//   2. From `photoStart` the photo wipes in from the left over `photoWipe`: its clip
//      wrapper slides from -100% to 0 while the photo inside slides from +100% to 0
//      (transforms only), easing from `photoSettleFrom` scale to 1. The glyph people
//      scale with it, so their shapes stay exactly over the people in the photo.
//   3. At `textAt` the heading and bullets load (js/reveal.js waits on the promise
//      returned here).
// If the blinds to Works start before it has finished (the end of the hold,
// "screen:leave"), it jumps to its end state and the text loads at once.
// Scrolling away and back does not replay it. With reduced motion: the end state at
// once (photo, a still glyph frame on the people, text). Without JavaScript nothing
// here runs, so the photo and text show and there is no ground.

import { EXPERIENCES_REVEAL as REVEAL, PUSH } from './motion-config.js';
import { SCREEN_LEAVE } from './reveal.js';

export function initExperiencesReveal(effect) {
  const screen = document.getElementById('experiences');
  const clip = screen?.querySelector('[data-js="photo-clip"]');
  const photo = screen?.querySelector('[data-js="photo"]');
  const canvas = screen?.querySelector('[data-js~="ascii-experiences"]');
  const figures = [...(screen?.querySelectorAll('[data-js="figure"]') ?? [])];
  if (!screen || !clip || !photo || !canvas || !effect || figures.length === 0) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  // The start: dark ground, photo wiped out (it slides in from the left).
  screen.style.backgroundColor = REVEAL.ground;
  const clipFrom = '-100% 0';
  const photoFrom = { translate: '100% 0', scale: `${REVEAL.photoSettleFrom}` };
  clip.style.translate = clipFrom;
  photo.style.translate = photoFrom.translate;
  photo.style.scale = photoFrom.scale;
  // The glyph people get exactly the photo's scale (same origin: both fill the same
  // frame), so their shapes always sit exactly on the people in the photo.
  canvas.style.scale = photoFrom.scale;

  // People left to right, by the middle of their shape.
  const order = figures
    .map((figure) => {
      const box = figure.getBBox();
      const m = figure.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix();
      return { name: figure.dataset.figure, x: m.e + box.x + box.width / 2 };
    })
    .sort((a, b) => a.x - b.x);

  return new Promise((resolve) => {
    let played = false;
    let finished = false;
    const timers = [];
    const animations = [];

    function play() {
      played = true;
      order.forEach(({ name }, index) => {
        timers.push(setTimeout(() => effect.show(name, REVEAL.figureFade), REVEAL.figureStart + index * REVEAL.figureStagger));
      });
      const timing = { delay: REVEAL.photoStart, duration: REVEAL.photoWipe, easing: REVEAL.photoEasing, fill: 'forwards' };
      animations.push(
        clip.animate([{ translate: clipFrom }, { translate: '0 0' }], timing),
        photo.animate([photoFrom, { translate: '0 0', scale: '1' }], timing),
        canvas.animate([{ scale: photoFrom.scale }, { scale: '1' }], timing),
      );
      timers.push(setTimeout(() => { finished = true; resolve(); }, REVEAL.textAt));
    }

    // The blinds to Works have started: everything to its end state at once.
    screen.addEventListener(SCREEN_LEAVE, () => {
      if (!played || finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      order.forEach(({ name }) => effect.show(name, 0));
      animations.forEach((animation) => animation.finish());
      resolve();
    });

    // Arrived: how far Experiences has slid in over the screen before it (0 to 1).
    function check() {
      if (played) return;
      const top = screen.getBoundingClientRect().top;
      if (1 - top / window.innerHeight >= PUSH.arriveAt) play();
    }

    let frame = 0;
    window.addEventListener('scroll', () => {
      if (played || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; check(); });
    }, { passive: true });
    check();
  });
}
