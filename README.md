# `@voidzero-dev/doc-kit-theme`

The VoidZero design for [doc-kit](https://github.com/nodejs/doc-kit) sites: the design tokens, typography, Markdown and code styles, and the shell components (navigation bar, sidebar, outline, theme toggle, search, code blocks and tabs, alerts) of the VoidZero project sites, for doc-kit's `html` generator.

> [!WARNING]
> **This is a temporary home.** This repository exists so that [rolldown.rs](https://rolldown.rs) can move to doc-kit while the theme is figured out; it is meant to move under the [`@voidzero-dev`](https://github.com/voidzero-dev) organization and npm scope, or be replaced by whatever VoidZero prefers.
>
> **The VoidZero brand is VoidZero's.** The brand typefaces (APK Protocol, KH Teka Mono) and images (logos, marketing artwork) are owned or licensed by VoidZero Inc. and are **not** part of this repository or its license; neither is Inter, which keeps its own (SIL Open Font License). They are taken, as they are, from VoidZero's own published [`@voidzero-dev/vitepress-theme`](https://www.npmjs.com/package/@voidzero-dev/vitepress-theme) package, which this one depends on.

## Usage

Install it from Git, at a commit:

```sh
pnpm add -D github:ovflowd/voidzero-dev-doc-kit-theme#<commit>
```

Import the theme's stylesheet from your site's, and point Tailwind at your own components:

```css
@import '@voidzero-dev/doc-kit-theme/styles.css';
@source './components';
```

Use the configuration helpers in your doc-kit configuration:

```js
import { brandAssets, createBundler } from '@voidzero-dev/doc-kit-theme/config';

export default {
  html: {
    stylesheets: ['./theme/styles.css'],
    pathsToCopy: [brandAssets('rolldown')],
    // `pages` are your pages' files, whose code block names get icons
    bundler: createBundler({ pages }),
  },
};
```

Then compose your layouts from the components:

```jsx
import NavBar from '@voidzero-dev/doc-kit-theme/components/NavBar.jsx';
import SiteFooter from '@voidzero-dev/doc-kit-theme/components/SiteFooter.jsx';
```

## What's in here

- `styles/`: design tokens (`theme.css`), fonts, element defaults, the marketing sections, Markdown and Shiki styles, all written with Tailwind.
- `components/`: the navigation bar, sidebar, local navigation and outline, theme toggle, site footer, team members, Rive animations and a reference index, plus the theme's versions of doc-kit's alerts, code blocks, code tabs and search dialog (`createBundler()` swaps them in).
- `config.mjs`: the Vite bundler (Tailwind, code block icons, component overrides) and the brand assets to copy.

Layouts and anything specific to a site stay in the site.

## License

The code is [MIT](LICENSE). The VoidZero fonts and brand assets are not covered: see above.
