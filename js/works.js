// Selected Works (motion.md v2 section 5, CAROL): the card reel, the pinwheel, the
// two buttons and the domain view. Cards are built from js/projects.js.
//
// The reel is a vertical track of cards in a clipped panel; the next card peeks in
// below the current one. Every change rolls the track upward only, never down:
//   - Next Project: one card up (in the full list or within the current domain).
//     At the end it rolls on into copies of the first cards added after the last,
//     then jumps back to the real first card without animation.
//   - Sort by Domain / < > / a Landing keyword: the current card rolls away upward
//     and the new list's first card rolls in from below.
// While rolling the track blurs and stretches a little, the arriving card grows from
// dim and small to full, the leaving card the reverse, and the pinwheel turns a
// quarter in sync (js/pinwheel.js). Rolls do not queue: a click while one runs is
// ignored. The new card is announced (aria-live). Cards that are not current are
// hidden from screen readers and from Tab (inert). Reduced motion: instant changes.
//
// Each card's image is its link, with a cursor label ("Click to view project",
// js/cursor-label.js) that never shows on cards that are not current or during a roll.
//
// Loading, once per page load: the grey column, the pinwheel, the buttons, the title
// row and the cards load with the standard animation, in that order (js/reveal.js
// waits on the promise returned here).

import { PROJECTS, DOMAINS } from './projects.js';
import { WORKS, PUSH } from './motion-config.js';
import { createPinwheel } from './pinwheel.js';
import { attachCursorLabel, hideCursorLabel } from './cursor-label.js';

const CARD_LABEL = 'Click to view project';

const COPIES = 2; // copies of the first cards after the last, for the wrap-around

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function buildCard(project) {
  const card = el('li', 'card');
  // The image is the link to the project. No project page exists yet, so it is a
  // placeholder (href "#", aria-disabled; js/placeholder-links.js stops the jump).
  const media = el('a', 'card__media');
  media.href = project.url ?? '#';
  if (!project.url) media.setAttribute('aria-disabled', 'true');
  media.setAttribute('aria-label', `View project: ${project.title}`);
  const image = el('img', 'card__image');
  Object.assign(image, { src: project.image.src, alt: '', width: project.image.width, height: project.image.height });
  image.decoding = 'async';
  media.append(image);
  attachCursorLabel(media, CARD_LABEL);
  const body = el('div', 'card__body');
  body.append(el('h3', 'card__title', project.title), el('p', 'card__text', project.description));
  const logos = el('div', 'card__logos');
  project.logos.forEach((logo) => {
    const img = el('img', logo.className);
    Object.assign(img, { src: logo.src, alt: '', width: logo.width, height: logo.height });
    logos.append(img);
  });
  const tags = el('ul', 'card__tags');
  tags.setAttribute('role', 'list');
  tags.setAttribute('aria-label', 'Disciplines');
  project.tags.forEach((tag) => tags.append(el('li', 'card__tag', tag)));
  const footer = el('div', 'card__footer');
  footer.append(logos, tags);
  body.append(footer);
  card.append(media, body);
  return card;
}

export function initWorks() {
  const screen = document.getElementById('work');
  const track = screen?.querySelector('[data-js="works-track"]');
  const svg = screen?.querySelector('[data-js="pinwheel"]');
  if (!screen || !track || !svg) return Promise.resolve();
  const q = (name) => screen.querySelector(`[data-js~="${name}"]`);
  const next = q('works-next');
  const sort = q('works-sort');
  const title = q('works-title');
  const years = q('works-years');
  const domainNav = q('works-domain-nav');
  const status = q('works-status');
  const viewport = q('works-viewport');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinwheel = createPinwheel(svg);

  let domain = null;          // null = the full list, else a DOMAINS id
  let list = PROJECTS;        // the projects in the current view
  let index = 0;              // the current card
  let rolling = false;

  const listFor = (id) => (id ? PROJECTS.filter((project) => project.domains.includes(id)) : PROJECTS);
  const domainTitle = (id) => DOMAINS.find((d) => d.id === id)?.title ?? '';
  const stepOffset = (step) => `0 calc(var(--works-step) * ${-step})`;

  // Renders `cards` (projects) into the track, plus copies of the first ones, and
  // shows card `at` with no animation. Only card `current` can be read or tabbed to.
  function render(cards, at, current = at) {
    hideCursorLabel(); // the hovered card may be about to be replaced
    track.replaceChildren(...cards.map(buildCard), ...cards.slice(0, COPIES).map(buildCard));
    track.style.translate = stepOffset(at);
    markCurrent(current);
  }

  function markCurrent(current) {
    [...track.children].forEach((card, i) => {
      const isCurrent = i === current;
      card.inert = !isCurrent;
      if (isCurrent) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    });
  }

  function announce(prefix = '') {
    status.textContent = `${prefix}Project ${index + 1} of ${list.length}: ${list[index].name}`;
  }

  // Rolls the track up from card `from` to card `from + 1`. Resolves when done.
  function roll(from) {
    const to = from + 1;
    hideCursorLabel();
    pinwheel.turn();
    markCurrent(to);
    if (reduceMotion.matches) {
      track.style.translate = stepOffset(to);
      return Promise.resolve();
    }
    const timing = { duration: WORKS.rollDuration, easing: WORKS.rollEasing };
    const dim = { filter: `brightness(${WORKS.cardDim})`, scale: `${WORKS.cardShrink}` };
    const full = { filter: 'brightness(1)', scale: '1' };
    const moves = [
      track.animate([{ translate: stepOffset(from) }, { translate: stepOffset(to) }], timing),
      track.animate([
        { filter: 'blur(0)', scale: '1 1' },
        { filter: `blur(${WORKS.rollBlur}px)`, scale: `1 ${WORKS.rollStretch}`, offset: WORKS.rollBlurPeak },
        { filter: 'blur(0)', scale: '1 1' },
      ], { duration: WORKS.rollDuration, easing: 'ease-out' }),
      track.children[to].animate([dim, full], timing),
      track.children[from].animate([full, dim], timing),
    ];
    track.style.translate = stepOffset(to);
    return Promise.all(moves.map((move) => move.finished)).then(() => {}, () => {});
  }

  // While rolling, nothing in the reel takes clicks or shows the label.
  function setRolling(on) {
    rolling = on;
    viewport.inert = on;
  }

  async function nextProject() {
    if (rolling) return;
    setRolling(true);
    await roll(index);
    index += 1;
    if (index >= list.length) {
      index = 0;
      render(list, 0); // the copy of the first card -> the real first card, no animation
    }
    announce();
    setRolling(false);
  }

  // Switches to the full list (id = null) or a domain. `animate` = roll the new first
  // card in; otherwise (e.g. from a Landing keyword, off-screen) switch instantly.
  async function showView(id, animate = true) {
    if (rolling) return;
    const leaving = list[index];
    domain = id;
    list = listFor(id);
    index = 0;
    title.textContent = id ? domainTitle(id) : 'Selected Works';
    years.hidden = Boolean(id);
    domainNav.hidden = !id;
    next.classList.toggle('works__button--active', !id);
    sort.classList.toggle('works__button--active', Boolean(id));
    sort.setAttribute('aria-pressed', String(Boolean(id)));
    if (animate) {
      setRolling(true);
      render([leaving, ...list], 0, 0);
      await roll(0);
      render(list, 0);
      setRolling(false);
    } else {
      render(list, 0);
    }
    announce(id ? `${domainTitle(id)}. ` : 'All projects. ');
  }

  function cycleDomain(step) {
    const at = DOMAINS.findIndex((d) => d.id === domain);
    showView(DOMAINS[(at + step + DOMAINS.length) % DOMAINS.length].id);
  }

  next.addEventListener('click', nextProject);
  // Sort by Domain opens the current project's first domain; pressed again, the full list.
  sort.addEventListener('click', () => showView(domain ? null : list[index].domains[0]));
  q('works-domain-prev').addEventListener('click', () => cycleDomain(-1));
  q('works-domain-next').addEventListener('click', () => cycleDomain(1));

  // Landing keywords (data-domain): open that domain; the link itself scrolls to #work.
  document.querySelectorAll('[data-js~="keyword"][data-domain]').forEach((keyword) => {
    keyword.addEventListener('click', () => showView(keyword.dataset.domain, false));
  });

  next.classList.add('works__button--active');
  render(list, 0);

  // Loading: js/reveal.js plays the standard load (column, pinwheel, buttons, cards)
  // once Selected Works has arrived; this promise says when.
  if (reduceMotion.matches) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    function check() {
      if (done) return;
      const top = screen.getBoundingClientRect().top;
      if (1 - top / window.innerHeight >= PUSH.arriveAt) {
        done = true;
        resolve();
      }
    }
    let frame = 0;
    window.addEventListener('scroll', () => {
      if (done || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; check(); });
    }, { passive: true });
    check();
  });
}
