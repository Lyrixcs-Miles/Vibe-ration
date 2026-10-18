# Theme conventions

- This directory is the repository root and the Shopify theme root. Work on `build-on-dawn` until reviewed. Do not publish to a store without the user's instruction.
- Start from Dawn 15.5.0; see `UPSTREAM.md`. Keep `LICENSE.md`.
- Keep native commerce features. Adapt `snippets/card-product.liquid`; do not replace its form, variant-selection, quantity-rule or quick-add logic.
- Prefix custom section, snippet, CSS and JavaScript files with `vr-`. Keep styles scoped and preserve visible focus, reduced motion and 44px touch targets.
- Use 990px for desktop navigation and four-column product grids; keep two product columns below that. Categories use two columns below 640px and three above.
- Keep one primary h1 per page. Homepage hero owns its h1; other templates retain their page/product/collection h1.
- Use theme-editor settings for copy and images. Add English locale entries for fixed interface strings.
- Search templates and section groups before changing a section schema or setting ID.
- Original static mockups in `design-reference/` are reference files. Do not edit them to simulate progress on the Liquid theme.
- `tools/preview.mjs` renders the theme with local fixtures. It cannot validate Shopify commerce or represent live products.
- Before store operations, verify the exact `.myshopify.com` domain and theme ID. No store is connected at this stage.
- After connection, pull and review remote JSON/settings changes before pushing. Push an unpublished theme and use explicit theme IDs for later updates.
- Run Theme Check and the Shopify skill validator after theme changes. Run responsive/interaction checks when relevant. Compare inherited warnings against the clean Dawn baseline.
