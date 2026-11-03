// Selected Works carousel (motion.md section 5).
//
// The strip itself is a normal horizontal scroller with CSS snapping, so
// trackpad swipes, Shift+wheel and the arrow keys (strip focused) all work
// without any script. This script only runs the arrow button:
//   - "Next projects" scrolls one set (as many cards as fit) to the right;
//   - once the strip is past its halfway point the button turns to point left,
//     becomes "Previous projects", and scrolls back to the start.
// The flip itself is instant: motion.md gives no timing for it.

export function initCarousel() {
  const carousel = document.querySelector('[data-js="carousel"]');
  const arrow = document.querySelector('[data-js="carousel-arrow"]');
  if (!carousel || !arrow) return;
  const cards = carousel.querySelectorAll('.card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const maxScroll = () => carousel.scrollWidth - carousel.clientWidth;
  const isBack = () => carousel.scrollLeft > maxScroll() / 2;

  function update() {
    const back = isBack();
    arrow.classList.toggle('works__arrow--back', back);
    arrow.setAttribute('aria-label', back ? 'Previous projects' : 'Next projects');
  }

  // One set = the distance from the first card to the first card that is not
  // fully visible (three cards at 16:9).
  function setWidth() {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const visible = Math.max(1, Math.floor((carousel.clientWidth + step - cards[0].offsetWidth) / step));
    return visible * step;
  }

  arrow.addEventListener('click', () => {
    const behavior = reduceMotion.matches ? 'auto' : 'smooth';
    if (isBack()) {
      carousel.scrollTo({ left: 0, behavior });
    } else {
      carousel.scrollTo({ left: Math.min(maxScroll(), carousel.scrollLeft + setWidth()), behavior });
    }
  });

  let frame = 0;
  carousel.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
