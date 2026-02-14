# CLAUDE.md

## Project

**Baile-Horizon** is the stock [Shopify Horizon theme](https://themes.shopify.com/themes/horizon) (v3.3.1) for `shopbaile.myshopify.com`. No customizations have been made to the theme code yet — all JS, CSS, Liquid, and settings are as shipped from the Theme Store.

Follow standard Horizon theme conventions and architecture (Web Components via `assets/component.js`, declarative event binding with `on:{event}` attributes, `@theme/*` import maps, Section Rendering API, etc.) when making changes.

## Development

No build step, no npm, no linter, no tests. Edit `.liquid`, `.js`, `.css`, and `.json` files directly.

```bash
shopify theme dev    # Local dev server with hot reload
shopify theme push   # Deploy to Shopify
shopify theme pull   # Pull latest from Shopify admin
```

See `README.md` for the full git-based workflow (syncing admin changes, handling Theme Store updates).

## Editor Tooling

`assets/jsconfig.json` enables `checkJs: true` with `strictNullChecks` and maps `@theme/*` paths for IDE support. Use JSDoc annotations to match the existing codebase style.

## Never Commit

- `config/settings_data.json` — live merchant settings (git-ignored and shopify-ignored). Committing this can overwrite store customizations.
