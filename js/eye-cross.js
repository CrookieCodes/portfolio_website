// Landing eyes: while the mouse is over any of the three keywords (Products,
// Services, Experiences), or one has keyboard focus, BOTH irises are replaced by the
// burgundy logo cross (motion.md v2 section 2). Leaving restores the pupils.
// The swap is instant: the spec gives no timing for it.

export function initEyeCross() {
  const keywords = document.querySelectorAll('[data-js~="keyword"]');
  const irises = document.querySelectorAll('[data-js="eye-iris"]');
  const crosses = document.querySelectorAll('[data-js="eye-cross"]');
  if (keywords.length === 0 || irises.length === 0) return;

  let hovered = null;  // the keyword under the mouse, if any
  let focused = null;  // the keyword with keyboard focus, if any

  function update() {
    const active = Boolean(hovered || focused);
    irises.forEach((iris) => iris.classList.toggle('landing__iris--hidden', active));
    crosses.forEach((cross) => cross.classList.toggle('landing__eye-cross--visible', active));
  }

  keywords.forEach((keyword) => {
    // Touch has no hover, so it does not count (a tap simply follows the link).
    keyword.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      hovered = keyword;
      update();
    });
    keyword.addEventListener('pointerleave', () => {
      if (hovered === keyword) hovered = null;
      update();
    });
    // Keyboard focus only: a mouse click also focuses the link, but hover covers that.
    keyword.addEventListener('focus', () => {
      if (keyword.matches(':focus-visible')) focused = keyword;
      update();
    });
    keyword.addEventListener('blur', () => {
      if (focused === keyword) focused = null;
      update();
    });
  });
}
