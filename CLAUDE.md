# CLAUDE.md — Baile Horizon Shopify Theme

This file provides context for AI assistants working on the **baile** Shopify theme (Horizon v3.3.1).

---

## Project Overview

This is a Shopify theme for the **baile** store (`shopbaile.myshopify.com`, theme ID `156549841119`). It is a fork/customization of Shopify's Horizon theme, focused on natural/organic product retail. All backend data (products, customers, orders, settings) lives in Shopify — this repository is a **pure frontend layer**.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Templating | Liquid (Shopify) |
| Scripting | Vanilla JavaScript (ES2020 modules) |
| Styling | CSS3 with CSS custom properties (variables) |
| Types | JSDoc + `.d.ts` TypeScript definitions |
| Config | TOML, JSON |
| Fonts | WOFF2 (Americana, Quattrocento) |
| CLI tooling | Shopify CLI |

No Node.js build step, bundler, or test framework is used. Assets are served directly from Shopify's CDN.

---

## Directory Structure

```
baile-horizon/
├── assets/          # JS modules, CSS files, SVG icons, WOFF2 fonts
├── blocks/          # Reusable section blocks (e.g., _product-card.liquid)
├── config/          # settings_schema.json (theme editor settings)
├── layout/          # Page-level layouts: theme.liquid, password.liquid
├── locales/         # i18n translations for 50+ languages
├── sections/        # Dynamic page sections (hero, header, product-list, etc.)
├── snippets/        # Shared partials (prefix _snake_case.liquid)
├── templates/       # Page templates (product.json, collection.json, etc.)
├── shopify.theme.toml  # Shopify CLI config (store URL, theme ID)
├── .gitignore
├── .shopifyignore
└── README.md        # Shopify-specific workflow guide
```

### Key Files

| File | Purpose |
|---|---|
| `layout/theme.liquid` | Root HTML layout wrapping every page |
| `config/settings_schema.json` | Defines all global theme settings available in the Shopify editor |
| `assets/base.css` | Main stylesheet (~125 KB) with CSS custom properties |
| `assets/custom.css` | Store-specific overrides |
| `assets/component.js` | Base `Component` class extended by all custom elements |
| `assets/utilities.js` | Shared utility functions (~800 lines) |
| `sections/header.liquid` | Site header and navigation (~41 KB) |
| `sections/hero.liquid` | Hero banner section (~41 KB) |
| `sections/product-list.liquid` | Product grid / carousel (~31 KB) |
| `snippets/theme-styles-variables.liquid` | Outputs CSS custom properties from theme settings |
| `snippets/color-schemes.liquid` | Color scheme CSS generation |

---

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Sections | `snake-case.liquid` | `product-list.liquid` |
| Snippets | `_snake-case.liquid` (underscore prefix) | `_product-card.liquid` |
| Blocks | `_snake-case.liquid` (underscore prefix) | `_image.liquid` |
| JS files | `kebab-case.js` | `quick-add-modal.js` |
| CSS classes | BEM-like, hyphenated | `.product-card__title` |
| i18n keys | `t:namespace.key` in Liquid | `t:sections.hero.blocks.heading.name` |
| Settings IDs | `snake_case` in JSON schemas | `"id": "color_scheme"` |

---

## Liquid Patterns

### Section settings
Every section defines its schema at the bottom inside `{% schema %}` … `{% endschema %}`. Settings are accessed with `section.settings.setting_id`.

### Translations
All user-facing strings use `t:` keys resolved from `/locales/*.json`:
```liquid
{{ 'general.cart.add_to_cart' | t }}
```

### Color schemes
Sections accept a `color_scheme` setting. The active scheme's CSS vars are applied with:
```liquid
{% render 'color-schemes' %}
```

### Blocks
Section blocks are rendered with `{% for block in section.blocks %}` and typed using `block.type`. Block Liquid files live in `/blocks/`.

### Asset URLs
Always reference assets through the `asset_url` filter so Shopify serves them from its CDN:
```liquid
{{ 'base.css' | asset_url | stylesheet_tag }}
{{ 'component.js' | asset_url | script_tag }}
```

---

## JavaScript Architecture

### Web Components
JavaScript components are custom HTML elements built on a `Component` base class (`assets/component.js`). Each component:
- Extends `Component` (which extends `HTMLElement`)
- Is registered with `customElements.define('component-name', ClassName)`
- Uses **declarative shadow DOM** or light DOM depending on encapsulation needs

### Refs pattern
DOM elements inside a component are accessed via the `ref` attribute, avoiding fragile class/ID selectors:
```html
<button ref="submitBtn">Add to cart</button>
```
```js
this.refs.submitBtn.addEventListener('click', ...)
```

### Custom Events
Global communication uses a `ThemeEvents` dispatcher in `assets/utilities.js`:
```js
ThemeEvents.dispatch('cart:add', { item })
ThemeEvents.on('cart:update', handler)
```

Key event names: `cart:add`, `cart:update`, `cart:error`, `variant:update`.

### Performance
- Heavy work is deferred with `requestIdleCallback` (with polyfill)
- View Transitions API is used for smooth page navigation
- Low-power device detection skips animations where appropriate

---

## CSS Architecture

- Design tokens are CSS custom properties defined in `snippets/theme-styles-variables.liquid` and output inline into `<head>`.
- Color schemes override the base tokens per section using scoped custom properties.
- `assets/base.css` provides the full design system; `assets/custom.css` holds store-specific overrides. Edit `custom.css` for baile-specific style changes, not `base.css`.
- Breakpoints are mobile-first.

---

## Localization

Translations for 50+ languages live in `/locales/`. Each language has:
- `{lang}.json` — storefront-facing strings
- `{lang}.schema.json` — strings used in the theme editor schema

`en.default.json` is the canonical source of truth.

---

## Development Workflow

### Prerequisites
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installed and authenticated
- Access to the `shopbaile.myshopify.com` store

### Local preview
```bash
shopify theme dev
```
Opens a live-reloading local preview connected to the live store's data.

### Pulling admin changes
Merchants may change settings or content through the Shopify Admin. Always pull before starting work to avoid overwriting changes:
```bash
shopify theme pull
git diff          # Review what changed
git add . && git commit -m "chore: sync admin changes"
```

### Deploying changes
```bash
git add <files>
git commit -m "feat: description of change"
git push origin <branch>
shopify theme push    # Pushes all files EXCEPT settings_data.json (per .shopifyignore)
```

**Never commit or push `config/settings_data.json`** — it is merchant-owned live data and is excluded by both `.gitignore` and `.shopifyignore`.

### Branch strategy
- `master` — production-ready theme code
- Feature branches for non-trivial changes; merge to `master` then push

---

## Settings and Configuration

- **Theme settings** (colors, fonts, layout) are configured through the Shopify Admin theme editor, not code. The schema is defined in `config/settings_schema.json`.
- **`shopify.theme.toml`** stores the CLI environment config (store URL and theme ID). Do not change theme IDs without confirming the target environment.
- No `.env` file or environment variables are needed — Shopify handles all secrets via `shopify auth login`.

---

## Shopify API Integration

The theme integrates with Shopify's Storefront endpoints via fetch calls in JavaScript:

| Feature | Endpoint |
|---|---|
| Add to cart | `routes.cart_add_url` |
| Update cart | `routes.cart_change_url` |
| Cart drawer | `routes.cart_url` |
| Predictive search | `routes.predictive_search_url` |
| Product recommendations | Shopify native |

`routes.*` are global JS variables output by Liquid in `layout/theme.liquid`.

---

## Important Guardrails for AI Assistants

1. **Do not generate or modify `config/settings_data.json`** — this is merchant live data.
2. **Do not introduce Node.js tooling** (webpack, Vite, npm scripts) without explicit request — the theme has no build step by design.
3. **Preserve `t:` i18n keys** in section schemas — don't hardcode English strings where translation keys exist.
4. **Respect `.shopifyignore`** — files listed there are intentionally excluded from Shopify deployments.
5. **Test changes via `shopify theme dev`** — there is no automated test suite.
6. **Keep `assets/base.css` unchanged** where possible — prefer `assets/custom.css` for store-specific style overrides.
7. **Maintain Web Component patterns** when adding new interactive elements — extend `Component`, use refs, use `ThemeEvents` for cross-component communication.
8. **All section schema strings must have `t:` keys** so they remain translatable across 50+ languages.
