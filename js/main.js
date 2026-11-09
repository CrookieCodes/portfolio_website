// Entry point for the site's JavaScript (loaded as an ES module from index.html).
// Each feature lives in its own small module and is started here.

import { applyMotionVariables } from './motion-config.js';
import { splashDone } from './splash.js';
import { initHeaderTheme } from './header-theme.js';
import { initHeaderLogo } from './header-logo.js';
import { initScrollCues } from './scroll-cue.js';
import { initWipe } from './wipe.js';
import { initPushIn } from './push-in.js';
import { initEyeTracking } from './eye-tracking.js';
import { initEyeCross } from './eye-cross.js';
import { initDotFlow } from './dot-flow.js';
import { initTouchpointsBuild } from './touchpoints-build.js';
import { initTouchpointsText } from './touchpoints-text.js';
import { initExperiencesReveal } from './experiences-reveal.js';
import { initScenes } from './scenes.js';
import { initPlaceholderLinks } from './placeholder-links.js';
import { initWorks } from './works.js';
import { initReveal } from './reveal.js';
import { initPhotoReveal } from './photo-reveal.js';
import { initFooterSpin } from './footer-spin.js';

applyMotionVariables();
initHeaderTheme();
initHeaderLogo();
initScrollCues();
const wipeCovered = initWipe();
initPushIn();
initEyeTracking();
initEyeCross();
initDotFlow();
initTouchpointsBuild();
const scenes = initScenes();
const experiencesLit = initExperiencesReveal(scenes.experiences);
initTouchpointsText();
initPlaceholderLinks();
const worksReady = initWorks();
// The Landing's load animation waits until the splash has gone, Touchpoints' until
// the blinds have covered the screen, and Experiences' text until the light has
// swept the scene; Selected Works' until it has arrived.
initReveal({ waitFor: { splash: splashDone, wipe: wipeCovered, experiences: experiencesLit, works: worksReady } });
initPhotoReveal();
initFooterSpin();
