// Header theme: keeps the fixed header's colours and active nav link in step
// with the screen currently behind it.
//
// Each screen carries data-screen-theme (and, for Work and About, data-screen-nav).
// An IntersectionObserver watches a 1px line across the middle of the header;
// whichever screen crosses that line sets the header's data-theme, and the nav
// link whose data-nav matches gets the active class and aria-current.

export function initHeaderTheme() {
  const header = document.querySelector('[data-js="site-header"]');
  const screens = document.querySelectorAll('[data-js="screen"]');
  const navLinks = document.querySelectorAll('[data-js="nav-link"]');
  if (!header || screens.length === 0) return;

  function applyScreen(screen) {
    header.dataset.theme = screen.dataset.screenTheme;
    const activeNav = screen.dataset.screenNav;
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

  let observer;

  // The watched line depends on the header's position and the window height,
  // so the observer is rebuilt when the window is resized.
  function observe() {
    if (observer) observer.disconnect();
    const rect = header.getBoundingClientRect();
    const line = Math.round(rect.top + rect.height / 2);
    const below = Math.max(0, window.innerHeight - line - 1);
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) applyScreen(entry.target);
        });
      },
      { rootMargin: `-${line}px 0px -${below}px 0px` },
    );
    screens.forEach((screen) => observer.observe(screen));
  }

  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(observe);
  });

  observe();
}
