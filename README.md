# dev-prakash-jha.github.io

Academic website for Dev Prakash Jha — PhD Research Scholar, Department of Mathematics, IIST.

## Structure
```
dev-prakash-jha.github.io/
├── index.html
├── css/
│   ├── style.css        # main theme (layout, typography, components)
│   └── responsive.css   # mobile / small-screen overrides
├── js/
│   └── main.js          # mobile nav toggle, scroll-spy, tab switching
├── images/
│   ├── profile.jpg
│   └── gallery/         # empty — drop conference/talk photos here
├── assets/
│   ├── cv.pdf
│   └── publications.bib
└── README.md
```

## Publish on GitHub Pages

1. Create a repo named exactly `dev-prakash-jha.github.io` under your GitHub account (this exact name gives you a root URL, `https://dev-prakash-jha.github.io`).
2. Upload everything in this folder, **keeping the folder structure** (drag the whole unzipped folder's contents in via **Add file → Upload files**, or use git):
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/dev-prakash-jha/dev-prakash-jha.github.io.git
   git push -u origin main
   ```
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save.**
4. Live in ~1 minute at `https://dev-prakash-jha.github.io`.

## Updating later
- New publication → add a `<div class="pub">` block in `index.html` and a matching entry in `assets/publications.bib`.
- New award/project → add a `<div class="achv-card">` / `<div class="proj">` block.
- Conference photos → drop into `images/gallery/` and reference them from `index.html`.

No build step — it's static HTML/CSS/JS, so any edit is live as soon as it's pushed.
