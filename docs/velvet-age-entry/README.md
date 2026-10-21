# Velvet Noir: dark storefront with 18+ confirmation

Updated 21 October 2026, Africa/Johannesburg.

This patch restores the pre-Christmas Velvet Noir design and retains only the adult-entry popup. It includes the existing curated homepage and product-card image treatment. No festive setting, announcement, ornament, banner or palette remains in the active layout, homepage or configuration.

## Store and deployment

- Store: **My Store**, **ivh0uz-ej.myshopify.com**, **ZAR**.
- Updated draft: **Velvet Noir - 18+ entry**, theme **167729856569**.
- [Preview](https://ivh0uz-ej.myshopify.com/?preview_theme_id=167729856569).
- The draft was previously named Velvet Noir - Festive; its ID is unchanged.
- The live MAIN theme remains Velvet Noir, **167604748345**.
- The earlier image-fix draft, **167683915833**, remains the baseline before the popup.

These eight files form a patch snapshot, not a complete theme. Apply them to the image-fix baseline, not to the Dawn source tree at the repository root. The full theme needed for local validation is in the workspace folder velvet-age-gate. Shopify holds the deployed draft.

The original festive CSS and snippet may remain as unused files in the remote draft. The active layout no longer loads or renders them; the festive settings and translations were removed. They have no storefront effect.

## Files and behavior

| File | Purpose |
| --- | --- |
| layout/theme.liquid | Preserves the dark theme, includes popup CSS and runs an early session check; renders the dialog and deferred script when enabled outside the theme editor |
| templates/index.liquid | Restores the image-fix homepage exactly, including its curated product selection |
| snippets/vr-age-gate.liquid | Accessible native dialog, acceptance/decline controls, under-18 exit and no-JavaScript fallback |
| assets/vr-age-gate.css | Scoped dark popup styles, scroll lock, pre-acceptance hiding, focus rings and reduced-motion behavior |
| assets/vr-age-gate.js | Modal behavior, focus wrapping and per-tab confirmation |
| config/settings_schema.json | Age confirmation setting group |
| config/settings_data.json | Enables the popup; preserves previous nonseasonal settings |
| locales/en.default.json | English popup translations under vr_age |

## Customer flow

An unconfirmed visitor sees “Are you 18 or older?” before browsing. “Yes, I am 18 or older” closes the modal and stores yes in sessionStorage under vr-age-confirmed-v1. Navigation within that tab does not ask again. No date of birth or personal details are collected. This is self-declared confirmation, not identity verification.

“I am under 18” replaces the question with an adults-only message and a Leave this site link to Google. Browsing stays blocked. Escape and clicking outside do not dismiss the modal. Tab and Shift+Tab remain inside its controls.

If storage is blocked, acceptance still reveals the current page and the next page asks again. With JavaScript disabled, an explanation and exit link cover the storefront. In Shopify's theme editor the gate is skipped so the merchant can edit the page.

To disable: Customize the draft > Theme settings > Age confirmation > turn off Show 18+ entry confirmation. To change wording, edit the vr_age keys in the English locale. Styling is independent of any seasonal feature.

## Validation

- Shopify Liquid/CSS/JS/JSON validation passed for all eight files using cached Shopify schemas. Inherited unused-variable findings and the existing featured_product_count warning remain in the baseline layout/homepage.
- Thirty local browser assertions passed at 1440px and 390px: initial modal, hidden browsing, Escape, keyboard focus, acceptance, no horizontal overflow, page navigation, decline, blocked storage and disabled JavaScript.
- Remote readback confirmed all eight files match the upload, popup enabled, no festive references in the active files, and theme role UNPUBLISHED.
- Standard CLI Theme Check ran against this working snapshot and the earlier baseline. It reports inherited errors in the partial theme and added translation-parity findings for the English-only popup. There are no added non-translation findings; see validation/theme-check-summary.json.
- validation contains screenshots, browser results, store/collection data, theme identities and remote readback results.

The screenshots use a local rendering fixture with the actual popup assets. They are not authenticated captures of Shopify checkout or the complete storefront. Commerce, cart and checkout behavior have not been certified by these popup tests.

To rerun the focused browser fixture from the repository root: install the tools dependencies with npm.cmd ci --prefix tools, then run node docs/velvet-age-entry/check-age.mjs. It defaults to installed Microsoft Edge on Windows; BROWSER_EXECUTABLE can specify another Chromium executable. The fixture uses actual popup assets and simplified page content.

## Publication and rollback

Publishing is separate from committing/pushing Git. The Shopify connector cannot publish a theme or write to MAIN. In Shopify admin > Online Store > Themes, preview **Velvet Noir - 18+ entry**, then publish that theme when desired.

To remove only the popup, turn off its setting. To return to the earlier draft design without it, use the preserved image-fix draft. Git keeps the festive attempt and its revert as history; the current snapshot contains only the retained popup and previous design.

For the full project and catalogue handoff, see [STORE-HANDOFF.md](../STORE-HANDOFF.md). For photography manifests and the earlier homepage work, see [velvet-product-image-fix](../velvet-product-image-fix/README.md).
