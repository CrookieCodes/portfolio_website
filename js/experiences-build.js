// Experiences load order (motion.md v2 section 4, CAROL Option A), once per page load,
// when the screen first comes into view:
//   1. the photo appears
//   2. the three figures fade in as flat coloured shapes on it
//   3. they crossfade into the glyph effect (deep-teal ground, top-to-bottom sweep)
//   4. the text and bullets load (js/reveal.js waits on the promise returned here)
// Timings: FIGURES in js/motion-config.js. With reduced motion the end state shows
// straight away (photo and glyphs) and the promise resolves at once.

import { FIGURES, REVEAL } from './motion-config.js';

export function initExperiencesBuild() {
  const figures = document.querySelector('[data-js="figures"]');
  const screen = figures?.closest('[data-js~="screen"]');
  const photo = screen?.querySelector('[data-js="photo"]');
  const canvas = screen?.querySelector('[data-js~="ascii-experiences"]');
  if (!figures || !screen || !photo || !canvas) return Promise.resolve();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  const crossfadeAt = FIGURES.shapesAt + FIGURES.shapesDuration + FIGURES.holdDuration;
  const at = (delay, duration) => ({ delay, duration, easing: FIGURES.easing, fill: 'both' });
  const steps = [
    photo.animate([{ opacity: 0 }, { opacity: 1 }], at(0, FIGURES.photoDuration)),
    figures.animate([{ opacity: 0 }, { opacity: 1 }], at(FIGURES.shapesAt, FIGURES.shapesDuration)),
    // fill 'forwards' (not 'both'): before its delay this fade-out must not apply,
    // or it would hold the figures at full opacity over the fade-in above.
    figures.animate([{ opacity: 1 }, { opacity: 0 }], { ...at(crossfadeAt, FIGURES.crossfadeDuration), fill: 'forwards' }),
    canvas.animate([{ opacity: 0 }, { opacity: 1 }], at(crossfadeAt, FIGURES.crossfadeDuration)),
  ];
  steps.forEach((step) => step.pause());

  return new Promise((resolve) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      steps.forEach((step) => step.play());
      Promise.all(steps.map((step) => step.finished)).then(resolve, resolve);
    }, { threshold: REVEAL.threshold });
    observer.observe(screen);
  });
}
