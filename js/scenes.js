// Applies the shared ASCII effect (js/ascii-effect.js) to screens 3 and 4.
//
// Screen 3: the six touchpoint squares. Glyph colours are the palette colours that
// contrast best with each square's gradient (contrast ratios against the light and
// dark ends noted below). The band starts at the base square's centre, so it moves
// outward the same way as the dots.
//
// Screen 4: the three figures on the street photo, flat shapes filled by the effect.
// Their main colour is the figure's own hue. Deep-teal is unreadable on this photo
// (about 1.2:1), so the blue figure uses pale teal; the pink figure mixes in bronze
// because burgundy alone is dim there (about 1.3:1). The band starts from the same
// frame point as on screen 3 (the base square's centre).

import { createAsciiEffect } from './ascii-effect.js';

// Square colours by square family.             contrast vs gradient light / dark end
const SQUARE_COLOURS = {
  teal: [['--color-teal', 0.7], ['--color-burgundy', 0.3]],      // 7.9 / 3.2, 3.9 / 1.6
  pink: [['--color-teal', 0.7], ['--color-bronze', 0.3]],        // 6.3 / 1.7, 1.9 / 2.0
  brown: [['--color-teal', 0.8], ['--color-burgundy', 0.2]],     // 6.6 / 2.1, 3.2 / 1.0
};

// Figure colours.                                   contrast vs the photo under it (median)
const FIGURE_COLOURS = {
  pink: [['--color-burgundy', 0.7], ['--color-bronze', 0.3]],    // 1.3, 2.2
  brown: [['--color-bronze', 0.8], ['--color-burgundy', 0.2]],   // 4.2, 2.5
  blue: [['--color-pale-teal', 0.8], ['--color-teal', 0.2]],     // 6.2, 1.2
};

// The base square's centre in the 1920 x 1080 frame (diagram at x 280, y 168;
// square at 527.6, 504.2, 222.2 wide).
const ORIGIN_IN_FRAME = { x: 280 + 638.68, y: 168 + 615.26 };

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
  const canvas = document.querySelector('[data-js="ascii-touchpoints"]');
  const diagram = document.querySelector('[data-js="diagram"]');
  if (!canvas || !diagram) return;
  const shapes = [...diagram.querySelectorAll('[data-square]')].map((rect) => {
    const box = boxOf(rect);
    const path = new Path2D();
    path.rect(box.x, box.y, box.w, box.h);
    return { path, box, colours: SQUARE_COLOURS[rect.dataset.square.split('-')[0]] };
  });
  return createAsciiEffect({
    canvas,
    screen: canvas.closest('[data-js="screen"]'),
    width: 1340,
    height: 727,
    origin: { x: ORIGIN_IN_FRAME.x - 280, y: ORIGIN_IN_FRAME.y - 168 }, // diagram units
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
    return { path, box: boxOf(figure), colours: FIGURE_COLOURS[figure.dataset.figure] };
  });
  return createAsciiEffect({
    canvas,
    screen: canvas.closest('[data-js="screen"]'),
    width: 1920,
    height: 1080,
    origin: ORIGIN_IN_FRAME,
    shapes,
  });
}

export function initScenes() {
  return { touchpoints: initTouchpoints(), experiences: initExperiences() };
}
