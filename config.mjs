// Helpers for a doc-kit configuration using this theme.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { createViteBundler } from '@doc-kit/generator-react/html/bundlers/vite';
import tailwindcss from '@tailwindcss/vite';
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons';

const THEME = import.meta.dirname;

/**
 * The VoidZero brand assets: fonts and images, from the VitePress theme they
 * are published with. They are VoidZero's, and not part of this package.
 */
const BRAND_PACKAGE = dirname(
  createRequire(import.meta.url).resolve('@voidzero-dev/vitepress-theme/package.json'),
);

const BRAND = join(BRAND_PACKAGE, 'src/assets');

/** The VoidZero typefaces, which the theme's styles load from `/assets/fonts` */
const FONTS = join(BRAND_PACKAGE, 'src/fonts');

/** doc-kit's components this theme replaces, keeping the behavior doc-kit wires around them */
const OVERRIDES = {
  '@node-core/ui-components/Common/AlertBox': 'components/AlertBox.jsx',
  '@node-core/ui-components/Common/BaseCodeBox': 'components/CodeBox.jsx',
  '@node-core/ui-components/Common/Search/Modal': 'components/SearchModal.jsx',
  '@node-core/ui-components/MDX/CodeTabs': 'components/CodeTabs.jsx',
};

/** Logs of dependencies that are expected, and not worth reporting */
const IGNORED_LOGS = new Set([
  // Radix UI marks its modules as client components, which is meaningless
  // (and harmless) for doc-kit's bundles
  'MODULE_LEVEL_DIRECTIVE',
]);

/** The theme's stylesheet, for the site's own to import */
export const stylesheet = join(THEME, 'styles/index.css');

/**
 * The Vite bundler adapter, with its methods on the prototype and its options
 * in a private field. doc-kit posts the `html` configuration to its worker
 * threads, and a structured clone of this class carries neither, whereas the
 * plain object `createViteBundler()` returns fails to clone.
 */
class ViteBundler {
  #bundler;

  constructor(options) {
    this.#bundler = createViteBundler(options);
  }

  buildServer(context) {
    return this.#bundler.buildServer(context);
  }

  compile(code, fileName) {
    return this.#bundler.compile(code, fileName);
  }

  buildClient(context) {
    return this.#bundler.buildClient(context);
  }
}

/**
 * The names of the code blocks of the pages (```js displayName="vite.config.js"```).
 *
 * @param {string[]} pages The pages' files
 */
const codeBlockNames = (pages) => {
  const names = new Set();

  for (const page of pages) {
    const markdown = readFileSync(page, 'utf8');

    for (const [, name] of markdown.matchAll(/displayName="([^"]+)"/g)) {
      names.add(name);
    }
  }

  return [...names];
};

/**
 * `virtual:group-icons.css`: icons for the names of code blocks
 * (`package.json`, `pnpm`, …), from the VitePress plugin, with its dark icons
 * following `data-theme`.
 *
 * @param {string[]} pages The pages' files, whose code block names get icons
 */
const codeIcons = (pages) => {
  const id = 'virtual:group-icons.css';
  const icons = groupIconVitePlugin({ defaultLabels: codeBlockNames(pages) });

  return {
    name: 'voidzero-code-icons',
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load: async (source) => {
      if (source !== `\0${id}`) {
        return undefined;
      }

      const css = await icons.load(source);

      return css.replaceAll('html.dark', "[data-theme='dark']");
    },
  };
};

/**
 * Aliases replacing doc-kit's components with the theme's. They match whole
 * specifiers only: a plain string alias would also capture the components'
 * own files (`…/Search/Modal/index.module.css`).
 */
const overrideAliases = () => {
  const aliases = [];

  for (const [specifier, file] of Object.entries(OVERRIDES)) {
    const find = new RegExp(`^${specifier.replaceAll('/', '\\/')}$`);

    aliases.push({ find, replacement: join(THEME, file) });
  }

  return aliases;
};

/**
 * The bundler for doc-kit's `html` generator: Tailwind, code block icons and
 * the theme's components in place of doc-kit's.
 *
 * @param {{ pages: string[] }} options The pages' files
 */
export const createBundler = ({ pages }) =>
  new ViteBundler({
    plugins: [tailwindcss(), codeIcons(pages)],
    resolve: { alias: overrideAliases() },
    build: {
      rolldownOptions: {
        onLog(level, log, handler) {
          if (!IGNORED_LOGS.has(log.code)) {
            handler(level, log);
          }
        },
      },
    },
  });

/**
 * The brand assets of a VoidZero project, for doc-kit's `pathsToCopy`: the
 * fonts (`assets/fonts`), its logos, the VoidZero logo, and its marketing
 * images under `assets/brand/<project>`.
 *
 * @param {string} project The project (`rolldown`, `vite`, `oxc`, …)
 */
export const brandAssets = (project) => ({
  [FONTS]: 'assets/fonts',
  [join(BRAND, `logos/${project}-dark.svg`)]: `assets/brand/${project}-dark.svg`,
  [join(BRAND, `logos/${project}-light.svg`)]: `assets/brand/${project}-light.svg`,
  [join(BRAND, `icons/${project}-light.svg`)]: `assets/brand/${project}-icon-light.svg`,
  [join(BRAND, 'logos/voidzero-light.svg')]: 'assets/brand/voidzero-light.svg',
  [join(BRAND, project)]: `assets/brand/${project}`,
  [join(BRAND, 'vite/vite-by-voidzero.png')]: 'assets/brand/vite-by-voidzero.png',
});
