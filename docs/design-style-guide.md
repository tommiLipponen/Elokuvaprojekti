# Design Style Guide (Colors, Fonts, Spacing)

A short, practical guide for picking colors/fonts/spacing when you haven't
done visual design before. Written for this project specifically: we use
**Bootstrap** (see ADO task 217/228), so the goal is to choose a *theme*,
not to invent a custom design system from scratch.

## Guiding principle: low-risk, no renaming

Bootstrap already ships a full color system, font stack, spacing scale and
components (buttons, forms, cards, grid). The simple/low-risk approach is:

1. Keep every existing component, file and function name exactly as-is.
2. Only add/change two things:
   - `className="..."` attributes on existing JSX elements (swap plain
     `<button>`/`<div>` for the same element with Bootstrap classes).
   - A handful of CSS variable overrides in **one file** to re-color
     Bootstrap's defaults (no new build tooling, no SASS required).
3. Do this **one page at a time** (e.g. start with `FavoriteListPage.jsx`,
   per ADO 228), verify it still works, then move to the next page.

This avoids the riskier alternative (a custom design system, renamed
components, a new CSS framework) which would touch far more files and be
much easier to break right before a deadline.

## 1. Colors

### Don't invent a palette — pick a Bootstrap theme color and go

Bootstrap already defines semantic colors you should reuse instead of
making up new ones:

- `primary` — main brand color. Nav bar, primary buttons (Login, Save).
- `secondary` — neutral/less important. Cancel buttons, secondary links.
- `success` — positive action/state. "Added to favorites", success alerts.
- `danger` — destructive action. "Delete list", "Remove movie".
- `warning` — caution. Validation warnings.
- `info` — informational. Tooltips, hints.
- `light` / `dark` — backgrounds/text. Page backgrounds, footer.

Usage is just a class name, no new component needed:

```jsx
<button className="btn btn-primary">Log in</button>
<button className="btn btn-danger">Delete list</button>
```

### Picking your 5-6 colors (as required by the assignment)

Bootstrap's semantic slots already give you exactly that many colors to
define on purpose, instead of inventing a separate palette:

1. `primary` — your main brand color (used the most: nav bar, main buttons).
2. `secondary` — a neutral companion color (muted/grey-ish, less attention).
3. `success` — green-leaning, for positive actions ("Added to favorites").
4. `danger` — red-leaning, for destructive actions ("Delete list").
5. `warning` — amber/yellow-leaning, for caution states.
6. `info` (or treat `light`/`dark` as your 6th) — an accent color for
   informational bits (tooltips, badges) or backgrounds.

That's your 5-6 colors, each with a clear, documented purpose — map them
to actual hex values below rather than leaving all of them as Bootstrap
defaults. For a movie app, deep blue/purple/near-black for `primary`,
with warm amber or red accents, reads as "cinematic".

Check contrast before finalizing: paste each color + the text color you'll
put on it into [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
and make sure body text hits at least **AA** (4.5:1 for normal text).

### How to apply the colors (one file, no renaming)

Override Bootstrap's CSS variables in `frontend/src/index.css` (already
imported once from `main.jsx`, per ADO 217):

```css
:root {
  --bs-primary: #1b2a4a;       /* main brand color */
  --bs-primary-rgb: 27, 42, 74;
  --bs-secondary: #6c757d;     /* neutral companion color */
  --bs-success: #2e7d32;
  --bs-danger: #c62828;
  --bs-warning: #f9a825;
  --bs-info: #0288d1;
  --bs-link-color: var(--bs-primary);
}
```

That's it — every `btn-primary`, `text-primary`, `bg-primary`,
`btn-secondary`, `btn-success`, etc. across the whole app updates
automatically. No component edits required.

## 2. Fonts

### Pick 3 fonts, each with one job (as required by the assignment)

1. **Heading font** — for `h1`-`h6`. Can be bolder/more distinctive since
   it's used in short bursts (titles, section headers).
2. **Body font** — for paragraphs, lists, form labels. Must be simple and
   easy to read in longer blocks of text.
3. **Accent font** — used sparingly for a specific purpose: logo/brand
   wordmark, hero tagline, or button labels. Not used for body copy.

Don't pick 3 fonts that all look similar — pick 3 that are clearly
different *roles*, but still feel like they belong together (similar mood/era).

A safe, free source: [Google Fonts](https://fonts.google.com/). Picking
fonts described as "readable" or with high usage counts is a reasonable
beginner heuristic, since it means lots of other sites already validated
them for screens.

### How to apply the font choice (one file, no renaming)

1. Add `<link>` tags for all 3 fonts in `frontend/index.html`'s `<head>`
   (Google Fonts gives you this snippet when you select a font + weights).
2. Set them once in `frontend/src/index.css`:

```css
body {
  font-family: "Inter", var(--bs-body-font-family);
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Poppins", var(--bs-body-font-family);
}

.navbar-brand, .hero-tagline, .btn {
  font-family: "Bebas Neue", var(--bs-body-font-family);
}
```

Again — zero component changes. Every existing `<h1>`/`<p>`/text in the
app picks this up automatically through the cascade; the accent font only
applies to the specific classes you choose (e.g. an existing `.navbar-brand`
class, or `.btn` for all Bootstrap buttons).

## 3. Spacing & layout

Don't invent your own spacing units — Bootstrap's spacing utility classes
(`m-*`, `p-*`, `gap-*`, on a 0–5 scale) and grid (`container`, `row`,
`col`) cover almost everything. Add classes to existing elements as you
touch each page:

```jsx
<div className="d-flex align-items-center gap-2">
  <h2 className="mb-0">{list.name}</h2>
  <button className="btn btn-sm btn-outline-primary">Share</button>
</div>
```

## 4. Suggested rollout order

1. Add Bootstrap once (`npm install bootstrap`, import its CSS from
   `main.jsx` — ADO 217).
2. Set your 5-6 color overrides + 3 font choices in `index.css`
   (sections 1-2 above). This alone changes the whole app's look.
3. Restyle one page at a time with Bootstrap classes, starting with
   `FavoriteListPage.jsx` (ADO 228), then the rest — purely additive
   `className` changes, nothing to rename.
4. Re-check contrast/readability after your color overrides land (step 2
   can make default-colored text/buttons harder to read if a color is
   very light or very dark).

## Our choices (team decisions)

### Colors

The project uses a dark teal base with warm orange and turquoise accents. These colors are used consistently across the Bootstrap theme and Figma design.

- `primary`: #0F3435
- `secondary`: #071a1c
- `success`: #30D97F
- `danger`: #FFB566 
- `warning`: #FFA4A4
- `info`: #2FDAD7

- `app-bg` : #0F3435
- `app-surface` : #071a1c
- `app-text` : #F5F1E8
- `app-accent-turquoise` : #2FDAD7
- `app-accent-orange` : #FAB375
- `app-button-orange` : #8A3719


Colors used throughout the interface:

#0F3435 — primary dark page/background color.
#F5F1E8 — main text/light surface color; also used at 10% opacity for selected/light surfaces.

Color usage rules

#2FDAD7 and #FAB375 are used primarily as text/accent colors on #0F3435 and #071a1c.
#8A3719 is used as the primary button/action background with #F5F1E8 as button text.
#F5F1E8 is used as the main text color and at 10% opacity for light/selected surfaces.
#0F3435 is the primary application/page background.
#071a1c is used for darker secondary surfaces.

Colors should be applied through Bootstrap semantic classes where appropriate, and through the project's CSS variables for project-specific colors. Avoid hard-coding colors repeatedly in components.

### Font roles

- Heading font: Roboto Condensed
   - Used for h1–h6
   - Heading 1: Weight: 700 (Bold), 32px / 5px letter spacing
   - Heading 2: Weight: 300 (Light), 32px / 5px letter spacing
- Body font: Mukta Vaani
   - Used for paragraphs, lists, labels and general UI text
   - Body: Weight: 300 (Light), 16px / 5px letter spacing
- Accent font: Cousine
   - Used for button labels, logo/brand elements and selected accent UI
   - Accent 1: Weight: 700 (Bold), 24px / 10px letter spacing
   - Accent 2: Weight: 700 (Bold), 16px / 10px letter spacing
