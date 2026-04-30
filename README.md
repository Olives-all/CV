# Hanall Sung Academic Website

This is a first working version of a CV-driven academic researcher website. The Word CV is the source of truth; the site data is regenerated from the `.docx` file and rendered as a static HTML/CSS/JavaScript site.

Repository target: `https://github.com/HanallSung-git/CV`

GitHub Pages target: publish from the `docs/` folder on the `main` branch.

## Update Workflow

1. Edit `CV_Hanall Sung_with Index.docx`.
2. Regenerate the site data:

   ```bash
   python3 scripts/update_site_from_cv.py
   ```

3. Open `docs/index.html` in a browser and review the updated page.

## Project Structure

- `scripts/update_site_from_cv.py` parses the Word CV into structured data.
- `docs/data/cv.json` is the generated structured CV data.
- `docs/assets/cv-data.js` exposes the generated data to the browser.
- `docs/index.html`, `docs/assets/styles.css`, and `docs/assets/app.js` render the static researcher website.
- `docs/assets/CV_Hanall_Sung_CV.pdf` is the public downloadable CV.

## Current Scope

The site includes overview, publications, grants, research experience, teaching, advising, service, affiliations, honors, methods/software skills, language, and certification sections.
