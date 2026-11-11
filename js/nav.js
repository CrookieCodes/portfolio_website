// Navigation (CAROL): instant in-page jumps and link targets from js/site-config.js.
//   - Header About -> the About section (NAV.about); About's load plays on arrival.
//   - Header Contact -> the footer for now (NAV.contact).
//   - Footer "Return to home" -> the top of the page (the Landing).
//   - "Learn More >" -> ABOUT_PAGE_URL; hidden while that is empty.
//
// The page uses smooth scrolling for anchor links (css/base.css), but a smooth scroll
// from the footer back to the top would run every scroll-tied transition on the way.
// These links jump instead: window.scrollTo with behavior 'instant' overrides the CSS.
// The splash only plays on page load, so it never replays. Every scroll-driven module
// (header theme, blinds, push-ins, header fade over the footer) measures on the scroll
// event that the jump fires, so the header and screens are correct on arrival; a
// screen's load animation plays on arrival if it has not played yet.
//
// After the jump the address shows the target's hash (history.pushState, so the Back
// button returns to where the visitor was) and keyboard focus moves to the target's
// heading, so the next Tab continues from there.

import { NAV, ABOUT_PAGE_URL } from './site-config.js';

// Jumps to the element with this id (or the top of the page for 'top'), instantly.
export function jumpTo(id, { hash = `#${id}`, focus = null } = {}) {
  const target = id === 'top' ? null : document.getElementById(id);
  const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior: 'instant' });
  if (hash && location.hash !== hash) history.pushState(null, '', hash);
  // Focus once the scroll-driven modules have caught up (they update on the next frame):
  // until then a screen the jump has uncovered may still be hidden (css/wipe.css) and
  // could not take focus.
  if (focus) requestAnimationFrame(() => requestAnimationFrame(() => focus.focus({ preventScroll: true })));
}

export function initNav() {
  // Header links with data-nav-target: point them at NAV and jump instantly. Focus goes
  // to the target's heading (the first element inside it with tabindex="-1").
  document.querySelectorAll('[data-nav-target]').forEach((link) => {
    const id = NAV[link.dataset.navTarget];
    if (!id) return;
    link.href = `#${id}`;
    link.addEventListener('click', (event) => {
      const target = document.getElementById(id);
      if (!target) return; // not on this page: let the link do its default
      event.preventDefault();
      jumpTo(id, { focus: target.querySelector('[tabindex="-1"]') });
    });
  });

  // Learn More: shown as a real link once ABOUT_PAGE_URL is set; hidden until then.
  document.querySelectorAll('[data-js~="learn-more"]').forEach((button) => {
    if (!ABOUT_PAGE_URL) return;
    button.href = ABOUT_PAGE_URL;
    button.hidden = false;
  });

  // Footer: the C mark and "< Click to Return Home" -> the Landing, at the very top.
  document.querySelectorAll('[data-js~="home-link"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      jumpTo('top', { hash: '#landing', focus: document.getElementById('landing-title') });
    });
  });
}
