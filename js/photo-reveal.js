// About portrait (motion.md section 6): the weave hides a photo of Carol.
//   - mouse over the weave: the photo dissolves in (CSS, --motion-photo-duration);
//     mouse leaves: it goes back instantly
//   - keyboard focus shows it too; Enter or Space toggles it (it is a button)
//   - on touch, a tap toggles it
// aria-pressed tells screen readers whether the photo is showing.

export function initPhotoReveal() {
  const portrait = document.querySelector('[data-js~="portrait"]');
  const photo = document.querySelector('[data-js="portrait-photo"]');
  if (!portrait || !photo) return;

  let shown = false;
  let lastPointer = 'mouse';

  function show(on) {
    shown = on;
    photo.classList.toggle('about__photo--shown', on);
    portrait.setAttribute('aria-pressed', String(on));
  }

  portrait.addEventListener('pointerdown', (event) => {
    lastPointer = event.pointerType;
  });
  portrait.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') show(true);
  });
  portrait.addEventListener('pointerleave', (event) => {
    // Stay shown only if it has keyboard focus (a mouse click also focuses it).
    if (event.pointerType !== 'touch' && !portrait.matches(':focus-visible')) show(false);
  });
  // Keyboard focus (not the focus a click or tap gives it).
  portrait.addEventListener('focus', () => {
    if (portrait.matches(':focus-visible')) show(true);
  });
  portrait.addEventListener('blur', () => show(false));
  portrait.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      show(!shown);
    }
  });
  portrait.addEventListener('click', () => {
    if (lastPointer === 'touch') show(!shown);
  });
}
