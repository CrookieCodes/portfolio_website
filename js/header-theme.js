// Header theme: keeps the fixed header's colours, logo and active nav link in step
// with the screen currently behind it.
//
// Each screen carries data-screen-theme, and optionally data-screen-nav (the nav
// item to mark active) and data-screen-logo ("primary"; anything else, or nothing,
// means the secondary pinwheel). The header gets data-theme and data-logo.
//
// Which screen is "behind the header": the last screen, in page order, that covers
// the middle of the header. Page order matters because later screens slide over
// earlier ones (the push-in: the earlier screen is sticky and stays under the header
// while the next one covers it), so the later one is the one on top.
//
// Measured on scroll (at most once per frame), on resize, and when a screen's
// data-screen-* attributes change (the block-wipe flips them at its midpoint).

export function initHeaderTheme() {
  const header = document.querySelector('[data-js="site-header"]');
  const screens = [...document.querySelectorAll('[data-js~="screen"]')];
  const navLinks = document.querySelectorAll('[data-js="nav-link"]');
  if (!header || screens.length === 0) return;

  let current = null; // signature of what is applied, to skip repeat work

  function applyScreen(screen) {
    const theme = screen.dataset.screenTheme;
    const logo = screen.dataset.screenLogo === 'primary' ? 'primary' : 'secondary';
    const activeNav = screen.dataset.screenNav;
    const signature = `${theme}|${logo}|${activeNav}`;
    if (signature === current) return;
    current = signature;

    header.dataset.theme = theme;
    header.dataset.logo = logo;
    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === activeNav;
      link.classList.toggle('site-nav__link--active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function measure() {
    const rect = header.getBoundingClientRect();
    const line = rect.top + rect.height / 2;
    let found = null;
    screens.forEach((screen) => {
      const box = screen.getBoundingClientRect();
      if (box.top <= line && box.bottom > line) found = screen; // later screens win
    });
    if (found) applyScreen(found);
  }

  let frame = 0;
  function scheduleMeasure() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  }

  window.addEventListener('scroll', scheduleMeasure, { passive: true });
  window.addEventListener('resize', scheduleMeasure);

  // A screen's theme or logo can change while it stays in place (the block-wipe).
  new MutationObserver(scheduleMeasure).observe(document.querySelector('main') ?? document.body, {
    subtree: true,
    attributeFilter: ['data-screen-theme', 'data-screen-logo', 'data-screen-nav'],
  });

  measure();
}
