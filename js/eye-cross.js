// Hero eyes: while the mouse is over an eye, or the eye has keyboard focus,
// its iris is replaced by the burgundy cross (motion.md section 2).
// The swap is instant: Figma gives no timing for it.

export function initEyeCross() {
  document.querySelectorAll('[data-js="eye-button"]').forEach((button) => {
    const iris = button.querySelector('[data-js="eye-iris"]');
    const cross = button.querySelector('[data-js="eye-cross"]');
    let hovered = false;
    let focused = false;

    function update() {
      const active = hovered || focused;
      iris.classList.toggle('hero__iris--hidden', active);
      cross.classList.toggle('hero__eye-cross--visible', active);
    }

    // Touch has no hover, so it does not count (a tap simply navigates).
    button.addEventListener('pointerenter', (event) => {
      hovered = event.pointerType !== 'touch';
      update();
    });
    button.addEventListener('pointerleave', () => {
      hovered = false;
      update();
    });
    // Keyboard focus only: a mouse click also focuses the button, but hover covers that.
    button.addEventListener('focus', () => {
      focused = button.matches(':focus-visible');
      update();
    });
    button.addEventListener('blur', () => {
      focused = false;
      update();
    });
  });
}
