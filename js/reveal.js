// Loading animation (motion.md sections 5 and 6): when Selected Works or About
// comes into view, its items (data-js containing "reveal") fade up into place, one after
// another, once. With reduced motion, nothing is hidden and nothing moves.

import { REVEAL } from './motion-config.js';

export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('[data-js~="reveal"]');
  if (items.length === 0) return;

  // Group the items by screen and number them in order, for the stagger.
  const groups = new Map();
  items.forEach((item) => {
    const screen = item.closest('[data-js="screen"]');
    if (!groups.has(screen)) groups.set(screen, []);
    const group = groups.get(screen);
    item.style.setProperty('--reveal-index', group.length);
    group.push(item);
    item.classList.add('reveal--pending'); // hidden, ready to rise
  });

  // When an item has finished, drop the classes so its own styles (for example
  // a card's hover transition) apply again.
  function cleanUp(item) {
    if (!item.classList.contains('reveal--in')) return;
    item.classList.remove('reveal--in');
    item.style.removeProperty('--reveal-index');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      groups.get(entry.target).forEach((item, index) => {
        item.classList.add('reveal--in');
        item.classList.remove('reveal--pending');
        item.addEventListener('transitionend', function done(event) {
          if (event.target !== item || event.propertyName !== 'opacity') return;
          item.removeEventListener('transitionend', done);
          cleanUp(item);
        });
        // Fallback in case the end event never comes (e.g. the tab was hidden).
        setTimeout(() => cleanUp(item), index * REVEAL.stagger + REVEAL.duration + 2000);
      });
      observer.unobserve(entry.target); // once only
    });
  }, { threshold: REVEAL.threshold });

  groups.forEach((group, screen) => observer.observe(screen));
}
