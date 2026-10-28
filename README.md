# Dev Prakash Jha — Academic Research Website

Personal academic website (control theory × neural dynamical systems theme) for Dev Prakash Jha, PhD Research Scholar in the Department of Mathematics at the Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram, India.

## Website

This repository is named `dev-prakash-jha.github.io` under the GitHub account `DJha8851`. Unless the repository is renamed to `DJha8851.github.io`, the expected project-site address is:

`https://djha8851.github.io/dev-prakash-jha.github.io/`

## Repository structure

```text
index.html
css/
  style.css
  responsive.css
js/
  main.js
images/
  profile.jpg
  gallery/
assets/
  cv.pdf
  publications.bib
README.md
```

## Publish with GitHub Pages

1. Open **Settings → Pages** for this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then save.
4. Wait for the deployment to complete. The live address should be the project-site URL shown above.

## Updating the site

- Replace `assets/cv.pdf` when updating your CV.
- Edit `index.html` to update biography, research interests, publications, and project descriptions.
- Keep the `css`, `js`, `images`, and `assets` folder structure unchanged.
- Update submission statuses when editorial decisions change. Do not describe a manuscript as under review after a decision has been issued.
- The publication records in `assets/publications.bib` should be checked against official publisher pages before formal reuse.

## Design notes

- `js/main.js` draws two canvases: a faint feed-forward neural network with signal pulses (page background) and an interactive closed-loop phase portrait in the hero (`x' = (A − BK)(x − x*)`; the target follows the cursor).
- Both animations pause/disable under `prefers-reduced-motion`.
- Publications can be filtered by theme via `data-theme` (`pde`, `neural`, `frac`) on each `.pub` item.
