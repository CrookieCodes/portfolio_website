// Entry point for the site's JavaScript (loaded as an ES module from index.html).
// Each feature lives in its own small module and is started here.

import { applyMotionVariables } from './motion-config.js';
import { initSplash } from './splash.js';
import { initHeaderTheme } from './header-theme.js';
import { initEyeButtons } from './eye-buttons.js';
import { initHeadline } from './headline.js';
import { initEyeTracking } from './eye-tracking.js';
import { initEyeCross } from './eye-cross.js';
import { initEyeLabel } from './eye-label.js';
import { initDotFlow } from './dot-flow.js';
import { initScenes } from './scenes.js';
import { initPlaceholderLinks } from './placeholder-links.js';
import { initCarousel } from './carousel.js';
import { initReveal } from './reveal.js';

applyMotionVariables();
initHeaderTheme();
initEyeButtons();
initEyeTracking();
initEyeCross();
initEyeLabel();
initDotFlow();
initScenes();
initPlaceholderLinks();
initCarousel();
initReveal();
// The headline starts cycling once the splash has revealed the hero.
initSplash().then(initHeadline);
