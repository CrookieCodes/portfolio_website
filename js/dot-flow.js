// Touchpoints dot flow (motion.md section 3): the small squares travel along the
// diagram's lines, from the base square (held by the hand) out into their own
// squares, and loop.
//
// Each route is one <path id="route-..."> in the inline diagram. Every dot starts
// at its Figma position (found as a distance along its route), so the first frame
// and the reduced-motion state match the design. All dots move at DOTS.speed, so
// the spacing between them stays as designed.
//
// Runs only while the touchpoints screen is on screen and the tab is visible.
// With reduced motion the dots stay where they are in the design.

import { DOTS } from './motion-config.js';

// Each dot carries on this far (design px) past the end of its line, along the
// line's final direction, so it is fully hidden under its square before it loops.
const OVERSHOOT = 30;

// Distance along the path of the point closest to (x, y): a coarse pass, then a fine one.
function nearestLength(path, x, y) {
  const total = path.getTotalLength();
  const distance = (s) => {
    const p = path.getPointAtLength(s);
    return Math.hypot(p.x - x, p.y - y);
  };
  let best = 0;
  for (let s = 0; s <= total; s += 4) {
    if (distance(s) < distance(best)) best = s;
  }
  for (let s = Math.max(0, best - 4); s <= Math.min(total, best + 4); s += 0.25) {
    if (distance(s) < distance(best)) best = s;
  }
  return best;
}

export function initDotFlow() {
  const groups = document.querySelectorAll('[data-js="dot-group"]');
  if (groups.length === 0) return;
  const screen = groups[0].closest('[data-js~="screen"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // One entry per route: the path, its length, the end direction, and its dots.
  const routes = [...groups].map((group) => {
    const path = document.getElementById(group.dataset.route);
    const total = path.getTotalLength();
    const end = path.getPointAtLength(total);
    const beforeEnd = path.getPointAtLength(total - 1);
    const endLength = Math.hypot(end.x - beforeEnd.x, end.y - beforeEnd.y) || 1;
    const dots = [...group.querySelectorAll('rect')].map((rect) => {
      const cx = Number(rect.getAttribute('x')) + Number(rect.getAttribute('width')) / 2;
      const cy = Number(rect.getAttribute('y')) + Number(rect.getAttribute('height')) / 2;
      return { rect, cx, cy, start: nearestLength(path, cx, cy) };
    });
    return {
      path,
      total,
      loop: total + OVERSHOOT,
      end,
      direction: { x: (end.x - beforeEnd.x) / endLength, y: (end.y - beforeEnd.y) / endLength },
      dots,
    };
  });

  // Point at distance s along a route, continuing straight on past its end.
  function pointAt(route, s) {
    if (s <= route.total) return route.path.getPointAtLength(s);
    const extra = s - route.total;
    return { x: route.end.x + route.direction.x * extra, y: route.end.y + route.direction.y * extra };
  }

  function draw(travelled) {
    routes.forEach((route) => {
      route.dots.forEach((dot) => {
        const p = pointAt(route, (dot.start + travelled) % route.loop);
        dot.rect.setAttribute('transform', `translate(${(p.x - dot.cx).toFixed(2)} ${(p.y - dot.cy).toFixed(2)})`);
      });
    });
  }

  function reset() {
    routes.forEach((route) => route.dots.forEach((dot) => dot.rect.removeAttribute('transform')));
  }

  let inView = false;
  let travelled = 0;  // design px moved so far; kept while paused, so it resumes in place
  let frame = 0;
  let last = 0;

  function tick(now) {
    if (last) travelled += (DOTS.speed * (now - last)) / 1000;
    last = now;
    draw(travelled);
    frame = requestAnimationFrame(tick);
  }

  function update() {
    // data-scene-paused: the screen is in the window but completely covered
    // (Touchpoints pinned under the Landing before the blinds rise, js/wipe.js).
    // data-scene-built: js/touchpoints-build.js has shown the dots (they wait until then).
    const run = inView && screen.dataset.sceneBuilt && !screen.dataset.scenePaused && !screen.dataset.sceneCovered && !document.hidden && !reduceMotion.matches;
    if (run && !frame) {
      last = 0;
      frame = requestAnimationFrame(tick);
    } else if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) {
      travelled = 0;
      reset();
    }
    update();
  });
  document.addEventListener('visibilitychange', update);
  new MutationObserver(update).observe(screen, { attributeFilter: ['data-scene-paused', 'data-scene-covered', 'data-scene-built'] });
  // The 1px inset stops the screen counting as visible when it only touches the
  // window edge (e.g. while the experiences screen fills the window).
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }, { rootMargin: '-1px 0px' }).observe(screen);
}
