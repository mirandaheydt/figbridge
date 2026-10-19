# Start here

This is **Figbridge**, Miranda’s personal home notebook. It is separate from `mirandaheydt/vibe-coding-game`.

Keep changes in plain language and preserve working versions. This is the v0 / Vercel migration of Figbridge. Reuse the v0 chat and Vercel project IDs returned during import and deployment; do not create duplicate projects for edits.

## Personal direction

- Warm cream, fig/plum, mauve, moss, and honey.
- An editorial layout with original vector artwork and a quiet, useful notebook.
- Music room: moody mauve, baby grand, shelves and a small bar, soft curtains and a listening corner.
- Living room: green sofas with short brown legs, existing fireplace and orangish wood floors, colorful but cohesive, TV on the left wall.
- Kitchen: explore backsplash, cabinet color, and handles while retaining appliances and countertops.
- Berry is the gray cat; Daisy is the orange cat.

Do not publish private financial details or a street address. Do not invent completed renovations or personal events. Room artwork is conceptual and starter projects are suggestions.

## Technical direction

Static source in `site/`, copied to `dist/` by `npm run build`, native browser dialogs, browser-local storage, and no dependencies. The generic Node.js dev server starts with `npm run dev`. Content is inserted with DOM text methods; preserve that protection for imported notes. Validate imports before replacement, preserve the confirmation and undo, and keep export available. Import the source into a private v0 chat and review Vercel deployment protection before publishing. Notes must be exported from the old domain and imported at the new domain.

Distinguish static checks from actual browser QA. Initial verification did not include a browser because the required managed browser skill was unavailable.
