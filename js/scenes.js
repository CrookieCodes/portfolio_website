// Applies the shared ASCII effect (js/ascii-effect.js) to screens 3 and 4.
//
// Screen 3: the six touchpoint squares. The band spreads outward from the base
// square's centre (direction 'radial'), the same way as the dots.
// Screen 4: the three figures on the street photo. The band sweeps straight down
// (direction 'down'): one front across all three figures.
// Both draw the brighter glyph colours on a flat deep-teal ground (see below).
// Cell size: ASCII.cell (8 design px, CAROL).

import { createAsciiEffect } from './ascii-effect.js';
import { EXPERIENCES_REVEAL } from './motion-config.js';

// Glyph colours: the brighter set (motion.md v2, CAROL), each cell picks one by weight.
// All glyphs sit on the deep-teal ground (CAROL's prototype): on the squares' own
// light gradient ends the bright glyphs measured only 1.0 to 2.1 : 1, on deep teal
// 5.5 to 6.8 : 1 (pink 6.1, blue 5.5, orange 6.8).
const GROUND = '--color-teal';
const SQUARE_COLOURS = {
  teal: [['--color-glyph-blue', 0.7], ['--color-glyph-pink', 0.3]],
  pink: [['--color-glyph-pink', 0.7], ['--color-glyph-orange', 0.3]],
  brown: [['--color-glyph-orange', 0.7], ['--color-glyph-pink', 0.3]],
};
const FIGURE_COLOURS = {
  pink: [['--color-glyph-pink', 0.8], ['--color-glyph-orange', 0.2]],
  blue: [['--color-glyph-blue', 0.8], ['--color-glyph-pink', 0.2]],
  brown: [['--color-glyph-orange', 0.8], ['--color-glyph-pink', 0.2]],
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
    return { path, box, colours: SQUARE_COLOURS[rect.dataset.square.split('-')[0]], ground: GROUND };
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
    return { path, box: boxOf(figure), colours: FIGURE_COLOURS[figure.dataset.figure], ground: GROUND, name: figure.dataset.figure };
  });
  return createAsciiEffect({
    canvas,
    screen: canvas.closest('[data-js~="screen"]'),
    width: 1920,
    height: 1080,
    direction: 'down',
    shapes,
    cycle: EXPERIENCES_REVEAL.glyphCycle,
    gated: true, // each person lights up as the light passes (js/experiences-reveal.js)
  });
}

export function initScenes() {
  return { touchpoints: initTouchpoints(), experiences: initExperiences() };
}
