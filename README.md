# Carol Elizabeth: portfolio

Portfolio site for Carol Elizabeth, Service and UX Designer.
Live at https://carolelizabeth.netlify.app/

Hand-built with plain HTML, CSS and JavaScript: no framework, no build step.
Netlify deploys automatically when a branch is merged.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The layout is built for a 1920px-wide desktop window.

## Folders

| Path | What's in it |
|---|---|
| `index.html` | The whole page: splash, hero, two scenes, Selected Works, About and the Contact footer |
| `css/tokens.css` | Every colour, font size and spacing value, as CSS variables |
| `css/*.css` | One file per screen (`splash`, `header`, `hero`, `scene`, `works`, `about`, `contact`) plus `base` and `fonts` |
| `js/main.js` | JavaScript entry point (empty until the splash and interaction phases) |
| `assets/fonts/` | IBM Plex Sans, self-hosted (Open Font License) |
| `assets/placeholders/` | Grey stand-ins for images not yet exported; delete once real assets are in |
| `design/` | Reference only: `tokens.md`, `copy.md`, and the screen PNGs (kept out of git) |

## Swapping in a real asset

Export the file to the path named in its `PLACEHOLDER` comment in `index.html`
(for example `assets/images/eye.svg`), then change that `<img>`'s `src` to the new path.
