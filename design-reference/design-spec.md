# Store Design Spec (v2)

Status: draft. Placeholder names, prices and copy throughout.

## 1. Brand feel
Warm, private, confident. Discreet rather than flashy. Nothing that looks like a novelty shop.

## 2. Colour tokens

| Token | Hex | Use |
|---|---|---|
| --plum | #2e1a33 | Headings, primary buttons, footer, announcement bar |
| --accent | #c8415f | Eyebrow labels, sale tags, hover on buttons, focus ring |
| --accent-dark | #a82f4b | Hover state on accent buttons |
| --cream | #faf7f4 | Page background |
| --stone | #efe9e3 | Hero, image placeholders, countdown boxes |
| --white | #ffffff | Cards, header, trust and newsletter sections |
| --line | #e4dcd4 | Borders and dividers |
| --ink | #241d26 | Body text |
| --muted | #6f6671 | Secondary text, meta lines |

Rule: the accent is for emphasis only. If more than one thing on a screen is accent-coloured, remove one.

## 3. Contrast check (WCAG AA)

| Pair | Ratio | Result |
|---|---|---|
| Accent on white (tags, eyebrows) | ~4.8:1 | Passes for normal text |
| White on accent (buttons, sale tags) | ~4.8:1 | Passes |
| Muted on cream (meta text) | ~5.1:1 | Passes |
| Muted-light on plum (footer, newsletter fine print) | ~6.2:1 | Passes |

Do not use the accent for body text smaller than 16px on cream. Use --ink or --muted.

## 4. Typography

- Headings: Georgia, serif. Weight normal. Sizes 26 to 56px, scaling with screen width.
- Body and UI: system sans-serif stack. 16px base, 1.55 line height.
- Eyebrow labels: 12px, uppercase, 0.18em letter spacing, accent colour.
- Buttons: 14px, uppercase, 0.08em letter spacing.

Rule: no more than two typefaces. Do not add a third for decorative text.

## 5. Spacing and layout

- Container: 1180px max, 20px side padding.
- Section padding: 64px vertical on desktop, reduce to 48px on mobile if the page feels long.
- Grid: 2 columns on mobile, 4 on desktop for products. 3 columns for categories from 640px.
- Gaps: 18px mobile, 24px desktop between product cards.

## 6. Components

**Buttons**
- Primary: plum fill, white text. Hover: accent fill.
- Ghost: transparent, plum text and border. Hover: plum fill.
- Minimum height 44px for touch. Do not go smaller.

**Product card**
- Image ratio 4:5 for all products. Photos must be shot or cropped to this.
- Order: image, name, stock line, price, add-to-cart. Do not reorder.
- Tag (New, Best seller, -%) sits top-left on the image. Sale tags use accent, best sellers use plum.
- Out-of-stock: disabled button, label reads "Sold out".

**Countdown**
- Shows days, hours, minutes, seconds. Tabular numerals so digits do not jump.
- Only in the Weekly deals section. Not repeated elsewhere.

**FAQ**
- Native details and summary elements. Keyboard accessible without extra code.
- Plus sign opens, minus sign closes.

**Age gate**
- Full-screen, one question, two choices. Remembered for the browser session only.
- Remove it entirely if the products do not require it. Do not leave a dormant version in the code.

## 7. Imagery

- All product and category images: 4:5 for products, landscape or square for categories.
- Plain or neutral backgrounds. Consistent lighting. No text overlaid on photos.
- Until real photos exist, the grey box with a "Photo" label is the placeholder. Do not use coloured gradients as stand-ins.

## 8. Breakpoints

- Mobile: under 640px (default styles).
- Tablet: 640px and up (categories in 3 columns).
- Desktop: 860px and up (navigation visible, products in 4 columns).

## 9. Accessibility

- Visible focus ring in accent, 2px, 3px offset.
- Touch targets at least 44px.
- Respects reduced-motion preference (disables smooth scrolling and toast animation).
- Semantic headings: one h1 in the hero, h2 for each section.

## 10. What is still placeholder
- Brand name and logo wordmark
- All product names, prices, stock status and tags
- Category names and images
- Shipping threshold and promo codes
- Help and policy text (needs checking before publishing)
- Product photography (none yet)

## 11. Next design decisions for you
1. Real logo, or keep the text wordmark?
2. Photo style: studio on plain background, or lifestyle?
3. Keep the rose accent or try a deeper red or a teal?
