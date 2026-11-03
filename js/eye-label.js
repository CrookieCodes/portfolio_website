// "Click to Explore" label (motion.md section 2): a small black label that
// follows the mouse, slightly offset, while the cursor is over an eye.
// It fades in (--motion-label-fade). Not shown for touch or keyboard focus;
// the buttons' accessible names ("Explore touchpoints" / "Explore experiences")
// do that job. With reduced motion it does not follow the cursor: it sits
// still, centred just below the hovered eye.

import { EYES } from './motion-config.js';

export function initEyeLabel() {
  const label = document.querySelector('[data-js="eye-label"]');
  const buttons = document.querySelectorAll('[data-js="eye-button"]');
  if (!label || buttons.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // The offset is in design px; convert it to screen px with the eye's current scale.
  function offsetFor(button) {
    const eye = button.querySelector('[data-js="eye"]');
    return EYES.labelOffset * (eye.getBoundingClientRect().width / 371);
  }

  function place(x, y) {
    label.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  function followCursor(button, event) {
    const offset = offsetFor(button);
    place(event.clientX + offset, event.clientY + offset);
  }

  function belowEye(button) {
    const box = button.getBoundingClientRect();
    place(box.left + (box.width - label.offsetWidth) / 2, box.bottom + offsetFor(button));
  }

  buttons.forEach((button) => {
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      if (reduceMotion.matches) {
        belowEye(button);
      } else {
        followCursor(button, event);
      }
      label.classList.add('eye-label--visible');
    });

    button.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || reduceMotion.matches) return;
      followCursor(button, event);
    });

    button.addEventListener('pointerleave', () => {
      label.classList.remove('eye-label--visible');
    });
  });

  // Hide it if the page scrolls away under a still mouse (e.g. after a click on the eye).
  window.addEventListener('scroll', () => label.classList.remove('eye-label--visible'), { passive: true });
}
