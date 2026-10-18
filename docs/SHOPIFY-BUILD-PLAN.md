# Vibe-ration → Shopify store on Dawn: build plan

Goal: turn the static mockups in this folder into a real Shopify theme built on **Dawn**, for a **new, separate Shopify store**, the same way Paws & Play was done (`D:\Development\My Personal Projects\Paws & Play`). Keep Dawn's real shopping features. Only the look is custom.

---

## Local build status ? 18 October 2026

The user authorised local design/build work first and will connect the correct Shopify store after design completion. Repository: https://github.com/Lyrixcs-Miles/Vibe-ration.git. Working branch: `build-on-dawn`.

- Dawn **15.5.0** is pinned to commit `83d5e6b4094d8019820bffafe04b242d0602ffe2`; `vibe-dawn` is the clean reference.
- `LiveTheme` is both the theme root and Git repository root. Supporting tools, documentation and unchanged mockup copies live inside it so they are versioned alongside the theme.
- Assumptions: v2 homepage, provisional Vibe-ration wordmark, rose accent, Georgia/system fonts and neutral photo placeholders. Category labels/story copy are provisional.
- Use **990px** for desktop navigation and four-column products, two product columns below; categories become three columns at 640px. This supersedes the 860px desktop rule in the original design spec.
- Adapt Dawn's existing `card-product`; preserve its native commerce logic. One primary h1 belongs to the respective page title, with the hero h1 only on the homepage.
- Age confirmation is provisional and enabled for mockup parity. Confirm the actual category before launch; remove its implementation entirely if unnecessary.
- Promotion timers require an explicit timezone and matching Shopify promotion scheduling. No repeating or invented deadline. No unconfigured newsletter discount or shipping claims.
- Local design previews and browser checks use actual Liquid with sample Shopify fixtures. They do not validate checkout, Ajax cart or other store-backed features. See `LiveTheme/docs/STORE-HANDOFF.md` for the connected test pass.
- Local implementation is complete: all nine page types render from Liquid, 54 responsive checks and 10 interaction checks pass, and Theme Check has zero errors with eight inherited Dawn warnings. Shopify validator reports are saved under `LiveTheme/tools/validation/`.
- GitHub setup and local build can proceed before store access. All Admin setup, unpublished store preview, real-device checks, Lighthouse and test checkout remain deferred until connection. No publication is authorised at this stage.

## 1. How Paws & Play was done (the pattern to repeat)

| Step | What was done | Where it lives |
|---|---|---|
| Design source | Static HTML site (`index.html`, `pages/*.html`, `assets/css`, `assets/imgs`, `assets/js`) kept unchanged in the parent folder | `Paws & Play\` |
| False start | First built a standalone theme from the HTML with a script (`tools/build-shopify-theme.cjs`). It was thrown away because it replaced Dawn's cart, variants, search, etc. **Skip this step for Vibe-ration and start on Dawn directly.** | `tools/`, git history |
| Dawn base | `shopify theme init paws-play-dawn --clone-url https://github.com/Shopify/dawn.git --latest --no-input` gave Dawn 15.5.0 | `paws-play-dawn\` (clean copy) |
| Theme | `LiveTheme\` = Dawn + custom sections with a prefix (`pp-`): hero, categories, promotions, care cards, story, testimonials, footer, plus a product-card snippet, navigation snippets and one scoped stylesheet/script (`pp-design.css/js`) | `LiveTheme\` |
| Dawn kept native | Product page, variant picker, media gallery, cart drawer, quick add, collection filters, predictive search, accounts, contact/newsletter forms, localisation, gift cards, checkout. "Latest arrivals" and "Latest news" use Dawn's own featured-collection and blog sections | `LiveTheme\sections` |
| Page templates | `page.about`, `page.contact`, `page.delivery`, `page.faq` | `LiveTheme\templates` |
| Store content | Pages, blog and 6 articles created through the Admin API from JSON/GraphQL files | `tools/*.json`, `tools/*.graphql` |
| Images | AI image prompts written per section, generated, saved as theme assets (`pp-*.png`) | `tools/*-image-prompts.md` |
| Checks | Node/headless-browser scripts screenshot each section at 360 / 768 / 1440 (and 390 / 900 / 1920 for the hero) and save pass/fail JSON; `shopify theme check` results saved | `tools/check-*.cjs`, `tools/*-validation.json` |
| Docs | `README.md` (how to preview, customise, deploy), `UPSTREAM.md` (Dawn version and init command), Shopify's `LICENSE.md` kept | `LiveTheme\` |
| Deploy | GitHub repo `Lyrixcs-Miles/Paws-Play-Shopify-Store`, branch `rebuild-on-dawn`, connected through Shopify's GitHub integration (or zip upload) | GitHub |

---

## 2. Decisions needed before building

1. **Store address:** the new store's `xxxx.myshopify.com`.
2. **Brand name and logo:** the mockups still say "Your Store Name (Draft)" (design spec §10–11).
3. **GitHub repo name:** e.g. `Lyrixcs-Miles/Vibe-ration-Shopify-Store`.
4. **Which mockup is the homepage:** `store-v2.html` (newer) or `draft-store-v1.html`. This plan assumes **v2**.
5. **Age gate (yes/no, decided once):** every page has "Are you 18 or older?". **Yes:** build it **always on, with no on/off setting**. **No:** don't build it at all. Spec §6 forbids leaving dormant gate code, so there's no toggle.
6. **Payments:** if the products are adult or age-restricted, check before launch that your payment provider (Shopify Payments, Paystack, PayFast, etc.) accepts that category. Some don't, and this decides the checkout setup.
7. **Accent colour:** keep rose `#c8415f`, or a deeper red or teal (spec §11).
8. **Photo style:** studio on a plain background, or lifestyle. Product photos must be **4:5**.

---

## 3. Folder and git setup (phase 1)

```
Vibe-ration\                  ← repo 1 "Vibe-ration-project" (private): mockups, plan, tools
  *.html, design-spec.md      ← mockups: design source, leave unchanged
  SHOPIFY-BUILD-PLAN.md       ← this file
  tools\                      ← API scripts, screenshot checks, image prompts, check results
  vibe-dawn\                  ← clean Dawn copy for reference/diffing (never edit; git-ignored)
  LiveTheme\                  ← repo 2 "Vibe-ration-Shopify-Store": THEME ONLY (git-ignored by repo 1)
    assets\ config\ layout\ locales\ sections\ snippets\ templates\   ← at the repo ROOT
```

**Two repos, on purpose.** Shopify's GitHub integration needs the theme folders (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`) at the **root** of the connected repo. So `LiveTheme` is its own theme-only repo, and that's the one connected to Shopify. The mockups, this plan and `tools/` live in the parent repo, whose `.gitignore` lists `LiveTheme/` and `vibe-dawn/`. Nothing else goes inside `LiveTheme` apart from `README.md`, `UPSTREAM.md`, `LICENSE.md` and `CLAUDE.md`, which Shopify ignores.

- [ ] `shopify theme init vibe-dawn --clone-url https://github.com/Shopify/dawn.git --latest --no-input`
- [ ] Copy `vibe-dawn` to `LiveTheme`, then `git init`, first commit "Dawn x.y.z base"
- [ ] `git init` the parent `Vibe-ration` folder with the `.gitignore` above, and commit the mockups, plan and tools
- [ ] Add `UPSTREAM.md` (Dawn version and the init command) and keep `LICENSE.md`
- [ ] Add a `.gitattributes` with `* text=auto eol=lf`. SerenQ has none, so every file shows as modified with CRLF-only changes.
- [ ] Create the GitHub repo and push. Use a working branch (e.g. `build-on-dawn`), not `main`, until it's ready.
- [ ] Write `LiveTheme\AGENTS.md` with the conventions below so later sessions follow them.

---

## 4. Mockup to Dawn mapping (phase 2)

Prefix every custom file with **`vr-`** (Paws & Play used `pp-`).

### Homepage (`store-v2.html`)

| Mockup part | Build as |
|---|---|
| Announcement bar (`.announce`) | Dawn **announcement bar** (native), restyled to plum |
| Header, nav, logo, tools | Dawn **header** (native), restyled. Keep cart, search and account icons working |
| Hero (`.hero`, the single h1) | **`vr-hero`** custom section: eyebrow, h1, text, 2 buttons, image picker |
| Shop by category (`.cats`) | **`vr-categories`**: collection-picker blocks, 2 columns on mobile, 3 from 640px |
| New arrivals (`#new`) | Dawn **featured collection** using Dawn?s adapted `card-product` snippet |
| Weekly deals and countdown (`#deals`, `.countdown`) | **`vr-deals`**: featured collection plus a countdown with tabular numerals. Weekly deals only (spec §6). See "Deals must be real" below. |
| Trust row (`.trust`) | **`vr-trust`**: icon/text blocks. Or Dawn's **multicolumn**, restyled. |
| Newsletter "10% off first order" (`.news`) | Dawn **email signup** (native form), restyled plum |
| About teaser (`#about`) | Dawn **image with text** or rich text |
| FAQ "Questions" (`#help`) | **`vr-faq`**: native `<details>`, plus sign to open, minus to close, no JS |
| Footer (`.foot`, `.legal`) | Dawn **footer**, restyled plum. Or `vr-footer` if the layout needs it. |
| Age gate (`#gate`) | Only if §2.5 is **yes**: **`snippets/vr-age-gate.liquid`** rendered unconditionally in `layout/theme.liquid` (no setting), remembered with `sessionStorage` (browser session only). If **no**, don't create it. |
| Toast (`#toast`) | Not needed: Dawn's cart drawer or notification replaces it |

### Other pages

| Mockup | Build as |
|---|---|
| `product.html` | Dawn **main-product** (native: variants, add to cart, gallery). Change only the CSS and block order. |
| `collection.html` | Dawn **main-collection-product-grid**, with filters on, using Dawn?s adapted `card-product` |
| `cart.html` | Dawn **main-cart-items** and **main-cart-footer**, restyled. Turn on the cart drawer. |
| `about.html` | `templates/page.about.json` from custom and Dawn sections |
| `help.html` (Orders / Delivery / Returns / Payments / Privacy / Contact) | `templates/page.help.json`: `vr-faq` groups plus Dawn **contact form** |
| `404.html` | `templates/404.json` restyled |
| `thank-you.html` | **Can't be built in the theme.** The order status / thank-you page is part of Shopify checkout. Use Settings → Checkout (branding, logo, colours) and Shopify's checkout editor blocks. Treat this mockup as a style reference only. |

### Product card: adapt Dawn's `card-product`, don't replace it

This is the **highest-risk piece**. Dawn's `snippets/card-product.liquid` already handles multi-variant products (quick add opens a picker modal instead of adding the wrong variant), quantity rules, sold-out and unavailable states, and the scripts and modals quick add depends on. A new card would have to redo all of that.

- [ ] **Change Dawn's own `card-product.liquid` (and `component-card.css`)** rather than writing a new card. Keep every `{% render 'card-product' %}` caller, the `quick-add` / `product-form` markup, and the quick-add JS/CSS loading as they are. Record every change in `UPSTREAM.md`, so Dawn updates can be merged.
- [ ] Layout: 4:5 image (set via the existing `image_ratio` setting / CSS), then name, **stock line** (new: "In stock" / "Only N left" / "Sold out" from `inventory_quantity`, only for tracked inventory), price, then Dawn's quick-add button (spec §6, don't reorder)
- [ ] Tags top-left on the image, using Dawn's badge area: product tag `new` → "New"; `best-seller` → "Best seller" (plum); compare-at price → "-N%" (accent)
- [ ] Sold out: keep Dawn's disabled button and its translated "Sold out" label
- [ ] Turn quick add on in the collection and featured-collection settings, and test both one-variant and multi-variant products
- [ ] Card wrapper stays `position: relative` (Dawn's `.card-wrapper` already has it; keep it). See the SerenQ gotcha below.

### Deals must be real, not just a timer

The countdown is display only. **Ending the timer doesn't end the discount.**

- [ ] The deal itself is a **Shopify automatic discount** (or a discount code) **with an end date and time**, set in Admin → Discounts. Compare-at "sale" prices don't revert on their own, so don't use them for timed deals unless an app schedules the price change.
- [ ] `vr-deals` takes the end time as a full date and time **with its timezone**, entered as ISO 8601 with offset, e.g. `2026-11-02T23:59:00+02:00` (store timezone Africa/Johannesburg). The help text tells the merchant to copy it exactly from the discount's end time.
- [ ] Before the end: show the countdown. After the end: hide the whole countdown, plus the deal badge if the section is the only thing promoting it. Never show 00:00:00 or a negative time.
- [ ] Test it with an end time a few minutes ahead: check the timer hits zero and hides at the same moment the discount stops applying at checkout.

---

## 5. Design tokens into theme settings (phase 2)

- [ ] **Colour schemes** (`config/settings_data.json`):
  - scheme-1: cream `#faf7f4` background, ink `#241d26` text, plum `#2e1a33` buttons
  - scheme-2: white cards
  - scheme-3: stone `#efe9e3` for the hero
  - scheme-4: plum background for the footer and newsletter
- [ ] Accent `#c8415f` / `#a82f4b` hover as CSS custom properties in `assets/vr-base.css`. **Rule: only one accent element per screen.**
- [ ] **Fonts:** Georgia isn't in Shopify's font picker. Either choose a close serif from the picker, or set the heading font stack in CSS (`Georgia, 'Times New Roman', serif`). Body uses the system sans stack. Two typefaces at most.
- [ ] **Page width:** 1180px. Section padding 64px on desktop, 48px on mobile. Gaps 18px / 24px.
- [ ] **Breakpoints: use Dawn's, not the spec's.** The spec says 640 / 860px; Dawn's header, menu drawer and product grids switch at **750px** (mobile to tablet) and **990px** (to desktop navigation), and these are baked into Dawn's own CSS. Changing them would mean overriding Dawn everywhere. Decision:
  - **Navigation:** the desktop menu shows from **990px** (Dawn); below that it's the menu drawer.
  - **Product grids:** 2 columns below 750px, 3 columns 750–989px, 4 columns from 990px (spec's "4 on desktop" holds; tablet gets 3).
  - **Categories (custom `vr-categories`):** 2 columns below 640px, 3 from 640px, as in the spec. It's our own section, so the spec breakpoint can be kept.
  - Update `design-spec.md` §8 to match, so the two documents agree.
- [ ] **Buttons:** primary is plum and turns accent on hover; ghost is outline and fills plum on hover. Minimum height 44px. Uppercase 14px, 0.08em tracking.
- [ ] **Focus ring:** 2px accent with a 3px offset. `prefers-reduced-motion` turns off smooth scroll and animations.
- [ ] **Exactly one `h1` per page, and which element it is depends on the page:**
  - homepage: the hero heading
  - product page: the product title (Dawn already does this)
  - collection page: the collection title
  - About / Help / content pages: the page title
  - blog: the blog title; article: the article title
  - cart: "Your cart"; 404: the not-found heading

  Every other section heading is an `h2`. Custom sections must never output an `h1` except `vr-hero`, and `vr-hero` is only used on the homepage.

---

## 6. Store setup in Shopify Admin (phase 3)

- [ ] Plan, payment provider (see §2.6), currency, taxes, shipping zones and rates, including the free-shipping threshold from the mockups
- [ ] Products with **4:5 photos**, SKUs, stock, tags (`new`, `best-seller`), compare-at prices for deals
- [ ] Collections: one per mockup category, plus "New arrivals" and "Weekly deals"
- [ ] Menus: main menu and footer menus (shop / help / legal)
- [ ] Pages: About, Help, Contact; assign `page.about` / `page.help` templates
- [ ] Policies: refund, privacy, terms, shipping, contact. These need checking before publishing (spec §10).
- [ ] Discount code for "10% off first order" if the newsletter promises one
- [ ] Notifications and checkout branding (logo, colours)
- [ ] **Store name** set once and used the same everywhere (theme, policies, Google, socials). SerenQ had "By SerenQ" vs "SerenQ" mismatches that caused Merchant Center trouble.
- [ ] Turn off the store password only when ready. Google Merchant Center can't review a password-protected store.

Like Paws & Play, page and blog content can be created through the Admin API from JSON files in `tools/`, so it's repeatable.

---

## 7. Testing (phase 4)

- [ ] `shopify theme check` clean (save the output to `tools/`)
- [ ] `shopify theme dev --store <store>` for live preview. If port 9292 is busy, use another (`--port 9393`).
- [ ] Headless Edge screenshots of every page at **360, 390, 768, 820, 1024, 1440**. Check `document.documentElement.scrollWidth === clientWidth`, meaning no sideways scroll. Paws & Play's `tools/check-*.cjs` scripts can be adapted.
- [ ] Tablet (750–989px) treated as its own breakpoint, not as desktop

**Shopping functions (test with real products in the dev store):**
- [ ] A product with **several variants**: the picker updates price, image, stock line and URL; quick add on a card opens the variant modal instead of adding the wrong variant
- [ ] An **unavailable / sold-out variant**: shown as unavailable, add to cart disabled, card says "Sold out"
- [ ] Quantity rules / limits, if any are used
- [ ] **Cart:** add, change quantity, remove the last item (empty-cart state), the cart drawer and the cart page both update, the cart count in the header updates
- [ ] **Search:** predictive search dropdown, search results page, a search with no results
- [ ] **Collection filters and sorting:** apply, combine and clear filters; results update without errors; filters work on phones
- [ ] **Forms:** newsletter and contact, with a successful submit and with errors (empty or invalid email). The error messages show and are readable.
- [ ] **Keyboard only:** tab through the header, menu drawer, cards, quick-add modal, cart drawer, FAQ and age gate. Focus ring is visible, focus is trapped in modals and returns when they close, Esc closes them.
- [ ] **Theme editor:** add, remove, reorder and edit each `vr-` section and block, and check it re-renders without a page reload or console errors (sections must re-initialise any JS on `shopify:section:load`)

**Feature specific:**
- [ ] Age gate (if built): once per session, keyboard accessible, readable on phones, doesn't hide content from search engines more than needed
- [ ] Countdown: no layout jump, hides exactly at the discount's end time (see "Deals must be real")
- [ ] **Test order** end to end with a discount code applied, then refund it
- [ ] Lighthouse on home, collection and product pages

---

## 8. Deploy (phase 5)

- [ ] Push to an **unpublished** theme first: `shopify theme push --store <store> --unpublished --theme "Vibe-ration v1"`
- [ ] Check it in the theme editor and preview, on a real phone
- [ ] Optional: connect the GitHub branch through Admin → Themes → Add theme → Connect from GitHub. Once connected, theme-editor changes commit back to that branch, so pull before editing.
- [ ] Publish only after the test order and checks pass

---

## 9. Gotchas already learned (SerenQ and Paws & Play)

- **Don't rebuild Dawn's commerce features.** Restyle main-product, cart and collection grid; never reimplement them. Paws & Play's first standalone build had to be thrown away for this reason.
- **Card wrappers and scroll rows need `position: relative`.** Dawn's price snippet has absolutely-positioned hidden labels that stretch the page sideways on phones otherwise.
- **Give grid and flex items `min-width: 0`**, or they overflow at tablet widths.
- **Before changing a custom section's settings** (renaming or removing an id), search every `templates/*.json` and `sections/*-group.json` for that section, or the theme editor breaks.
- **JSON templates belong to the theme editor.** Pull them from the store before editing and pushing, or you'll overwrite your own editor changes.
- **Use `--only <file>` when pushing to a live theme**, so nothing else is touched.
- **The Shopify CLI rejects custom domains:** always use the `.myshopify.com` address.
- **Videos can't be uploaded on a trial plan.** Pick a plan before adding video sections.
- **Verify the active Shopify store and theme before every write.** Use the supplied `.myshopify.com` address and explicit unpublished theme ID.
- **For Google Merchant Center:** the business name, address, phone, policies, shipping costs and delivery times on the site must exactly match what's entered in Merchant Center.

---

## 10. Suggested order of work in the new window

1. Answer §2 decisions → 2. §3 setup and first commit (local work can start before the store address is known; only preview and deploy need it) → 3. tokens/settings (§5) → 4. adapt Dawn's `card-product` + build `vr-hero` → 5. remaining homepage sections → 6. product / collection / cart restyle → 7. pages and age gate → 8. Admin content (§6) → 9. testing (§7) → 10. unpublished push and review (§8).
