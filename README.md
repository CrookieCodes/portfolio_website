# Carol Elizabeth: portfolio

Portfolio site for Carol Elizabeth, Service and UX Designer.
Live at https://carolelizabeth.netlify.app/

Hand-built with plain HTML, CSS and JavaScript: no framework, no build step.
Netlify deploys automatically when a branch is merged.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The designs are 1920x1080 frames; the splash, hero and
header scale to any desktop window (the other screens follow in Phase 6).

To watch the splash again, reload the page without a `#...` address. It is skipped when
the page opens at an address (e.g. `#work`) or when the system asks for reduced motion.

## Folders

| Path | What's in it |
|---|---|
| `index.html` | The whole page: splash, hero, two scenes, Selected Works, About and the Contact footer |
| `css/tokens.css` | Every colour, font size and spacing value, as CSS variables |
| `css/*.css` | One file per screen (`splash`, `header`, `hero`, `scene`, `works`, `about`, `contact`) plus `base` and `fonts` |
| `js/main.js` | JavaScript entry point: starts each feature below |
| `js/motion-config.js` | Every animation timing and easing, in one place (tune values here) |
| `js/splash.js` | Splash sequence: crosses sweep, logo spins, dissolves into the hero |
| `js/headline.js` | Hero headline cycle: products, services, experiences |
| `js/eye-tracking.js`, `js/eye-cross.js`, `js/eye-label.js` | Hero eyes: pupils follow the mouse, cross on hover/focus, "Click to Explore" label |
| `js/eye-buttons.js`, `js/header-theme.js` | Eye shortcuts to screens 3 and 4; header colours per screen |
| `assets/fonts/` | IBM Plex Sans, self-hosted (Open Font License) |
| `assets/icons/` | Logo crosses (one per screen colour), splash graphic, link arrow (SVG) |
| `assets/images/` | Illustrations (SVG) and photos (WebP, 2x layout size) |
| `assets/logos/` | IIT Delhi and Department of Design logos (transparent WebP) |
| `design/` | Reference only: `tokens.md`, `copy.md`, `motion.md`, and the screen PNGs (kept out of git) |

## Updating an asset

Assets come from the Figma file "WEBSITE-DEV-to-CLAUDE" (node ids in `design/tokens.md`).
SVGs are exported without the frame background so they stay transparent. Photos are
exported at 2x and converted to WebP. Keep the same filename and the page picks it up.
