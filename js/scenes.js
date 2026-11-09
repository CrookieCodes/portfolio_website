// Applies the shared ASCII effect (js/ascii-effect.js) to screens 3 and 4.
//
// Screen 3: the six touchpoint squares. Glyph colours are the palette colours that
// contrast best with each square's gradient (contrast ratios against the light and
// dark ends noted below). The band spreads outward from the base square's centre
// (direction 'radial'), the same way as the dots.
//
// Screen 4: the three figures on the street photo, flat deep-teal shapes (a ground
// under the glyphs, so the people in the photo do not show through) filled by the
// effect. Each figure's main colour is its own hue; the blue figure uses pale teal
// (Carol's fallback: deep-teal is about 1.2:1 on the photo, and invisible on the
// deep-teal ground). The band sweeps straight down (direction 'down'): one front
// across all three figures, so they light up in order of height.

import { createAsciiEffect } from './ascii-effect.js';

// Square colours by square family.             contrast vs gradient light / dark end
const SQUARE_COLOURS = {
  teal: [['--color-teal', 0.7], ['--color-burgundy', 0.3]],      // 7.9 / 3.2, 3.9 / 1.6
  pink: [['--color-teal', 0.7], ['--color-bronze', 0.3]],        // 6.3 / 1.7, 1.9 / 2.0
  brown: [['--color-teal', 0.8], ['--color-burgundy', 0.2]],     // 6.6 / 2.1, 3.2 / 1.0
};

// Figure colours.                                   contrast vs the deep-teal ground
const FIGURE_GROUND = '--color-teal';
const FIGURE_COLOURS = {
  pink: [['--color-burgundy', 0.7], ['--color-bronze', 0.3]],    // 2.0, 3.4
  brown: [['--color-bronze', 0.8], ['--color-burgundy', 0.2]],   // 3.4, 2.0
  blue: [['--color-pale-teal', 0.8], ['--color-bronze', 0.2]],   // 7.7, 3.4
};

// The base square's centre in diagram units (square at 527.6, 504.2, 222.2 wide).
const BASE_SQUARE_CENTRE = { x: 638.68, y: 615.26 };

// A shape's box after its SVG transform (the left pink square is rotated 90deg).
function boxOf(element) {
  const b = element.getBBox();
  const m = element.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix();
  const corners = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
    .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

function initTouchpoints() {
  const canvas = document.querySelector('[data-js~="ascii-touchpoints"]');
  const diagram = document.querySelector('[data-js~="diagram"]');
  if (!canvas || !diagram) return;
  const shapes = [...diagram.querySelectorAll('[data-square]')].map((rect) => {
    const box = boxOf(rect);
    const path = new Path2D();
    path.rect(box.x, box.y, box.w, box.h);
    return { path, box, colours: SQUARE_COLOURS[rect.dataset.square.split('-')[0]] };
  });
  return createAsciiEffect({
    canvas,
    screen: canvas.closest('[data-js~="screen"]'),
    width: 1340,
    height: 727,
    direction: 'radial',
    origin: BASE_SQUARE_CENTRE,
    shapes,
  });
}

function initExperiences() {
  const canvas = document.querySelector('[data-js="ascii-experiences"]');
  const figures = document.querySelectorAll('[data-js="figure"]');
  if (!canvas || figures.length === 0) return;
  const shapes = [...figures].map((figure) => {
    const m = figure.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix();
    const path = new Path2D();
    path.addPath(new Path2D(figure.getAttribute('d')), m);
    return { path, box: boxOf(figure), colours: FIGURE_COLOURS[figure.dataset.figure], ground: FIGURE_GROUND };
  });
  return createAsciiEffect({
    canvas,
    screen: canvas.closest('[data-js~="screen"]'),
    width: 1920,
    height: 1080,
    direction: 'down',
    shapes,
  });
}

export function initScenes() {
  return { touchpoints: initTouchpoints(), experiences: initExperiences() };
}
