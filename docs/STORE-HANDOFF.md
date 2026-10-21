# Store handoff: Vibe-ration / Velvet Noir

Last verified: **21 October 2026**, Africa/Johannesburg. This is the current operational handoff; older design-build notes describe earlier local work.

## Current outcome

The catalogue and product photography work is retained. The Christmas design was rejected and removed from the current preview. Only the requested 18+ confirmation is retained on the earlier dark Velvet Noir design. The live theme was not changed by this revision.

| Item | Verified state |
| --- | --- |
| Store | My Store — ivh0uz-ej.myshopify.com |
| Currency | ZAR |
| Products | 77 total; 77 Active; 0 Draft |
| New toy2 batch | 35 products, tagged toy2-import-2026-10-21 |
| Temporary-price tag | 35 products |
| Current draft | Velvet Noir - 18+ entry — 167729856569 |
| Published MAIN theme | Velvet Noir — 167604748345 |
| Preserved previous draft | Velvet Noir - product image fix — 167683915833 |
| Git repository | https://github.com/Lyrixcs-Miles/Vibe-ration |
| Working branch | build-on-dawn |

[Preview the current draft](https://ivh0uz-ej.myshopify.com/?preview_theme_id=167729856569). The theme editor skips the popup; use a storefront preview in a fresh tab to inspect entry behavior.

## Source layout and deployment boundaries

There are two distinct theme implementations in this repository:

1. The repository root is the earlier Dawn 15.5.0 design build. Its README and tools describe a local fixture-based design preview.
2. The connected store uses Velvet Noir. Its deployed changes are captured under docs/velvet-product-image-fix and docs/velvet-age-entry. These are patch snapshots, not complete standalone themes.

Do not push the root Dawn directory over Velvet Noir. Do not upload the docs directory as a theme. Use explicit store and draft theme IDs, preserve the remote theme's other files, and upload only the listed patch paths.

The shared local workspace also contains LiveTheme, velvet-image-fix, velvet-age-gate, catalogue backups, image working folders and original mockups. They are working material, not all tracked deployable source. Unrelated local Dawn edits were preserved.

## Catalogue and pricing

The initial batch contained 42 products. Contrary to the original draft-only report, the earlier audit found them Active. The user instructed us to retain statuses and leave the unknown Meaty Thrusting Vibrator price for later.

The toy2 import added 35 products. The user explicitly authorized any temporary selling price and immediate product publication; the batch was created at R299 and remains tagged temporary-price for review. The prior import verification confirmed all 35 Active at R299. Today's readback confirms all 77 Active and the two batch/tag counts; prices were not changed or re-audited by this popup revision.

Product status, channel publication and theme publication are separate. A draft theme does not make products Draft. Product media changes affect shared catalogue records, including the live store. Theme layout changes stay in the specific draft until it is published.

Original source folders supplied by the user:

- C:/Users/Lyrixcs Miles/Desktop/temp.img/toy
- C:/Users/Lyrixcs Miles/Desktop/temp.img/toy2

These local folders are not portable repository dependencies.

## Collections

Current counts and exact matching rules were read from Shopify. Counts overlap because products can belong to several collections. A collection's rules and count do not prove its channel visibility or navigation placement; those were not reconfigured in this revision.

| Collection | Handle | Products | Membership |
| --- | --- | ---: | --- |
| Home page | `frontpage` | 1 | Manual |
| Toys | `toys` | 77 | Any: TAG EQUALS "toy"; TAG EQUALS "toy-catalogue" |
| For Couples | `for-couples` | 12 | Any: TAG EQUALS "couples"; TYPE EQUALS "Bondage"; TITLE CONTAINS "Remote"; TITLE CONTAINS "Wireless"; TITLE CONTAINS "App-Controlled" |
| Cosplay & Roleplay | `cosplay-roleplay` | 8 | Any: TAG EQUALS "cosplay"; TYPE EQUALS "Bondage" |
| Hers | `hers` | 28 | Manual |
| Vibrators | `vibrators` | 28 | All: TYPE EQUALS "Vibrators" |
| Wands & Massagers | `wands-massagers` | 4 | All: TYPE EQUALS "Wands" |
| Dildos | `dildos` | 4 | All: TYPE EQUALS "Dildos" |
| Anal Toys | `anal-toys` | 4 | All: TYPE EQUALS "Anal Toys" |
| Masturbators & Strokers | `masturbators-strokers` | 9 | All: TYPE EQUALS "Masturbators" |
| Bondage & Kink | `bondage-kink` | 8 | All: TYPE EQUALS "Bondage" |
| For Her | `for-her` | 37 | Any: TYPE EQUALS "Vibrators"; TYPE EQUALS "Wands"; TYPE EQUALS "Dildos"; TYPE EQUALS "Wellness" |
| For Him | `for-him` | 16 | Any: TYPE EQUALS "Masturbators"; TYPE EQUALS "Sleeves & Rings"; TYPE EQUALS "Pumps" |
| Lilo Collection | `lilo-collection` | 14 | All: VENDOR EQUALS "Lilo" |
| Party & Novelty | `party-novelty` | 4 | All: TYPE EQUALS "Novelty" |

The earlier four empty collections have changed: Toys, For Couples and Cosplay & Roleplay now have automated membership; Hers contains 28 manually assigned products. Hers still overlaps For Her and can become stale because it is manual. No collection was deleted during this revision.

When adding products, use the exact types, vendor spelling and tags listed above so automation continues to work. The Toys collection currently covers all 77 products. The original ten-collection report is historical and its product counts no longer describe the expanded catalogue.

## Photography and homepage curation

The accepted direction is complete product-only imagery with transparent backgrounds, displayed in muted plum frames. White product-card panels were rejected. Existing square card styling uses contain sizing so tall or wide products are not cropped, with four desktop columns and two on mobile.

The last photography pass produced 27 reviewed transparent cutouts for the 35 imported products. They were attached and moved to first position; original gallery media was preserved. Product IDs, media IDs, filenames and unresolved items are recorded in [the photo manifest](velvet-product-image-fix/photos/manifest.json). [PROMPTS.md](velvet-product-image-fix/photos/PROMPTS.md) records the generation instructions; alpha checks and verification are stored alongside the photos.

Eight new-batch products still use original images: Dual-Opening Realistic Masturbator, A Year of Sex Position Cards, Bedroom Commands Card Game, Ribbed Masturbator Cup, U-Shaped Couples Vibrator, Elastic Strap-On Harness with Dildo, Realistic Hip Masturbator and Dual-Stimulation Rabbit Vibrator. Their edits were declined or returned no usable output; originals remain. Some older products also retain supplier flyers, including visible price text. The catalogue-wide image cleanup is incomplete.

To prevent unreviewed imports or flyers appearing automatically on the homepage, the draft homepage uses this explicit approved_home_handles list in templates/index.liquid:

- so-pure-toy-cleaner-spray
- satisfyer-pro-2
- lilo-emily-g-spot-rabbit-vibrator
- lilo-large-wand

Missing products or missing images are skipped. Titles, prices and product links still come from Shopify. To feature a different product, first review its main image, then edit this list and preview the draft. This is deliberate curation, not a sales-ranked bestseller calculation. The displayed “Bestsellers” heading is editorial copy.

The original product-image patch and local responsive evidence are documented in [its README](velvet-product-image-fix/README.md).

## Retained 18+ popup

The popup is enabled in the current draft under Theme settings > Age confirmation > Show 18+ entry confirmation. Its CSS, script and snippet are separate from seasonal styling. No Christmas banner, announcement, colour override or setting is active.

Visitors must confirm they are at least 18 before browsing. Confirmation is saved only in sessionStorage under vr-age-confirmed-v1 for the current tab. Declining leaves an adults-only message and an external exit link while keeping browsing blocked. Escape does not dismiss the dialog; keyboard focus wraps inside. Blocked storage still permits acceptance on the current page; the next page asks again. Without JavaScript, a blocking message explains the requirement. No date of birth or identity information is stored.

The popup is self-declared age confirmation, not identity verification. Only English popup translations were added. Other locale files were not translated in this change.

See [the popup patch README](velvet-age-entry/README.md) for the eight changed paths, configuration, behavior, verification and rollback details.

## Verification and limits

- Shopify schema discovery and operation validation preceded API reads/writes.
- Upload succeeded with no user errors. Remote readback matched all eight active files and confirmed popup enabled, festive references removed and theme UNPUBLISHED.
- Shopify skill validation passed all eight Liquid/CSS/JS/JSON files with inherited layout/template warnings, using cached schemas because the documentation endpoint was unavailable.
- Thirty local browser assertions passed at 1440px and 390px, covering opening, pre-acceptance hiding, focus, Escape, acceptance, navigation, decline, storage denial, no JavaScript and no horizontal overflow.
- Standard Shopify CLI Theme Check also ran. It does not pass this partial Velvet Noir working snapshot: the baseline already reports missing assets, translation gaps and unsupported/unknown constructs. Added findings are translation-parity checks for the English-only popup; there are no added non-translation findings. See the saved summary rather than treating this as a clean full-theme lint result.
- Browser screenshots are local reproductions using the popup's actual assets. They do not certify an authenticated full storefront, actual mobile hardware, cart or checkout.
- No payment, tax, shipping, inventory, checkout, legal-policy or navigation configuration was changed or certified by this revision.

Evidence: [validation folder](velvet-age-entry/validation), including store-state.json, themes.json, remote-verification.json, checks.json and theme-check-summary.json.

## Publishing and ongoing maintenance

Committing or pushing this repository does not publish the Shopify draft. The connected tool cannot publish themes or edit MAIN. To make this version live, open Shopify admin > Online Store > Themes, preview **Velvet Noir - 18+ entry**, then publish that specific draft. Confirm any storefront password setting separately.

For a future change: verify store/theme identity and role, back up current remote files/settings, update an unpublished theme, validate, preview and check remote readback. Never overwrite newer merchant settings from an older snapshot without reviewing the differences.

To turn off the popup, disable its theme setting. To return to the earlier image-only design, the preserved product-image-fix draft remains available. Git history also retains both the festive attempt and its explicit revert.

## Remaining merchant decisions and checks

- Replace the 35 temporary R299 prices and remove temporary-price tags after review.
- Set the unknown Meaty Thrusting Vibrator selling price; it was previously reported at R0 and intentionally left unchanged.
- Complete remaining supplier-flyer replacement and review all visible price/cost text before featuring products.
- Decide whether to consolidate Hers into For Her, and check collection publication/navigation.
- Confirm final store name/branding; Shopify still reports My Store.
- Review policy text, delivery promises, taxes, inventory and payment/shipping setup; perform a real test checkout.
- Review the complete authenticated preview and publish the chosen theme in Shopify admin.

## Git history relevant to this handoff

- 6adfc2b: saved the dark product-grid patch.
- 2be8c47: saved curated homepage and transparent photography.
- 1362958: festive styling and popup attempt.
- 94621e7: explicitly reverted that combined snapshot.
- The following change restores only the retained popup and adds this handoff. Earlier product/photo work remains present.
