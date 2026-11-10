// In-page jumps that must be instant (CAROL): the footer's "Return to home" link.
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
  // Footer: the C mark and "< Click to Return Home" -> the Landing, at the very top.
  document.querySelectorAll('[data-js~="home-link"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      jumpTo('top', { hash: '#landing', focus: document.getElementById('landing-title') });
    });
  });
}
