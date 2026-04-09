# CLAUDE.md

## Project

This store is based on the [Shopify Horizon theme](https://github.com/Shopify/horizon).

Follow Horizon conventions when making changes: server-rendered Liquid first, vanilla Web Components (via `assets/component.js`), theme blocks as first-class components, declarative `on:{event}` binding, `@theme/*` import maps, and native HTML over custom JS. See Shopify's `.cursor/rules/` for detailed standards.

Edit `.liquid`, `.js`, `.css`, and `.json` files directly. No build step.

## Priorities

When tradeoffs arise, prioritize in this order:

1. Correctness and merchant safety
2. Accessibility and performance
3. Horizon conventions and upgradeability
4. Minimal code and dependencies

## Workflow

- **Pull before you start.** Always pull the latest before making changes. If you can't, surface it as a blocker and stop.
- **Make the smallest correct change.** Prefer the narrowest implementation that solves the problem cleanly.
- **Commit theme updates raw before fixing them.** Commit upstream theme updates as-is first, then fix regressions in follow-up commits.
- **Run Shopify Theme Check.** Lint theme files before finalizing changes.
- **Explain impact clearly.** Summarize the change, any merchant-facing effects, and any follow-up work or risks.

## Implementation Guidelines

- **Minimize core file edits.** Prefer Horizon-native extension patterns and additive files. Edit core files only when necessary, and keep diffs minimal for easier upstream merges.
- **Never mutate existing schema IDs.** In `{% schema %}` blocks, never change existing `id` values. Add new settings and deprecate old ones instead of renaming.
- **Maintain accessibility.** Meet WCAG 2.1 AA with semantic HTML, minimal ARIA, visible focus states, and full keyboard operability.
- **Maintain internationalization.** Do not hardcode user-facing strings. Use translation keys for storefront text (`{{ 'key' | t }}`) and `t:` for translatable schema/editor text.
- **Scope CSS to components.** Use component-scoped CSS, BEM-style naming, component-namespaced custom properties, and container queries over viewport breakpoints where practical.
- **Respect shared theme state.** Prefer existing Horizon/native events over manual DOM patching or custom state trackers.
- **Protect core conversion flows.** Any changes touching cart UI, cart APIs, add-to-cart behavior, or checkout integrations must be explicitly flagged for manual QA. Ensure custom JavaScript does not block, delay, or race standard form submissions.
- **Protect performance.** Keep changes performance-neutral or better. Prefer native browser APIs and Horizon patterns over external libraries where practical, and avoid unnecessary JavaScript, layout shift, and unnecessary dependencies.
- **Exclude heavy assets.** Do not parse or edit compressed files, images, or minified third-party scripts in `assets/` unless explicitly instructed.
- **Never commit or deploy `config/settings_data.json`.** It contains live merchant settings. Exclude it so settings flow one way: admin to local, never pushed back.

## Definition of Done

Done means:

- Shopify Theme Check passes.
- New or changed UI is keyboard operable and preserves visible focus.
- No meaningful performance regression.
- Changes touching cart, add-to-cart, or checkout flows are explicitly flagged for manual QA.
- Any required merchant/admin follow-up is called out explicitly.
