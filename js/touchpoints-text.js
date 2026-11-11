// Touchpoints text block placement (CAROL): Figma's position (css/scene.css), then
// shifted right by a share of the block's own width (--touchpoints-text-shift, 0.4),
// but never closer than --touchpoints-text-gap (64px) to the right edge of the
// window. Measured here because the block's width depends on the rendered text.
// The block is marked data-shift-clamped when the gap rule cut the shift short.

export function initTouchpointsText() {
  const block = document.querySelector('[data-js="touchpoints-text"]');
  if (!block) return;
  const tokens = getComputedStyle(document.documentElement);
  const share = parseFloat(tokens.getPropertyValue('--touchpoints-text-shift')) || 0;
  const gap = parseFloat(tokens.getPropertyValue('--touchpoints-text-gap')) || 0;

  function place() {
    block.style.translate = '';
    const box = block.getBoundingClientRect();
    const wanted = box.width * share;
    const room = window.innerWidth - gap - box.right;
    const shift = Math.max(0, Math.min(wanted, room));
    block.style.translate = `${shift.toFixed(1)}px 0`;
    if (wanted > room) block.dataset.shiftClamped = 'true';
    else delete block.dataset.shiftClamped;
  }

  place();
  window.addEventListener('resize', place);
  document.fonts?.ready.then(place);
}
