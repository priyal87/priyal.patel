# Priyal Patel — Portfolio

A professional, single-page portfolio built with plain HTML, CSS and JavaScript.
No frameworks, no build step — open it, edit your content, deploy.

![Status](https://img.shields.io/badge/status-ready-34d399) ![Stack](https://img.shields.io/badge/stack-HTML%20%C2%B7%20CSS%20%C2%B7%20JS-6366f1)

## Highlights

- Dark and light themes, remembered in `localStorage` and respecting system preference
- Responsive from 320px phones to wide desktops
- Animated hero, scroll reveals, stat counters and a sticky header with scroll spy
- Project grid with live-site screenshots and direct external links
- Mobile menu with focus management, Escape handling and scroll lock
- Accessibility-minded: skip link, focus-visible styles, ARIA labels, reduced-motion support
- One-page résumé (`resume.html`) and exported PDF (`resume.pdf`)

## Run it

The site is static. Either open `index.html` directly, or serve it locally:

```bash
python -m http.server 5173
# http://127.0.0.1:5173
```

Any static server works — `npx serve`, VS Code Live Server, Laragon, etc.

## Files

```
index.html      Markup for all sections
styles.css      Design tokens, layout, components, themes, responsive rules
script.js       Theme, navigation, scroll effects, form validation
resume.html     Print-ready résumé source (screen and print styles)
resume.pdf      One-page PDF export linked from the About section
assets/projects Project thumbnails (1200×750 JPEG)
```

## Make it yours

### 1. Content

- **Name / brand** — search for `Priyal Patel` and `priyal.patel` in `index.html`, `resume.html` and `script.js` (email links and mailto).
- **Sections** — About, Skills, Projects and Contact are self-contained; duplicate a `.project`, `.skill-card` or `.timeline-item` to add more.
- **Project links** — the four cards link to live sites. Replace their titles, descriptions, tags and `assets/projects/*.jpg` thumbnails as your portfolio grows.
- **Meta / SEO** — update the title, description, Open Graph and Twitter tags at the top of `index.html`.

### 2. Colors and type

All design tokens live at the top of `styles.css`:

```css
[data-theme="dark"] {
  --accent: #6366f1;
  --accent-2: #22d3ee;
  --accent-3: #a855f7;
  --bg: #06080f;
  ...
}
```

Change the accent trio and background values to rebrand the whole site. Fonts are loaded from Google Fonts in the `<head>`; swap `Plus Jakarta Sans` / `JetBrains Mono` if you prefer.

### 3. Résumé

```powershell
& "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" `
  --headless=new --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="resume.pdf" "http://127.0.0.1:5173/resume.html"
```

The print styles are tuned for one A4 page. If you add content, re-check the page count.

## Deploy

Upload the folder as-is to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host. There is nothing to build.

## Notes

- The experience, education and skill copy is realistic placeholder content; replace it with your own history before publishing.
- Browser support targets current Chromium, Firefox and Safari. `prefers-reduced-motion` disables the decorative animation loop.
- Project thumbnails are compressed JPEGs served locally, keeping the page fast without a build step.
