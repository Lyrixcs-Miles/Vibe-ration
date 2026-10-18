# Dawn baseline

- Upstream: https://github.com/Shopify/dawn
- Release: **15.5.0**
- Commit: `83d5e6b4094d8019820bffafe04b242d0602ffe2`
- Downloaded with `git clone --depth 1 --branch v15.5.0 https://github.com/Shopify/dawn.git vibe-dawn`.
- The first commit on `build-on-dawn` is the unmodified Dawn release plus `.gitattributes`.
- Shopify's `LICENSE.md` remains in this repository.

Custom sections, snippets and assets use `vr-`. Native edits are limited to global design tokens and assets, header wordmark/heading semantics, product-card presentation and placeholders, cart empty-state heading semantics, and JSON section/template configuration. Product forms, variant pickers, media galleries, search, filters, quick add, cart logic and checkout remain Dawn/Shopify features.

The clean `vibe-dawn` checkout beside this repository is a local reference, not the deployable theme. Compare upgrades against the pinned commit; do not assume a future Dawn release can be copied over custom work.
