// Scroll cue: the pulse itself is a CSS animation (css/scroll-cue.css). This only
// pauses it while the cue is off-screen or the tab is hidden, so nothing animates
// out of sight.

export function initScrollCues() {
  const cues = document.querySelectorAll('[data-js="scroll-cue"]');
  if (cues.length === 0) return;

  const inView = new Map();
  const update = (cue) => {
    cue.classList.toggle('scroll-cue--paused', document.hidden || !inView.get(cue));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      inView.set(entry.target, entry.isIntersecting);
      update(entry.target);
    });
  });
  cues.forEach((cue) => observer.observe(cue));

  document.addEventListener('visibilitychange', () => cues.forEach(update));
}
