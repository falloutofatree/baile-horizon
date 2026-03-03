# Shopify Horizon Theme: Upgrade-Safe Customization Guidelines

When customizing the Horizon theme, follow these rules to ensure changes survive Shopify's automatic theme upgrades. The upgrader replaces base theme Liquid/CSS/JS files wholesale with the new version, but preserves custom files and template JSON configs.

## Rules

1. **Never modify base theme Liquid files directly if avoidable.** Files like `sections/main-blog-post.liquid`, `snippets/product-information-content.liquid`, and `blocks/_blog-post-featured-image.liquid` ship with Horizon and will be overwritten on upgrade. Instead:
   - Create custom sections (e.g. `sections/custom-blog-post.liquid`) and point your template JSON to use them. Shopify won't touch files that don't exist in the base theme.
   - Create custom snippets/blocks with unique names rather than editing the originals.

2. **Put CSS overrides in `assets/custom.css`.** Rather than modifying CSS inside base Liquid files (via `{% stylesheet %}` blocks), write override rules in `custom.css`. Use specific selectors to override base theme styles. This file is custom and won't be replaced.

3. **Template JSON files (`templates/*.json`) are generally safe.** Shopify treats these as store-specific configuration data and preserves them across upgrades. However, if you reference a schema setting that no longer exists in the upgraded section's schema, Shopify may strip that setting from the JSON.

4. **Custom JS/CSS asset files are safe.** Files like `assets/accordion-custom.js` or `assets/custom.css` that don't exist in base Horizon are left untouched.

5. **Schema defaults in base blocks will reset but usually don't matter.** If you change a `default` value in a base block's schema (e.g. image ratio from `"adapt"` to `"square"`), the upgrade will revert it. But this only affects new block instances — existing pages use the values stored in template JSON, which are preserved.

## Summary

Keep all customizations in custom-named files whenever possible. Use `custom.css` for style overrides. Treat base theme files as read-only.
