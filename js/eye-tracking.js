// Landing eyes: the pupils follow the mouse (motion.md v2 section 2).
//
// Each eye's "look" group (the iris, or the hover cross) is moved toward the
// cursor, clamped to an ellipse inside the white of the eye. The white also
// clips the group, like an eyelid. CSS adds the short lag (--motion-pupil-lag).
//
// Paused while the Landing is off-screen. Mouse and pen only: on touch the eyes
// keep their resting pose. With reduced motion the pupils do not move.

import { EYES } from './motion-config.js';

// Geometry in the eye's own SVG units (viewBox 0 0 371 239), from the Figma eye (32:678).
const WHITE_CENTRE = { x: 206, y: 119 };  // middle of the white (x 41-371, y 13-225.5)
const IRIS_REST = { x: 185.5, y: 119.5 }; // where the iris sits in the design (centred)
const RANGE = { x: 80, y: 45 };           // how far the iris centre may move from the middle

export function initEyeTracking() {
  const landing = document.getElementById('landing');
  const eyes = [...document.querySelectorAll('[data-js="eye"]')].map((svg) => ({
    svg,
    look: svg.querySelector('[data-js="eye-look"]'),
  }));
  if (!landing || eyes.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let landingInView = true;
  let pointer = null;
  let frame = 0;

  // Moves one eye's look group so the iris points at the cursor.
  function aim({ svg, look }) {
    const box = svg.getBoundingClientRect();
    const unit = box.width / 371; // screen px per SVG unit
    const dx = (pointer.x - box.left) / unit - WHITE_CENTRE.x;
    const dy = (pointer.y - box.top) / unit - WHITE_CENTRE.y;
    const distance = Math.hypot(dx, dy) || 1;
    const strength = Math.min(1, distance / EYES.pupilReach);
    const x = WHITE_CENTRE.x + (dx / distance) * RANGE.x * strength;
    const y = WHITE_CENTRE.y + (dy / distance) * RANGE.y * strength;
    look.style.transform = `translate(${x - IRIS_REST.x}px, ${y - IRIS_REST.y}px)`;
  }

  function rest() {
    eyes.forEach(({ look }) => { look.style.transform = ''; });
  }

  // At most one update per screen refresh.
  function onPointerMove(event) {
    if (event.pointerType === 'touch' || reduceMotion.matches || !landingInView) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        eyes.forEach(aim);
      });
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) rest();
  });

  new IntersectionObserver(([entry]) => {
    landingInView = entry.isIntersecting;
  }).observe(landing);
}
