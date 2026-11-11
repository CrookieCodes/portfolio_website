// Link targets that may change later, each set in one place (CAROL).
// js/nav.js applies them to the page.

// Header links that jump within index.html. Each value is the id of the element to
// jump to; the jump is instant (no smooth scroll through every transition).
//   about:   the About section. (On about.html, Phase 7, About is the active item and
//            jumps to the top of that page instead.)
//   contact: the footer, for now. Repoint it here if a contact page or section arrives.
export const NAV = {
  about: 'about',
  contact: 'contact',
};

// Below this width the desktop experience does not run: css/narrow.css shows a notice
// instead, and js/main.js and js/splash.js do not start (keep the CSS in step).
export const NARROW_QUERY = '(max-width: 1023.98px)';

// "Learn More >" in the About section. Empty: no destination yet, so the button is
// hidden. Set it to 'about.html' once that page exists and the button appears.
export const ABOUT_PAGE_URL = '';
