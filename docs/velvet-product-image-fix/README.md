# Velvet Noir product photography and homepage patch

Store: ivh0uz-ej.myshopify.com.
Draft: Velvet Noir - product image fix, theme 167683915833.
Preview: https://ivh0uz-ej.myshopify.com/?preview_theme_id=167683915833

This folder is a patch snapshot, not a complete Shopify theme. The remote draft changes are assets/vr-product-images.css, its stylesheet inclusion in layout/theme.liquid, and templates/index.liquid. The published Velvet Noir theme (167604748345) was not edited or published by this patch.

The homepage now selects four reviewed products by handle instead of taking the first products from the whole catalogue. Imports cannot automatically enter this selection. The four handles are in approved_home_handles in templates/index.liquid. A missing product or image is skipped. Product links, live prices, analytics, image loading, and existing card blocks remain in use.

Product and homepage cards use complete images in square plum frames, consistent gaps, aligned text and prices, four desktop columns and two mobile columns. Keyboard focus, hover and reduced-motion behaviour remain supported.

The photos directory holds 27 transparent cutouts produced with the built-in image_gen tool. These were visually checked against the supplied product photos, uploaded to Shopify, and moved to first position on their corresponding products. Original gallery photos remain attached. All 35 products in the new batch retain Active status and the user's temporary R299 price. Eight original images remain because edits were declined or produced no usable output; none is selected for the homepage. The photo manifest records individual products and unresolved items. PROMPTS.md records the prompt specification and source exceptions.

Validation: Shopify Liquid/CSS validation passed using cached schemas, with inherited template warnings. Local browser checks passed at 1440px and 390px with the actual four homepage images: loaded images, contain sizing, square frames, no horizontal overflow. Screenshots here are local reproductions, not authenticated storefront captures. Shopify API verification confirmed all 27 cutouts as first images and all 35 products still Active at R299. See validation/verification.json.

The homepage layout is saved to the unpublished draft. Publishing that draft in Shopify applies the layout to the live storefront. Product media updates already apply to the live product records.
