# Motion spec

Source: Carol's notes, Figma Interaction panel, Interactions_Demo.mp4, inspo.mp4.
Status tags: **FIGMA** = read from Figma. **CAROL** = stated by Carol. **PROPOSED** = starting value, not yet approved; put every one in a CSS custom property or a single `js/motion-config.js` so it can be tuned in one place. Never hard-code a timing elsewhere.

## Global
- Flow (linear scroll): 1 Splash -> 2 Hero -> 3 Touchpoints -> 4 Experiences -> 5 Selected Works -> 6 About + footer. Scrolling up goes back one screen.
- Hero eyes are shortcuts: left eye -> 3, right eye -> 4.
- One fixed header on screens 2-6, always on top, themed per screen. The splash has no header.
- Every screen fits the browser: `100svh`, `clamp()`/`vw` sizing, no horizontal overflow. Frames at 1920x1080 are the reference ratio only. Check at 1280, 1440, 1536, 1920 wide. Phones deferred.
- `prefers-reduced-motion: reduce`: no splash sequence (show hero), no headline cycle (static "products."), no ASCII motion (static frame), no spin, instant scroll, carousel unchanged.
- Palette for all effects: burgundy #993746, deep-teal #0B2F32, bronze #9F723C.

## 1. Splash (1:487)
CAROL sequence:
1. One logo cross appears at centre. It duplicates and sweeps right to a second position (2 crosses side by side).
2. The pair duplicates and sweeps up (4 crosses, a 2x2 group).
3. The central logo (the square with the four corner crosses, 199x198.5 design px) is created.
4. The whole logo spins once (360deg), expands outwards, and dissolves into the hero.
Notes: in the old video the crosses only dissolved in; Carol wants the duplicate-and-sweep instead. Build with SVG + CSS/JS transforms.
Durations: PROPOSED total about 3.2 s: duplicate-sweep 0.6 s each (x2), logo creation 0.5 s, spin 0.8 s, expand+dissolve 0.7 s. Easing: ease-out for sweeps, ease-in-out for the spin.
Plays once per page load. Skippable by click or key. Hero is in the DOM underneath and is revealed by the dissolve.

## 2. Hero (1:237)
Headline (FIGMA): cycles "products." -> "services." -> "experiences." -> loops. After delay 1600 ms, Change to, Smart animate, Ease out, 300 ms. Crossfade only the highlighted word, keep the bronze block, let its width animate to the new word. Pause the cycle when the tab is hidden. Screen readers get the static text "I design products, services and experiences." via a visually hidden element; the animated word is `aria-hidden`.
Eyes (CAROL):
- Pupils follow the cursor, clamped inside the eye. Smooth follow with a short lag (PROPOSED 120 ms).
- When the cursor enters an eye, that eye's pupil turns into the burgundy cross (#993746), as in the demo. Cursor becomes a pointer.
- A small label "Click to Explore" appears next to the cursor while inside the eye: black background, white text, small (PROPOSED 12 px at 1920 wide, scaled with clamp), padding 4px 8px, follows the cursor with a slight offset, fades in 150 ms. Hidden on touch devices and reduced motion keeps it static near the eye.
- Click or Enter/Space on the eye: left -> #touchpoints, right -> #experiences.
- Keyboard focus shows the cross state and a visible focus ring; the label is replaced by an accessible name ("Explore touchpoints" / "Explore experiences").

## 3. Touchpoints (1:251)
Entered by left-eye click or scroll from hero. Scroll is smooth.
CAROL: the smaller squares flow along the lines from the base square into their respective squares (dots travel along the existing paths). Loop gently while the screen is in view; stop when it leaves view.
ASCII on squares: each square shows an ASCII effect (see "ASCII effect" below), moving in the same direction as the dots, outward from the central (base) square.

## 4. Experiences (1:302)
Entered by right-eye click or scroll from screen 3.
CAROL: the same ASCII effect runs across the people silhouettes only: pink (1:311), blue (1:313), brown (1:314). Forget the gradients: the silhouettes are flat shapes filled by the effect. Glyphs travel outward along the same direction as the Touchpoints flow.
ASSUMPTION to confirm by eye: pink figure glyphs in burgundy, brown figure in bronze, blue figure in deep-teal lightened is not available in the palette, so use deep-teal glyphs on a dim bronze-tinted ground and check contrast against the photo. If unreadable, fall back to pale teal #A5C4C7 for the blue figure only.

## ASCII effect (shared, from inspo.mp4)
- Grid of cells (reference: about 28 columns across a circle). Cell size scales with the shape being filled.
- Glyph set: filled circle, diamond, small 4-point star, empty outline circle (for "off" cells). Draw on a `<canvas>` clipped to the target shape (SVG mask or canvas clip path), not as DOM text.
- Colours: burgundy #993746, deep-teal #0B2F32, bronze #9F723C. Pick per cell randomly from the palette, weighted so the fill reads as the shape's own hue. Keep contrast against each background; tune by eye.
- Motion: a band sweeps across the shape. Ahead of the band cells are empty outlines, inside the band cells are dense filled circles, behind the band cells thin out into diamonds then stars, then empty again. Reference cycle about 5 s per pass (PROPOSED 5 s).
- Direction: outward from the central square along the dot paths (Touchpoints) and outward from the same origin across the figures (Experiences).
- Frame rate: cap at 30 fps; pause when off-screen (IntersectionObserver) and when the tab is hidden. Reduced motion: draw one static frame.

## 5. Selected Works (1:318)
- Loading animation (CAROL: simple): cards fade up 16 px, stagger 80 ms, 400 ms ease-out, once, when the screen enters view.
- Horizontal carousel of cards (533x489 design px, 41 px gap). Duplicate the three-project set once so there are six cards for now.
- Side arrow on the right edge prompts horizontal exploration. Clicking it scrolls to the next set. After the first set it flips to a left arrow (CAROL), and flips back at the start. Arrow is a real button with an accessible name ("Next projects" / "Previous projects").
- Cards snap into place: `scroll-snap-type: x mandatory` on the carousel only, `scroll-snap-align: start`. No drag-to-scroll (CAROL). Trackpad swipe, shift+wheel, arrow buttons and keyboard (Tab to cards, arrow keys) still work.
- Cards link to project detail pages. Pages are placeholders for now: link to `#` with `aria-disabled` until real pages exist (CAROL).
- Hover on a card: PROPOSED lift 4 px, 200 ms ease-out.

## 6. About + footer (1:369)
- Loading animation: same as Selected Works (fade up, stagger), once.
- Photo reveal (FIGMA): the weave pattern (Component 5, 1:379) hides the photo "Pic4 1" (1:370, hidden layer). Mouse enter on the weave: change to Pic4 1, Dissolve, Ease out, 300 ms. Mouse leave: change back, Instant. Keyboard: weave is focusable and focus shows the photo too. Touch: tap toggles.
- "Learn More >" goes to a placeholder page (CAROL).
- Footer cross (the large pale-teal cross on the left): spins one full turn every 25 s (CAROL). Spin duration PROPOSED 1.2 s, ease-in-out. Starts the first spin 25 s after the footer first enters view, only runs while the footer is in view, none under reduced motion.

## Still unknown (do not invent)
- Real project detail and Learn More pages.
- Final glyph/colour contrast on the street photo.
- Exact splash timings (PROPOSED values above) and hero label size: review in browser, then lock.