# CLAUDE.md

## Project Overview

**Baile-Horizon** is a Shopify Liquid theme (Horizon theme, v3.3.1) for the store `shopbaile.myshopify.com`. It is a server-rendered storefront with client-side enhancements using vanilla JavaScript Web Components. There is no build step, no bundler, no npm dependencies, and no test framework.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Server templates | Shopify Liquid |
| Frontend | Vanilla JS (ES2020+) with Web Components (Custom Elements) |
| Type checking | JSDoc annotations + `checkJs: true` in `assets/jsconfig.json` |
| Styling | CSS with custom properties and nesting (`assets/base.css`) |
| Module system | ES modules with import maps (defined in `snippets/scripts.liquid`) |
| Deployment | Shopify CLI (`shopify theme push`) |

## Directory Structure

```
assets/          # JS, CSS, SVGs, type definitions (76 JS files, 1 CSS, 33 SVGs)
blocks/          # Reusable Liquid block components (94 .liquid files)
config/          # Theme settings schema (settings_schema.json)
layout/          # HTML wrapper templates (theme.liquid, password.liquid)
locales/         # i18n translations (30+ languages, 67 JSON files)
sections/        # Page sections with schemas (39 .liquid files)
snippets/        # Reusable Liquid partials (94 .liquid files)
templates/       # Page template definitions (13 JSON + 1 Liquid)
```

## Development Workflow

```bash
shopify theme pull          # Pull latest from Shopify admin
shopify theme dev           # Local dev server with hot reload
shopify theme push          # Deploy to Shopify (skips settings_data.json)
```

There is no `npm install`, no build command, no linter, and no test suite. Changes to `.liquid`, `.js`, `.css`, and `.json` files are deployed directly.

## Key Architecture Concepts

### Web Components

All interactive UI is built with Custom Elements extending a base `Component` class (`assets/component.js`):

- `Component` extends `DeclarativeShadowElement` extends `HTMLElement`
- Components use a **refs system**: child elements with `ref="name"` attributes are auto-collected into `this.refs`
- Array refs use `ref="name[]"` syntax
- Mutation observers keep refs in sync with DOM changes
- Components can declare `requiredRefs` arrays for validation

### Declarative Event Binding

Events are bound via HTML attributes, not JS listeners:

```html
<button on:click="product-form-component/addToCart">Add to cart</button>
```

Format: `on:{event}="{selector}/{method}"` or `on:{event}="{selector}/{method}?{data}"`

Supported events: `click`, `change`, `select`, `focus`, `blur`, `submit`, `input`, `keydown`, `keyup`, `toggle`, `pointerenter`, `pointerleave`.

### Import Maps / Module System

JavaScript modules use `@theme/*` import paths mapped via an import map in `snippets/scripts.liquid`:

```javascript
import { Component } from '@theme/component';
import { fetchConfig } from '@theme/utilities';
```

The import map resolves `@theme/foo` to `{{ 'foo.js' | asset_url }}` (a Shopify CDN URL). This is configured in both the Liquid import map and `assets/jsconfig.json` for editor support.

### Custom Event System

Cross-component communication uses custom events dispatched on `document` (`assets/events.js`):

| Event Class | Event Name | Purpose |
|------------|-----------|---------|
| `VariantSelectedEvent` | `variant:selected` | Variant picker selection |
| `VariantUpdateEvent` | `variant:update` | Variant data loaded with HTML |
| `CartAddEvent` / `CartUpdateEvent` | `cart:update` | Cart item changes |
| `CartErrorEvent` | `cart:error` | Cart operation failures |
| `FilterUpdateEvent` | `filter:update` | Collection filter changes |
| `SlideshowSelectEvent` | `slideshow:select` | Slideshow slide changes |

### Section Rendering API

Dynamic page updates without full reloads use Shopify's Section Rendering API (`assets/section-renderer.js`) combined with DOM morphing (`assets/morph.js`). This powers AJAX filtering, cart updates, and search.

### Global Objects

Two global objects are available in JavaScript (defined in `snippets/scripts.liquid`, typed in `assets/global.d.ts`):

- `window.Shopify` — Store metadata (country, currency, locale, design mode)
- `window.Theme` — Theme-specific data (translations, routes, template info, utilities)

Key routes: `Theme.routes.cart_add_url`, `Theme.routes.cart_update_url`, `Theme.routes.predictive_search_url`

## Coding Conventions

### JavaScript

- ES2020+ syntax (async/await, optional chaining, nullish coalescing, private class fields with `#`)
- JSDoc type annotations for all public APIs (the project uses `checkJs: true` with `strictNullChecks`)
- Web Components registered with `customElements.define('tag-name', ClassName)`
- Component tag names end with `-component` by convention (e.g., `header-component`, `product-form-component`)
- No external JS frameworks or libraries — everything is vanilla
- Utility functions in `assets/utilities.js` (debounce, throttle, fetchConfig, view transitions, etc.)
- Performance-conscious: use `requestIdleCallback`, `requestAnimationFrame`, low-power device detection

### Liquid

- Sections define their schema inline via `{% schema %}...{% endschema %}`
- Blocks are in the `blocks/` directory, prefixed with `_` (e.g., `_card.liquid`, `_product-details.liquid`)
- Snippets are reusable partials included via `{% render 'snippet-name' %}`
- Translation keys use `t:` prefix in schemas (e.g., `"label": "t:settings.color"`)
- Runtime translations use `{{ 'key.path' | t }}`

### CSS

- Single main stylesheet: `assets/base.css`
- CSS custom properties extensively used (colors, spacing, typography)
- Logical properties (block/inline) for RTL language support
- Responsive breakpoint: 750px (`mediaQueryLarge` in utilities.js)

## Important Files

| File | Purpose |
|------|---------|
| `assets/component.js` | Base `Component` class for all Web Components |
| `assets/events.js` | Custom event classes (cart, variant, filter, etc.) |
| `assets/utilities.js` | Shared utilities (fetch, debounce, animations, view transitions) |
| `assets/morph.js` | DOM diffing/morphing for section updates |
| `assets/section-renderer.js` | Section Rendering API integration |
| `assets/global.d.ts` | TypeScript declarations for `Shopify` and `Theme` globals |
| `assets/jsconfig.json` | JS/TS compiler config (ES2020, strict checks, `@theme/*` paths) |
| `snippets/scripts.liquid` | Import map definition + script loading |
| `layout/theme.liquid` | Main HTML shell (head, body, header/footer groups) |
| `config/settings_schema.json` | All theme customization settings |

## Files to Never Commit

- `config/settings_data.json` — Live store settings (git-ignored, Shopify-ignored). Committing this can overwrite merchant customizations.
- `.env` / `.env.*` — Environment/secrets (git-ignored)
- `.shopify/` — CLI state directory (git-ignored)

## Shopify CLI Configuration

Configured in `shopify-theme.toml` (git-ignored via `.gitignore`):

```toml
[environments.default]
store = "shopbaile.myshopify.com"
theme = "156549841119"
```

## Common Patterns

### Creating a new Web Component

```javascript
import { Component } from '@theme/component';

class MyComponent extends Component {
  connectedCallback() {
    super.connectedCallback();
    // initialization logic
  }

  handleClick(event) {
    // method invoked via on:click="my-component/handleClick"
  }
}

if (!customElements.get('my-component')) {
  customElements.define('my-component', MyComponent);
}
```

### Making API requests

```javascript
import { fetchConfig } from '@theme/utilities';

const response = await fetch(Theme.routes.cart_add_url, {
  ...fetchConfig('json'),
  body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
});
```

### Listening for theme events

```javascript
import { ThemeEvents } from '@theme/events';

document.addEventListener(ThemeEvents.cartUpdate, (event) => {
  const { resource, data } = event.detail;
  // handle cart update
});
```

## Accessibility

The theme follows WCAG guidelines:
- ARIA labels throughout templates
- Keyboard navigation with focus trapping (`assets/focus.js`)
- Skip-to-content links in `layout/theme.liquid`
- Screen reader announcements for dynamic content
- `prefers-reduced-motion` respected for animations and view transitions
