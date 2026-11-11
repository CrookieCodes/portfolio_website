// Entry point for the site's JavaScript (loaded as an ES module from index.html).
// Each feature lives in its own small module and is started here.
// Below NARROW_QUERY (phones, narrow windows) the desktop experience does not start:
// css/narrow.css shows a notice instead. If such a window is later widened, the page
// reloads so the desktop experience starts properly.

import { applyMotionVariables } from './motion-config.js';
import { NARROW_QUERY } from './site-config.js';
import { splashDone } from './splash.js';
import { initHeaderTheme } from './header-theme.js';
import { initHeaderLogo } from './header-logo.js';
import { initHeaderFooter } from './header-footer.js';
import { initNav } from './nav.js';
import { initSettle } from './settle.js';
import { initScrollCues } from './scroll-cue.js';
import { initWipes } from './wipe.js';
import { initPushIn } from './push-in.js';
import { initEyeTracking } from './eye-tracking.js';
import { initEyeCross } from './eye-cross.js';
import { initDotFlow } from './dot-flow.js';
import { initTouchpointsBuild } from './touchpoints-build.js';
import { initTouchpointsText } from './touchpoints-text.js';
import { initExperiencesReveal } from './experiences-reveal.js';
import { initScenes } from './scenes.js';
import { initWorks } from './works.js';
import { initReveal } from './reveal.js';

function startDesktop() {
  applyMotionVariables();
  // Opened at an address inside the page (/#about, /#work...): jump there now, once the
  // hold lengths are applied and before the scroll-driven modules start, instead of
  // waiting for the browser's own smooth scroll after the page has loaded.
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
  initHeaderTheme();
  initHeaderLogo();
  initHeaderFooter();
  initNav();
  initSettle();
  initScrollCues();
  const wipes = initWipes();
  const pushes = initPushIn();
  initEyeTracking();
  initEyeCross();
  initDotFlow();
  initTouchpointsBuild();
  const scenes = initScenes();
  const experiencesLit = initExperiencesReveal(scenes.experiences);
  initTouchpointsText();
  initWorks();
  // The Landing's load animation waits until the splash has gone, Touchpoints' until
  // the blinds have covered the screen, and Experiences' text until the light has
  // swept the scene; Selected Works' until its blinds have covered the screen; About's
  // until it has slid in over Works; the footer's until it has slid in over About.
  initReveal({ waitFor: { splash: splashDone, wipe: wipes.touchpoints, experiences: experiencesLit, works: wipes.works, about: pushes.about, footer: pushes.footer } });
}

const narrow = window.matchMedia(NARROW_QUERY);
if (narrow.matches) {
  narrow.addEventListener('change', () => { if (!narrow.matches) window.location.reload(); });
} else {
  startDesktop();
}
