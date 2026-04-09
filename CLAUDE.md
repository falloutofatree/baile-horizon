# CLAUDE.md

## Project

This store uses the stock [Shopify Horizon theme](https://github.com/Shopify/horizon). Follow standard Horizon conventions when making changes: server-rendered Liquid first, vanilla Web Components (via `assets/component.js`), theme blocks as first-class components, declarative `on:{event}` binding, `@theme/*` import maps, and native HTML elements over custom JS. See Shopify's `.cursor/rules/` in the Horizon repo for detailed standards.

## Development

Edit `.liquid`, `.js`, `.css`, and `.json` files directly — no build step required.

## Rules of Thumb

- **Pull before you start.** Before starting work, pull the latest theme files and check for admin-side or theme update changes. Commit those before layering on new work.
- **Minimize stock file edits.** Prefer adding new files (sections, snippets, blocks, JS/CSS) over modifying stock Horizon files. When stock files must be changed, keep edits small so theme updates are easier to merge.
- **Commit raw theme updates before fixing them.** When pulling in a theme update, commit it as-is first, then fix regressions (broken sections, missing settings, overwritten custom code) in separate commits. This keeps the vendor diff reviewable.
- **Default new settings to their intended production state.** Don't ship features OFF that you'll immediately enable in the admin — that creates unnecessary divergence between code and live settings.

## Never Commit

- `config/settings_data.json` — live merchant settings (git-ignored and shopify-ignored). Committing this can overwrite store customizations.
- Note: `.shopifyignore` also blocks `settings_data.json` from deploys, so settings only flow one way (admin to local via pull, never pushed back).
