// Push-in slides (css/push.css): the slide itself is pure CSS (sticky screens). This
// only marks a pinned screen as covered (data-scene-covered) once the next screen has
// slid all the way over it, so its canvas effects stop while it is out of sight
// (js/ascii-effect.js, js/dot-flow.js), and unmarks it when scrolling back.

const PAIRS = [
  ['[data-js~="wipe-next"]', '#experiences'], // Touchpoints, covered by Experiences
  ['#experiences', '#work'],                  // Experiences, covered by Selected Works
];

export function initPushIn() {
  const pairs = PAIRS
    .map(([under, over]) => ({ under: document.querySelector(under), over: document.querySelector(over), covered: null }))
    .filter((pair) => pair.under && pair.over);
  if (pairs.length === 0) return;

  function update() {
    pairs.forEach((pair) => {
      const covered = pair.over.getBoundingClientRect().top <= 0;
      if (covered === pair.covered) return;
      pair.covered = covered;
      if (covered) {
        pair.under.dataset.sceneCovered = 'true';
      } else {
        delete pair.under.dataset.sceneCovered;
      }
    });
  }

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
