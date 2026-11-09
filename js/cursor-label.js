// Shared cursor label (motion.md v2 "Global", CAROL; used on the Selected Works cards,
// and later on About): a small black label with white
// text that follows the mouse with a small offset while it is over a target, fading
// in over LABEL.fade. Generic: attachCursorLabel(target, text). One label element is
// shared by every target.
//
// Mouse and pen only: on touch screens there is no hover, so it never shows (CSS also
// hides it where the device cannot hover). Keyboard focus on the target shows it
// still, next to the target; so does reduced motion (no following).
// The label is hidden from screen readers: the target carries its own name.

import { LABEL } from './motion-config.js';

let label = null;
let active = null; // the target the label is showing for

// A target can stop being hoverable without a "leave" event: it is removed from the
// page, or disabled (inert, e.g. a card that is no longer current). So the label also
// checks on every pointer move anywhere, and never shows for a target in such a state.
const usable = (target) => target.isConnected && !target.closest('[inert]');

document.addEventListener('pointermove', (event) => {
  if (active && (!usable(active) || !active.contains(event.target))) hideCursorLabel();
}, { passive: true });

function ensureLabel() {
  if (label) return label;
  label = document.createElement('div');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');
  document.body.append(label);
  return label;
}

// Design px to screen px, like --u (tokens.css).
const unit = () => Math.min(window.innerWidth / 1920, window.innerHeight / 1080);

// Hides the label straight away (e.g. when the target is about to move or be disabled).
export function hideCursorLabel() {
  active = null;
  label?.classList.remove('cursor-label--visible');
}

export function attachCursorLabel(target, text) {
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let pointer = null;

  // Places the label at (x, y) plus the offset, flipped to stay inside the window.
  function place(x, y) {
    const el = ensureLabel();
    const gap = LABEL.offset * unit();
    let left = x + gap;
    let top = y + gap;
    const { width, height } = el.getBoundingClientRect();
    if (left + width > window.innerWidth - 4) left = x - gap - width;
    if (top + height > window.innerHeight - 4) top = y - gap - height;
    el.style.translate = `${Math.round(left)}px ${Math.round(top)}px`;
  }

  // Still placement: just off the target's top-right corner.
  function placeByTarget() {
    const box = target.getBoundingClientRect();
    place(box.right, box.top);
  }

  function show() {
    if (!usable(target)) return;
    const el = ensureLabel();
    el.textContent = text;
    el.classList.add('cursor-label--visible');
    active = target;
  }

  function hide() {
    if (active === target) hideCursorLabel();
  }

  target.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    show();
    if (reduceMotion.matches) placeByTarget();
    else place(event.clientX, event.clientY);
  });
  target.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || reduceMotion.matches || active !== target) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        place(pointer.x, pointer.y);
      });
    }
  });
  target.addEventListener('pointerleave', hide);
  target.addEventListener('focus', () => {
    if (!target.matches(':focus-visible')) return;
    show();
    placeByTarget();
  });
  target.addEventListener('blur', hide);
}
