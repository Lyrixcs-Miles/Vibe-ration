# Store connection checklist

No Shopify store has been connected or changed during the local design build.

## Content and setup

- Confirm the brand name/wordmark, actual product category and age-gate requirement.
- Check the chosen payment provider's acceptance of the actual product category before configuring checkout.
- Add actual products, SKUs, inventory, variants, prices and 4:5 photography. Local fixture products are not import data.
- Add collections and select them in VR Categories, VR Weekly deals and Featured collection. Add `new` and `best-seller` tags where appropriate. Configure compare-at prices consistently.
- Create About, Help and Contact pages; assign their matching theme templates. Update the provisional story and FAQ answers.
- Populate `main-menu` and `footer`, including actual policy URLs. The local fixture policy URLs only point to the sample Help page; Shopify renders real policies after setup.
- Configure shipping zones/rates, taxes, currency, policies, notifications and checkout branding. Verify policy text against the actual operation before launch.
- If offering a newsletter discount, configure the discount and delivery automation before adding a percentage promise to the copy.
- Coordinate promotion timing in Shopify with the timer's explicit timezone. The countdown does not alter prices.

## Required connected tests

- Identity: verify exact `.myshopify.com` domain and unpublished theme ID before writes.
- Theme editor: add/reorder/remove custom sections, edit copy/image/collection settings, reload sections; confirm countdown elements disconnect/reconnect cleanly.
- Product: single and multiple variants, unavailable variant and whole-product sold out, media gallery/zoom, quantity limits and add-to-cart errors.
- Quick add: single-variant product, selection modal for multiple variants/quantity rules, cart drawer updates and focus restoration.
- Cart: add, edit quantity, remove, empty state, discounts and accurate totals.
- Collection/search: real filters/sorting, empty results, pagination and predictive search.
- Forms: newsletter success/duplicate/error states and contact validation/success; privacy links.
- Age gate: keyboard focus, reject/accept, same-tab page navigation, new session, storage blocked and no JavaScript. Decide final category treatment before launch.
- Responsive: all nine page types at 360, 390, 768, 820, 1024 and 1440px, then a real phone. Check no horizontal overflow.
- Run Lighthouse on home, collection and product pages. Test representative real images, not just empty placeholders.
- Complete a test checkout and verify notifications/order status and refund/cancellation flow. The static thank-you mockup is a checkout styling reference only.
- Review the unpublished theme, then request publication only after the user approves.

Local browser evidence covers rendering/layout and the custom interactions only. It does not certify any of the Shopify-backed workflows above.
