# @maxigarcia/eslint-config

ESLint config for JavaScript and TypeScript projects.

This package is a wrapper around [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) with a small set of default style overrides. It targets [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files) (`eslint.config.js`).

`eslintConfig(options, ...userConfigs)` forwards to antfu. Defaults below are overridable through `options`.

## Install

```bash
npm install -D @maxigarcia/eslint-config
```

## Usage

Create an `eslint.config.js` (or `eslint.config.mjs`) file:

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig();
```

Extra config objects are passed through as additional antfu arguments:

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig(
  {
    typescript: true,
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
);
```

## Customization

You can pass the same options supported by `@antfu/eslint-config`:

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig({
  typescript: true,
  stylistic: {
    semi: false,
  },
});
```

### Tailwind CSS

Opt in with `tailwindcss: true`. Off by default.

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig({
  tailwindcss: true,
});
```

### Astro

`astro: true` enables Astro linting. `antfu/reasonable-newline` stays on for frontmatter and `<script>`, so `eslint --fix` can break complex ternaries.

Astro Prettier (`prettier-plugin-astro`) is opt-in via `formatters.astro`. It is not enabled by `astro: true` alone — Prettier reformats `<script>` JS and circular-fixes against `antfu/reasonable-newline` on short complex ternaries.

When `formatters.astro` is on, stylistic defaults match JS/TS (`quotes: 'single'`, `semi: true`, `indent: 2`), `htmlWhitespaceSensitivity: 'ignore'` expands hugged inline tags, `astroSkipFrontmatter: true` leaves frontmatter to ESLint, and template attributes use double quotes (`jsxSingleQuote: false`).

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig({
  astro: true,
  // formatters: { astro: true }, // optional template Prettier; can conflict in <script>
});
```

## What this wrapper adds by default

### Stylistic

- `stylistic.indent: 2`
- `stylistic.semi: true`
- `stylistic.quotes: 'single'`

Override with `options.stylistic`.

### Style rules

- `style/brace-style: ['error', '1tbs']`
- `style/arrow-parens: ['error', 'always']`
- `style/no-multiple-empty-lines` with `max: 1`, `maxBOF: 0`, `maxEOF: 0`

### Imports

`no-restricted-imports` blocks `../../` and deeper. Use the `@/` alias instead. One-level parent (`../`), sibling (`./`), and alias imports are allowed.

Override with `options.rules`.

### React

These rules are turned off so you can manage hooks and effects yourself:

- `react/exhaustive-deps`
- `react/set-state-in-effect`

### Formatters

- HTML
- Markdown (`prettier`)
- CSS

HTML and Astro attributes use double quotes. JS strings and imports use single quotes.

Astro Prettier is opt-in with `formatters: { astro: true }`. Override with `options.formatters`.
