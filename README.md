# Vibe-ration on Dawn

A local Shopify theme based on Dawn 15.5.0, following the v2 design reference: cream and stone surfaces, plum buttons, a rose accent, Georgia headings and system body text.

The homepage, product, collection, cart, About, Help, Contact, search and 404 designs are implemented. Shopify commerce remains native. The wordmark, category labels and editorial copy are provisional; product photography and real catalogue content are still required.

## Review the design locally

From this repository root:

```powershell
npm.cmd ci --prefix tools
node tools/preview.mjs --serve
```

Open http://127.0.0.1:4173. On first entry, confirm the age gate. Local pages use sample products and prices solely to review the layout. The preview is generated from the actual Liquid sections and snippets, using LiquidJS and explicit Shopify fixtures. It is not a connected storefront. Forms and checkout cannot submit purchases.

The generated `preview` directory is beside the repository. For browser checks while the preview server is running:

```powershell
node tools/check-design.mjs
shopify.cmd theme check --path .
```

The browser script uses installed Microsoft Edge. Reports and screenshots are in `tools/validation/`; the renderer's limitations are recorded in `tools/preview-render.json`. Run all layout checks again on a Shopify preview after connection.

## Design controls

- **Theme settings → Vibe-ration design:** provisional wordmark, accent colours, age confirmation.
- **Homepage:** VR Hero, VR Categories, VR Weekly deals, Dawn Featured collection, VR Trust row, Dawn Newsletter, Dawn Rich text and VR FAQ.
- **Product cards:** Dawn's native card, with 4:5 media, availability, sale percentage or New/Best seller tags, and native quick add. Products with options use Dawn's selection modal.
- **Other pages:** assign `page.about`, `page.help` and `page.contact` to their respective Admin pages.
- **Images:** use section image pickers and product media. Neutral Photo placeholders remain until real images exist.
- **Navigation:** native Dawn header/footer menus. Populate `main-menu` and `footer` in Admin.

The newsletter currently promises updates, without an unconfigured discount. Trust copy avoids unconfirmed shipping, returns or packaging claims.

## Age confirmation and promotions

Age confirmation is enabled provisionally because it appears in the supplied mockups. It uses a native modal dialog, keyboard focus containment and `sessionStorage`; a separate tab/session may ask again. Storage failure asks again on the next page. The theme editor skips the modal. No crawler-specific bypass is included. This is a client-side confirmation, not age verification.

Confirm whether the actual product category needs this before launch. If unnecessary, remove `snippets/vr-age-gate.liquid`, its conditional render in `layout/theme.liquid`, `VrAgeGate` from `assets/vr-design.js`, the `.vr-age-gate*` styles, the `vr_age_gate` schema/data entries and `vr.age_gate` locale entries. Turning off the setting alone is only a preview control.

The deals timer is blank by default. Set a complete ISO 8601 timestamp with a timezone, such as `2026-12-04T23:59:00+02:00`. It hides when expired or invalid and does not automatically repeat. Schedule the actual discount/price changes separately in Shopify to match the same endpoint.

## Connect the store after design review

1. Supply the correct `.myshopify.com` address. Verify the store identity before writes.
2. Configure the catalogue, collection pickers, menus, pages and policy links. Replace provisional brand/story/category content and add real photographs. See `docs/STORE-HANDOFF.md`.
3. Preview with `shopify.cmd theme dev --store <store>.myshopify.com --path .`.
4. Repeat mobile/tablet checks and test native cart, variants, quick add, filters, search, forms and an end-to-end test checkout.
5. Push a new unpublished theme with `shopify.cmd theme push --store <store>.myshopify.com --path . --unpublished`. Record the returned theme ID and use it explicitly thereafter.
6. Review on a real phone and in the theme editor. Publish only when instructed after review.

Repository: https://github.com/Lyrixcs-Miles/Vibe-ration — branch `build-on-dawn`. Theme directories are at repository root for Shopify's GitHub integration. `tools/`, `docs/` and `design-reference/` are supporting material, not storefront theme directories. GitHub integration can synchronise editor changes back to the branch: pull and inspect changes before local editing/pushing. Do not connect this branch to a published theme during development.
