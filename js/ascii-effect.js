// Shared ASCII effect (motion.md "ASCII effect"): a <canvas> that fills one or more
// shapes with a grid of small glyphs, and sweeps a band across them.
//
//   ahead of the band   empty outline circles ("off" cells)
//   in the band         dense filled circles
//   behind the band     thinning out: diamonds, then small four-point stars, then empty again
//
// The band is a front that moves in one of two directions:
//   direction: 'radial'  grows outward from `origin`, so the glyphs travel away from it
//   direction: 'down'    one straight front moving down across all the shapes together,
//                        from just above the highest to below the lowest
// One pass takes the front past the last cell and the trail behind it in
// ASCII.passDuration, then the sweep starts again. Frame rate is capped at ASCII.fps. It runs only
// while `screen` is on screen and the tab is visible; with reduced motion it draws
// one still frame.
//
// Everything is in design units (the coordinates of `width` x `height`), and the
// canvas is scaled to its size on the page, so it stays sharp at any window size.
//
// Usage:
//   createAsciiEffect({
//     canvas, screen, width, height, direction: 'radial', origin: { x, y },   // or direction: 'down' (no origin)
//     shapes: [{ path: Path2D, box: { x, y, w, h }, colours: [['--color-teal', 0.7], ...], ground }],
//   });
// Colours are CSS custom property names (tokens) with weights; each cell picks one at random.
// `ground` (optional, a token) fills the shape flat under the glyphs, so the shape reads as
// a solid figure even where nothing is drawn.

import { ASCII } from './motion-config.js';

// Small, fixed-seed random generator, so the pattern is the same on every load.
function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// WCAG contrast ratio between two #rrggbb colours (used to check the palette choices).
export function contrastRatio(a, b) {
  const luminance = (hex) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// The glyph a cell shows, from how far the front has passed it (in band widths)
// and the cell's own random threshold (so the trail thins out unevenly).
const OUTLINE = 0;
const CIRCLE = 1;
const DIAMOND = 2;
const STAR = 3;

function glyphFor(phase, threshold) {
  if (phase < 0 || phase >= 3) return OUTLINE;
  if (phase < 1) return CIRCLE;
  const emptied = ((phase - 1) / 2) * ASCII.thinning; // grows across the trail
  if (threshold < emptied) return OUTLINE;
  return phase < 2 ? DIAMOND : STAR;
}

// Adds one glyph to a path, centred in its cell (size s).
function addGlyph(path, type, x, y, s) {
  const r = s * 0.42;
  if (type === CIRCLE) {
    path.moveTo(x + r, y);
    path.arc(x, y, r, 0, Math.PI * 2);
  } else if (type === DIAMOND) {
    path.moveTo(x, y - r);
    path.lineTo(x + r, y);
    path.lineTo(x, y + r);
    path.lineTo(x - r, y);
    path.closePath();
  } else if (type === STAR) {
    const inner = s * 0.12;
    path.moveTo(x, y - r);
    path.lineTo(x + inner, y - inner);
    path.lineTo(x + r, y);
    path.lineTo(x + inner, y + inner);
    path.lineTo(x, y + r);
    path.lineTo(x - inner, y + inner);
    path.lineTo(x - r, y);
    path.lineTo(x - inner, y - inner);
    path.closePath();
  } else {
    const ring = s * 0.3;
    path.moveTo(x + ring, y);
    path.arc(x, y, ring, 0, Math.PI * 2);
  }
}

export function createAsciiEffect({ canvas, screen, width, height, direction = 'radial', origin, shapes }) {
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tokens = getComputedStyle(document.documentElement);
  const rand = random(1337);

  // Build the cells once: a grid over each shape's box, keeping the cells whose
  // centre is inside the shape. Each gets a colour and a threshold; its distance
  // along the sweep is worked out below, once all the cells are known.
  const probe = document.createElement('canvas').getContext('2d');
  const colours = new Set();
  const layers = shapes.map((shape) => {
    const size = Math.max(ASCII.minCell, shape.box.w / ASCII.columns);
    const columns = Math.floor(shape.box.w / size);
    const rows = Math.floor(shape.box.h / size);
    const left = shape.box.x + (shape.box.w - columns * size) / 2 + size / 2;
    const top = shape.box.y + (shape.box.h - rows * size) / 2 + size / 2;
    const palette = shape.colours.map(([token, weight]) => [tokens.getPropertyValue(token).trim(), weight]);
    const totalWeight = palette.reduce((sum, [, w]) => sum + w, 0);
    const cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = left + col * size;
        const y = top + row * size;
        if (!probe.isPointInPath(shape.path, x, y)) continue;
        let pick = rand() * totalWeight;
        const colour = palette.find(([, w]) => (pick -= w) < 0)?.[0] ?? palette[0][0];
        colours.add(colour);
        cells.push({ x, y, colour, threshold: rand(), distance: 0 });
      }
    }
    const ground = shape.ground ? tokens.getPropertyValue(shape.ground).trim() : null;
    return { path: shape.path, size, cells, ground };
  });
  // Distance of each cell along the sweep: from the origin ('radial'), or down from
  // the top edge of the highest cell ('down'), so the front starts just above it.
  const allCells = layers.flatMap((layer) => layer.cells.map((cell) => ({ cell, size: layer.size })));
  const top = Math.min(...allCells.map(({ cell, size }) => cell.y - size / 2));
  let farthest = 0;
  allCells.forEach(({ cell }) => {
    cell.distance = direction === 'down'
      ? cell.y - top
      : Math.hypot(cell.x - origin.x, cell.y - origin.y);
    farthest = Math.max(farthest, cell.distance);
  });
  const travel = farthest + ASCII.bandWidth * 3; // the front must clear the whole trail

  let scale = 1;
  let ratio = 1;

  function resize() {
    ratio = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(box.width * ratio));
    canvas.height = Math.max(1, Math.round(box.height * ratio));
    scale = box.width / width;
  }

  // Draws the effect with the front `front` design px along the sweep.
  function draw(front) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale * ratio, 0, 0, scale * ratio, 0, 0);
    layers.forEach((layer) => {
      // One path per colour for filled glyphs and one for outlines: few draw calls.
      const fills = new Map();
      const rings = new Map();
      colours.forEach((c) => { fills.set(c, new Path2D()); rings.set(c, new Path2D()); });
      layer.cells.forEach((cell) => {
        const type = glyphFor((front - cell.distance) / ASCII.bandWidth, cell.threshold);
        addGlyph(type === OUTLINE ? rings.get(cell.colour) : fills.get(cell.colour), type, cell.x, cell.y, layer.size);
      });
      if (layer.ground) {
        ctx.fillStyle = layer.ground;
        ctx.fill(layer.path);
      }
      ctx.save();
      ctx.clip(layer.path);
      ctx.lineWidth = Math.max(layer.size * 0.08, 1 / scale); // never thinner than one screen pixel
      colours.forEach((c) => {
        ctx.fillStyle = c;
        ctx.fill(fills.get(c));
        ctx.strokeStyle = c;
        ctx.stroke(rings.get(c));
      });
      ctx.restore();
    });
  }

  // Time only moves on while running, so a pause resumes where it stopped.
  let elapsed = 0;
  let last = 0;
  let lastDrawn = -Infinity;
  let frame = 0;
  let inView = false;

  const frontAt = (ms) => ((ms % ASCII.passDuration) / ASCII.passDuration) * travel;

  function tick(now) {
    if (last) elapsed += now - last;
    last = now;
    if (now - lastDrawn >= 1000 / ASCII.fps - 1) { // 30 fps cap
      lastDrawn = now;
      draw(frontAt(elapsed));
    }
    frame = requestAnimationFrame(tick);
  }

  function drawStill() {
    draw(ASCII.staticAt * travel);
  }

  function update() {
    // data-scene-paused: the screen is in the window but completely covered
    // (Touchpoints pinned under the Landing before the blinds rise, js/wipe.js).
    const run = inView && !screen.dataset.scenePaused && !document.hidden && !reduceMotion.matches;
    if (run && !frame) {
      last = 0;
      frame = requestAnimationFrame(tick);
    } else if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (reduceMotion.matches) drawStill();
  }

  // Resizing a canvas clears it, so redraw straight away (no blank frame while
  // the window is being resized).
  new ResizeObserver(() => {
    resize();
    if (reduceMotion.matches) {
      drawStill();
    } else {
      draw(frontAt(elapsed));
    }
  }).observe(canvas);
  reduceMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  new MutationObserver(update).observe(screen, { attributeFilter: ['data-scene-paused'] });
  // The 1px inset stops a neighbouring screen that only touches the window edge
  // from counting as on screen (it would run a second effect for nothing).
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }, { rootMargin: '-1px 0px' }).observe(screen);

  // For tests and tuning: how many cells each shape has.
  return { cellCounts: layers.map((layer) => layer.cells.length) };
}
