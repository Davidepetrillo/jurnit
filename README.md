# Jurnit — Landing Page

A minimal, seamless landing page for **Jurnit**. The whole page is one continuous
light‑gray surface (`#e3e3e3`); the feature sections are the real app screens,
processed so they read as native design — labels removed, trimmed, and re‑padded with
uniform margins so nothing is cut or cramped.

## Stack

Zero‑dependency static site.

- `index.html` — nav, hero, app scenes, waitlist, footer
- `styles.css` — design system + layout (shared gray, centered full‑width scenes)
- `script.js` — sticky nav, scroll reveals, animated counter, waitlist form
- `assets/` — the processed app screens (`homepage`, `trace-details`,
  `trace-reactions`, `mission`, `journey`)
- `assets/_source/` — the original, untouched screenshots (kept as backup)

## Run

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

## Updating a screen

Re‑export the slide and overwrite the matching file in `assets/`. For the cleanest
result keep the slide background at `#e3e3e3` and leave generous margin around the
content (the page trims/pads automatically only at build time, so export it clean).

## Notes

- The waitlist stores signups in `localStorage` (`wire()` in `script.js`) — swap in a
  real backend there.
- Motion respects `prefers-reduced-motion`.
