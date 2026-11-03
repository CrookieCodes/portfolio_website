// Entry point for the site's JavaScript (loaded as an ES module from index.html).
// Each feature lives in its own small module and is started here.

import { applyMotionVariables } from './motion-config.js';
import { initHeaderTheme } from './header-theme.js';
import { initEyeButtons } from './eye-buttons.js';

applyMotionVariables();
initHeaderTheme();
initEyeButtons();
