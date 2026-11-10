// Header over the footer (CAROL): the fixed header is not shown over the footer.
// Once the footer's top edge reaches the bottom of the header band, the header gets
// .site-header--hidden: it fades out (HEADER.footerFade, js/motion-config.js), then
// css/header.css hides it (visibility: hidden, no pointer events), so its links cannot
// be clicked or reached with Tab. Scrolling back up shows it again.
// Measured on scroll (at most once per frame) and on resize.

export function initHeaderFooter() {
  const header = document.querySelector('[data-js="site-header"]');
  const footer = document.querySelector('[data-js~="footer"]');
  if (!header || !footer) return;

  // The band: from the top of the window to the bottom of the logo and nav.
  const band = header.querySelector('[data-js="header-band"]') ?? header;
  let hidden = null;

  function measure() {
    const over = footer.getBoundingClientRect().top <= band.getBoundingClientRect().bottom;
    if (over === hidden) return;
    hidden = over;
    header.classList.toggle('site-header--hidden', over);
  }

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; measure(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  measure();
}
