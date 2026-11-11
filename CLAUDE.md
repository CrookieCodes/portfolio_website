# Carol Elizabeth Thomas: portfolio website

## Project
A hand-built static portfolio for a Service and UX Designer: splash screen, landing page
(hero scenes), Selected Works, About, Contact. Live at https://carolelizabeth.netlify.app/
Design source of truth, read these before building anything:
- /design/screens/*.png (6 desktop screens, in order 01 to 06)
- /design/tokens.md (colours, type, spacing)
- /design/copy.md (all final text, link targets, alt text)
- /design/motion.md (interactions; may not exist yet)

## Roles
Claude writes ALL the HTML, CSS and JS. Carol reviews, runs, and merges.
After each phase, add a short plain-language note explaining the main choices so Carol can learn from the code.

## Stack
- Vanilla HTML, CSS and JavaScript only. No frameworks, no build step, no npm packages unless Carol asks.
- Static site, served from the repo root. Entry point: index.html.
- Structure: index.html, css/, js/, assets/ (images, fonts, icons), design/ (reference only; never shipped as pages).

## Design tokens
- Burgundy #993746 (About section, accents)
- Deep teal #0B2F32 (splash, hero, footer)
- Bronze #9F723C (highlight on "products", eyes, accents)
- Pale teal, pink, mint green, light grey: NOT yet confirmed. Read exact values from /design/tokens.md. If missing, ask Carol. Never eyeball colours from the PNGs.
- Define every token as a CSS custom property on :root. No hard-coded colours elsewhere.

## Typography
- Headings and body: "Helvetica Neue", Helvetica, Arial, sans-serif. Helvetica Neue is a commercial font, so do not self-host it unless Carol supplies a licensed web font.
- Secondary text: IBM Plex Sans, self-hosted as WOFF2 in assets/fonts with font-display: swap.
- Match the weights in the design (light and regular for headings). Use rem units and a type scale defined as variables.

## Code conventions
- Semantic HTML: header, nav, main, section, article, footer. One h1 per page, headings in order. Use button for actions and a for links.
- CSS: BEM class names (block__element--modifier), single-class selectors, no IDs for styling, no !important. Mobile-first with breakpoints at 600px and 1024px.
- JS: ES modules in js/. Select elements with data-js attributes, never styling classes. Toggle state with classes. Read colours and timings from CSS variables where possible. Keep each file small and commented.
- Do not invent copy, colours, images or links. If something is missing or unclear, list the question and wait for Carol.

## Sizing (replaces "desktop only at 1920px")
- Every screen must fit any desktop browser window without overflow. Frames are 1920x1080 as a reference only.
- Use `100svh` (fallback `100vh`) for full-screen scenes, `clamp()`, `rem` and `vw` for sizes, max-width containers, and SVG `viewBox` scaling for illustrations.
- No horizontal page scroll at any width from 1024 to 2560. Test at 1280, 1440, 1536, 1920. Phones are still deferred.
- The header is fixed on screens 2 to 6 and always on top (z-index above all scenes).

## Motion
- All motion values come from design/motion.md. PROPOSED values go into CSS custom properties or js/motion-config.js, never hard-coded. Do not invent any timing that is not in motion.md.
- Honour prefers-reduced-motion everywhere. Pause animation when off-screen or tab hidden.

## Accessibility and performance
- Every animation respects prefers-reduced-motion (show the end state instead).
- Visible focus styles, full keyboard navigation, alt text on every image, text contrast checked, skip-to-content link, aria-current on the active nav item.
- The splash must be skippable and must not delay content for long.
- Images as WebP, sized to their layout, lazy-loaded below the fold. Logo and icons as SVG.
- File and folder names: lowercase with hyphens (hosting is case-sensitive).
- Add unique <title>, meta description, favicon, Open Graph tags, lang="en" and the viewport meta tag.

## Git rules
- Never work on main. One branch per phase: phase-1-static, phase-2-navigation, phase-3-splash-hero, phase-4-eyes, phase-5-transitions, phase-6-polish.
- Small commits with clear messages. Commit after every working section.
- Push branches to origin only. Open a pull request per phase describing what changed and what is untested. Carol merges.
- The repo has existing history from an earlier version. Keep it. Overwrite files by committing new versions on a branch. Never force push, rebase pushed commits, or run reset --hard.
- Never commit secrets, personal documents or phone numbers.

## Deployment
Netlify deploys automatically from the production branch when Carol merges. Never use the Netlify CLI or dashboard. Do not run netlify init or netlify deploy, and never create a new site or domain.

## Old files
The folder may still contain the old index.html, style.css and javascript.js. Replace index.html, move styling into css/ and scripts into js/, then remove the old files with git rm once nothing references them.

## Phases
0-1 setup and static pages (done)
2 header and navigation (done)
3 splash and hero: splash sequence, headline cycle, pupil tracking, hover cross, Click to Explore label, eye navigation
4 touchpoints and experiences: dot flow, shared ASCII canvas effect on squares and silhouettes
5 selected works carousel (6 cards, snap, flipping arrow) and About (loading animation, weave hover reveal, placeholder Learn More), footer cross spin
6 fit-to-browser pass, polish, cross-browser, accessibility; merge to main only after Carol approves

## Navigation and scroll
- Screen order is linear: 1 Splash, 2 Landing, 3 Touchpoints, 4 Experiences, 5 Selected Works, 6 About + footer. Scrolling down goes 2 -> 3 -> 4 -> 5 -> 6; scrolling up goes back. Transitions are scroll-tied (see design/motion.md): blinds from 2 to 3, push-in slides from 3 to 4 and 4 to 5.
- The Landing keywords (Products, Services, Experiences) are links to Selected Works in the matching domain view. The eyes are decorative (pupils follow the cursor).
- One fixed header on screens 2-6 (not the splash), the same markup everywhere. Logo colour, nav colour and the active link change with the screen in view. Set with IntersectionObserver as a data-theme on the header.
- Smooth scrolling (scroll-behavior: smooth). No CSS scroll snapping on screens 2 to 5: their transitions are scrubbed by the scroll and snapping pulled slow mouse-wheel scrolling back (Carol, phase 6). If snapping is added anywhere else, only proximity, never mandatory. Never hijack the scroll wheel. With prefers-reduced-motion, use instant scrolling and no snapping.
- An optional settle (SETTLE.enabled in js/motion-config.js) may finish a part-played transition after 200 ms without input. It must never block, delay or capture input, and any wheel, touch, key or scrollbar input cancels it immediately. It is off unless Carol turns it on. This is not a scroll lock.
- Screens 3 and 4 get addresses (#touchpoints, #experiences) so the Back button works. Pinned (sticky) screens never move, so their address may sit on an anchor element instead (#touchpoints).
- Do not invent animation timings. Use only values in motion.md. Where it says TODO, build the structure without the animation and list what is missing.

## Definition of done (every phase)
1. Opens locally with no console errors.
2. Matches the PNGs (design/screens/01-splash.png to 06-about-contacts.png, 4x exports) at 1920px.
3. Keyboard and reduced-motion checks pass.
4. A short note listing what was built, any differences from the design and why, and open questions.

## Commands
Preview locally with: python3 -m http.server 8000 (then open http://localhost:8000)