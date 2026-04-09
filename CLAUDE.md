# CLAUDE.md

## Project

This store uses the stock [Shopify Horizon theme](https://github.com/Shopify/horizon). Follow standard Horizon conventions when making changes: server-rendered Liquid first, vanilla Web Components (via `assets/component.js`), theme blocks as first-class components, declarative `on:{event}` binding, `@theme/*` import maps, and native HTML elements over custom JS. See Shopify's `.cursor/rules/` in the Horizon repo for detailed standards.

## Development

Edit `.liquid`, `.js`, `.css`, and `.json` files directly — no build step required.

## Guidelines

- **Pull before you start.** Always pull the latest from the remote before making changes. If you can't pull, surface it as a blocker and stop.
- **Minimize stock file edits.** Prefer adding new files over modifying stock Horizon files. When stock files must be changed, keep edits small so theme updates are easier to merge.
- **Commit raw theme updates before fixing them.** When pulling in a theme update, commit it as-is first, then fix regressions in separate commits.
- **Default new settings to their intended production state.** Don't ship features OFF that you'll immediately enable in the admin.
- **Never commit or deploy `config/settings_data.json`.** It contains live merchant settings. Exclude it from both `.gitignore` and `.shopifyignore` so settings only flow one way — admin to local, never pushed back.
