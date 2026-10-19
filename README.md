# Figbridge

Miranda’s personal home notebook: colorful room directions, a small-project tracker, and an evening planner. Original artwork, browser-local notebook storage, and JSON import/export are included.

- Source repository: https://github.com/mirandaheydt/figbridge
- Hosted site: https://figbridge.vercel.app
- Access: Vercel Authentication is enabled for all deployments.

The site is deployed on Vercel. Import into v0 is not yet confirmed; its API returned server errors. This repository can be imported into v0 without recreating the design.

## Run and build

This is a dependency-free Node.js project. Use Node.js 22 or newer.

- `npm run dev`: start the site on port 3000, or `PORT` when provided by the environment.
- `npm run build`: copy `site/` to the deployable `dist/` directory.

v0 supports generic Node.js projects. Import this project into a private v0 chat and use its Vercel publishing workflow. Preserve the source rather than regenerating the design. `vercel.json` sets the framework to Other, builds with `npm run build`, and serves `dist/`.

## Source

- `site/index.html`: page content, dialogs, and forms.
- `site/styles.css`: responsive design and local fonts.
- `site/app.js`: interactions and localStorage.
- `site/model.mjs`: starter ideas, notebook validation, and planner text.
- `site/assets/`: original SVG artwork, webfonts, and the font license.
- `scripts/`: development server and build scripts; no third-party dependencies.

The original Site’s hosting metadata and canonical URL are omitted. Local Vercel identity files, environment files, generated build output, and browser notebook data are excluded from source control. Keep the existing Vercel project when connecting GitHub to hosting.

## Existing notebook data

Browser storage belongs to each website address. Export your notebook on the original Figbridge address, then import that JSON file on the new Vercel address. Keeping the same localStorage key cannot automatically transfer data across domains.

## Verification

Model and static checks passed in the original version. Migration checks cover the build output, preservation of source files, and development-server HTTP responses. Browser visual and interaction QA remains unperformed.
