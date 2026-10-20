# Product grid image correction

Store: `ivh0uz-ej.myshopify.com`.

Source: published Velvet Noir, theme `167604748345`.
Corrected draft: Velvet Noir - product image fix, theme `167683915833` (unpublished).

Preview: https://ivh0uz-ej.myshopify.com/collections/all?preview_theme_id=167683915833

Only two remote files changed: `assets/vr-product-images.css` and the stylesheet inclusion in `layout/theme.liquid`. The remaining files here are downloaded dependencies for validation. The published theme and product records were not changed during this correction.

The grid now fits complete images inside square, padded light panels. Columns have consistent gaps: two on mobile, four on desktop. Product photography uses `object-fit: contain` instead of `cover`.

Shopify skill validation passed using cached schemas, with eleven inherited unused-variable warnings in the original layout. The added CSS passed without findings. Browser checks using the actual product image files and the theme's compiled CSS passed at 1440px and 390px: all twenty sampled images loaded, used contain, stayed inside square frames, and produced no horizontal page overflow. Results: `layout-checks.json`.

These screenshots are a local reproduction of the card markup and actual catalogue images, not a captured Shopify storefront. The actual Shopify preview redirects the unauthenticated browser to the store password page, so authenticated end-to-end visual confirmation remains outstanding.

This corrects cropping and spacing. Eighteen original flyers remain unchanged and still need clean product images; see `../catalog-audit-2026-10-20.md`. This draft has not been published.

## Collection refinement — 20 October 2026

Updated the same draft's CSS after the user's second screenshot: warmer image panels, smaller corner radii, less image padding, larger product names and prices, consistent title space to align prices, subtle card separators, and revised grid gaps. Keyboard focus remains visible, hover is restrained, and reduced-motion preferences disable transitions.

The CSS passed the Shopify skill validator. Local card checks with real product images passed again at 1440px and 390px: twenty images loaded, complete products fit inside square frames, and no horizontal overflow occurred. Actual storefront rendering still requires access through the store password page. No product images, prices or statuses changed in this refinement, and the published theme remains unchanged.

Dark-panel refinement: replaced pale card backgrounds with muted plum (#352a32), coordinated borders and a slightly lighter plum hover. CSS validation and local desktop/mobile checks passed. Updated the unpublished draft only.
