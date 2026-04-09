# CLAUDE.md

## Project

This store uses the stock [Shopify Horizon theme](https://themes.shopify.com/themes/horizon). Follow standard Horizon theme conventions and architecture (Web Components via `assets/component.js`, declarative event binding with `on:{event}` attributes, `@theme/*` import maps, Section Rendering API, etc.) when making changes.

## Development

Edit `.liquid`, `.js`, `.css`, and `.json` files directly — no build step required.

```bash
shopify theme dev    # Local dev server with hot reload
shopify theme push   # Deploy to Shopify
shopify theme pull   # Pull latest from Shopify admin
```

## Editor Tooling

`assets/jsconfig.json` enables `checkJs: true` with `strictNullChecks` and maps `@theme/*` paths for IDE support. Use JSDoc annotations to match the existing codebase style.

## Rules of Thumb

- **Pull before you start.** Run `shopify theme pull && git diff` before starting work to catch admin-side or Theme Store changes. Commit those before layering on new work.
- **Minimize stock file edits.** Prefer adding new files (sections, snippets, blocks, JS/CSS) over modifying stock Horizon files. When stock files must be changed, keep edits small so Theme Store updates are easier to merge.
- **Commit raw theme updates before fixing them.** When pulling in a Theme Store update, commit it as-is first, then fix regressions (broken sections, missing settings, overwritten custom code) in separate commits. This keeps the vendor diff reviewable.
- **Default new settings to their intended production state.** Don't ship features OFF that you'll immediately enable in the admin — that creates unnecessary divergence between code and live settings.
- **Verify with `shopify theme dev`.** Use the local dev server to verify changes work before pushing.

## Never Commit

- `config/settings_data.json` — live merchant settings (git-ignored and shopify-ignored). Committing this can overwrite store customizations.
- Note: `.shopifyignore` also blocks `settings_data.json` from `shopify theme push`, so settings only flow one way (admin to local via `pull`, never pushed back). This diverges from the upstream [shopify-theme-init](https://github.com/falloutofatree/shopify-theme-init) default, which allows settings to sync on push.
