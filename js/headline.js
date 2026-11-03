// Hero headline cycle (motion.md section 2):
// "products." -> "services." -> "experiences." -> back to "products.", forever.
//
// Each word stays for HEADLINE.delay, then crossfades to the next over
// HEADLINE.duration (both from the Figma prototype, in js/motion-config.js).
// The bronze block's width animates to fit the new word: this script measures
// the next word and sets the highlight's width; CSS does the animating.
//
// Runs only while the hero is on screen and the tab is visible.
// With reduced motion it stays on "products.".

import { HEADLINE } from './motion-config.js';

export function initHeadline() {
  const highlight = document.querySelector('[data-js="headline-highlight"]');
  const words = [...document.querySelectorAll('[data-js="headline-word"]')];
  const hero = document.getElementById('hero');
  if (!highlight || words.length < 2 || !hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = 0;
  let heroInView = true;

  // Width in em, so it stays correct if the window (and so the font size) changes.
  function widthInEm(element) {
    const fontSize = parseFloat(getComputedStyle(highlight).fontSize);
    return `${element.getBoundingClientRect().width / fontSize}em`;
  }

  function showWord(index) {
    // Fix the current width first, so the change to the new width can animate.
    highlight.style.width = widthInEm(highlight);
    highlight.getBoundingClientRect(); // makes the browser apply it before the change below
    words[current].classList.remove('hero__word--current');
    words[index].classList.add('hero__word--current');
    highlight.style.width = widthInEm(words[index]);
    current = index;
  }

  function canRun() {
    return !reduceMotion.matches && heroInView && !document.hidden;
  }

  // Wait, change the word, then wait again (the change itself takes HEADLINE.duration).
  function scheduleNext(wait) {
    clearTimeout(timer);
    if (!canRun()) return;
    timer = setTimeout(() => {
      showWord((current + 1) % words.length);
      scheduleNext(HEADLINE.duration + HEADLINE.delay);
    }, wait);
  }

  function stop() {
    clearTimeout(timer);
  }

  function update() {
    if (canRun()) {
      scheduleNext(HEADLINE.delay);
    } else {
      stop();
    }
  }

  // Reduced motion switched on while the page is open: go back to "products." at once.
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches && current !== 0) {
      showWord(0);
      highlight.style.width = '';
    }
    update();
  });

  document.addEventListener('visibilitychange', update);

  new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    update();
  }).observe(hero);
}
