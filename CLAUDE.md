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

## Responsive
- Desktop only for now. Build to the 1920x1080 reference frames (About is 1920x1549). Do NOT build tablet or mobile layouts yet.
- Even so, use rem units, flexbox and grid instead of absolute pixel positions where practical, so responsive work can be added later without a rewrite. No horizontal scrolling at 1920px width.
- Responsive and mobile layouts will be a separate phase, started only when Carol asks.

## Accessibility and performance
- Every animation respects prefers-reduced-motion (show the end state instead).
- Visible focus styles, full keyboard navigation, alt text on every image, text contrast checked, skip-to-content link, aria-current on the active nav item.
- The splash must be skippable and must not delay content for long.
- Images as WebP, sized to their layout, lazy-loaded below the fold. Logo and icons as SVG.
- File and folder names: lowercase with hyphens (hosting is case-sensitive).
- Add unique <title>, meta description, favicon, Open Graph tags, lang="en" and the viewport meta tag.

## Git rules
- Never work on main. One branch per phase: phase-1-static, phase-2-responsive, phase-3-splash, phase-4-interactions, phase-5-polish.
- Small commits with clear messages. Commit after every working section.
- Push branches to origin only. Open a pull request per phase describing what changed and what is untested. Carol merges.
- The repo has existing history from an earlier version. Keep it. Overwrite files by committing new versions on a branch. Never force push, rebase pushed commits, or run reset --hard.
- Never commit secrets, personal documents or phone numbers.

## Deployment
Netlify deploys automatically from the production branch when Carol merges. Never use the Netlify CLI or dashboard. Do not run netlify init or netlify deploy, and never create a new site or domain.

## Old files
The folder may still contain the old index.html, style.css and javascript.js. Replace index.html, move styling into css/ and scripts into js/, then remove the old files with git rm once nothing references them.

## Phases
0. Setup: folder structure, tokens as CSS variables, font loading.
1. Static desktop build of all six screens, no animation.
2. Responsive mobile and tablet, after Carol approves mobile-rules.md.
3. Splash timing, skip, and handoff to the hero.
4. Interactions from motion.md.
5. Polish: accessibility, performance, meta tags, 404 page.

## Definition of done (every phase)
1. Opens locally with no console errors.
2. Matches the PNGs (design/screens/01-splash.png to 06-about-contacts.png, 4x exports) at 1920px.
3. Keyboard and reduced-motion checks pass.
4. A short note listing what was built, any differences from the design and why, and open questions.

## Commands
Preview locally with: python3 -m http.server 8000 (then open http://localhost:8000)