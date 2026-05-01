<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
 
## Grab & Go Theme Rules

- The site theme is brand-driven and must follow the logo palette: warm red, orange, yellow, with blue used as a supporting accent.
- Use the theme tokens defined in `app/globals.css` instead of hardcoded hex values in components.
- The default visual tone is bright, playful, appetizing, and high-contrast. Avoid grayscale-only or flat corporate styling unless it is part of a deliberate utility surface.
- Backgrounds should stay light and warm. Primary surfaces are cream or off-white. The footer and a few contrast sections can use a deep navy.
- Primary actions must use the brand red/orange treatment. Secondary actions can use neutral surfaces with warm hover states. Decorative highlights may use yellow or blue sparingly.
- The theme anatomy should be treated as a token map:
	- Background: page canvas and app shell.
	- Surface: cards, drawers, menus, and overlays.
	- Elevated surface: headers, nav pills, and floating panels.
	- Primary: CTA buttons and active states.
	- Secondary: supporting buttons and emphasis chips.
	- Accent: badges, highlights, and small decorative details.
	- Text: main copy, titles, and icon strokes.
	- Muted text: descriptions, metadata, and helper copy.
	- Border: dividers, outlines, and subtle separators.
	- Footer: dark contrast area with light text.
- New components should map to theme roles, not invent new one-off colors. If a new role is needed, add a token first in `app/globals.css`, then use it consistently.
- Prefer semantic usage rules for future UI:
	- Use Primary for the strongest call to action only.
	- Use Secondary for category filters, tabs, and navigation chips.
	- Use Accent for small bursts of energy, not large surfaces.
	- Use navy or charcoal for contrast bands, never as the main brand color.
- Keep hover and active states derived from the same palette. Do not introduce unrelated accent colors.
- Keep the layout airy and appetizing. Use soft shadows, rounded corners, and warm gradients rather than heavy borders.
<!-- END:nextjs-agent-rules -->
