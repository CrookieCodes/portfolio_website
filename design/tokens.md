# Design tokens

Source: Figma file "WEBSITE-DEV-to-CLAUDE" (key aG0PPre8bqx95SER6BXyaz), page "Landing Page".
Values below were read from the frames' styles, not estimated. Frames are **1920 x 1080** (About is 1920 x 1549).
Figma has no variables or animation timelines, so these are raw values. Define each as a CSS custom property.

## Frames (node ids, in page order)
| Order | Name | Node id | Size | Background |
|---|---|---|---|---|
| 1 | Splash Screen | 1:487 | 1920x1080 | #0B2F32 |
| 2 | Landing Page (hero) | 1:237 | 1920x1080 | #0B2F32 |
| 3 | Service designer (touchpoints scene) | 1:251 | 1920x1080 | #0B2F32 |
| 4 | UX designer (experiences scene) | 1:302 | 1920x1080 | #9F723C, photo covers it |
| 5 | Selected Works | 1:318 | 1920x1080 | #E4E4E4 |
| 6 | About Moi (+ Contact footer) | 1:369 | 1920x1549 | #993746, footer #0B2F32 |

## Colours
| Token | Hex | Used for |
|---|---|---|
| --color-teal | #0B2F32 | Splash, hero, scenes, contact footer, tag fill (Nest) |
| --color-burgundy | #993746 | About background, tag fill (Aangan, Petting Zoo) |
| --color-bronze | #9F723C | "products." highlight, eyes, scene 4 base |
| --color-mint | #A9DAAF | "Carol," and the Learn More button |
| --color-paper | #E4E4E4 | Selected Works page background |
| --color-card | #D0CECA | Project card body |
| --color-ink | #1A1A1A | Nav and headings on light pages |
| --color-ink-card | #24292B | Card titles |
| --color-button-text | #1C1C1C | Learn More label |
| --color-white | #FFFFFF | Nav and hero text on dark |
| --color-off-white | #EFEFEF | About heading |
| --color-tan | #DBBE9B | About body text |
| --color-link | #D7D7D7 | Contact links |
| --color-gold-muted | #AF997E | "Let's Build something good." |
| --color-footer-text | #9BAFB1 | Footer small text, tag line |
| --color-list | #B5BCBD | Bullet lists in the scene frames |
| pale teal, pink, scene gradients | READ FROM SVG | Fills are inside the exported SVGs (logo cross, large footer cross, weave pattern, touchpoint squares). Keep them in the SVG files, do not re-draw in CSS. |

The logo cross changes colour by section: burgundy on hero, pale teal on the touchpoints scene, bronze on the street scene, dark teal on Selected Works, tan on About. Each has its own exported SVG.

## Type
Fonts: Helvetica Neue (Thin, Light, Regular, Medium, Bold, Heavy) and IBM Plex Sans (Light, Light Italic, Regular, SemiBold, Bold).
Helvetica Neue is commercial and ships only on Apple devices; the Thin, Light and Medium weights will NOT render on Linux, Windows or Android with a fallback font. Decide: licence a web font, or accept a visibly heavier fallback.

| Role | Font and weight | Size / line height | Letter-spacing |
|---|---|---|---|
| Nav | Helvetica Neue Regular (active: Heavy) | 26px / 29.7px | -0.26px |
| Hero line 1 | IBM Plex Sans Light | 55.7px / 50.8px | -1.67px |
| Hero line 2 | Helvetica Neue Medium | 89.1px / 91.9px | -2.67px |
| Scene line 1 ("From assembling", "To crafting stories,") | Helvetica Neue Light | 48px / 60px | -0.96px |
| Scene line 2 ("touchpoints,", "experiences.") | Helvetica Neue Medium | 64px / 60px | -0.96px |
| Scene bullet lists | Helvetica Neue Light | 28.4px / 50.2px | -0.57px |
| Section overline "2024 - 2026" | IBM Plex Sans Light Italic | 40px / 60px | -0.8px |
| Section title | Helvetica Neue Medium | 54px / 60px | -1.08px |
| Card title | Helvetica Neue Bold | 30px / 36px | -0.6px |
| Card subtitle | Helvetica Neue Light | 23px / 28px | -0.23px |
| Tag | Helvetica Neue Regular | 14.8px / 18.5px | -0.3px |
| About heading | Helvetica Neue Medium | 96px / 99px | -1.92px |
| About body | IBM Plex Sans Regular (bold phrases: Bold, white) | 30px / 48px | -0.3px |
| Learn More | IBM Plex Sans SemiBold | 28px / 33px | -0.28px |
| Footer tag line | Helvetica Neue Light, uppercase | 20px / 24px | -0.2px |
| Footer heading | Helvetica Neue Thin | 90px / 94px | -1.8px |
| Contact links | IBM Plex Sans SemiBold, underlined, with arrow icon | 24px / 24px | none |
| Copyright, location | Helvetica Neue Light | 20px / 24px | -0.2px |

## Layout and spacing (design px at 1920 width)
- Header: 1680px wide, centred (120px side margins), top 67px, logo 61x61, nav items spaced 76px apart.
- Selected Works: overline at y 206, title at y 272, divider line at y 347 (1681px wide, thin), cards at y 387.
- Cards: 533 x 489, gap 41px, three across. Image area 533 x 300 with 24px top corners. Body area 242px, #D0CECA, 24px radius.
- Card body: title at 41px from left, subtitle below, institution logos at 62% opacity, tags bottom-right.
- Tags: height 32px, 3.7px radius, text 14.8px white.
- About: content block starts x 243, y 314. Weave image 404 x 561, gap 98px, text column 931px, 53px between heading, paragraphs and button.
- Learn More button: 207 x 68, 8px radius.
- Contact footer: starts at y 1080, 469px tall, #0B2F32. Large cross bleeds off the left edge (576 x 537, starts x -104). Text column starts x 600.
- Splash: logo mark 199 x 198.5 centred.

## Motion
Figma has no animation timelines in this file. See motion.md (to be written from the screen recording and Carol's notes).