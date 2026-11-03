// Hero eyes: shortcut buttons. The left eye goes to the touchpoints screen,
// the right eye to the experiences screen (data-target holds the screen's id).
//
// Setting location.hash gives the screen its address, so the Back button
// returns to the hero, and lets the browser do the scroll: smooth, or instant
// with reduced motion (see base.css). No animation of the eyes yet.

export function initEyeButtons() {
  document.querySelectorAll('[data-js="eye-button"]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;

      if (location.hash === `#${target.id}`) {
        // Already at this address: the hash would not change, so scroll directly.
        target.scrollIntoView();
      } else {
        location.hash = target.id;
      }

      // Move keyboard focus to the screen's heading so Tab carries on from there.
      const heading = target.querySelector('[data-js="screen-heading"]');
      if (heading) heading.focus({ preventScroll: true });
    });
  });
}
