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

When `astro: true`, this wrapper also enables Astro formatting (`prettier-plugin-astro`) with the same stylistic defaults as JS/TS (`quotes: 'single'`, `semi: true`, `indent: 2`) and sets `htmlWhitespaceSensitivity: 'ignore'` so hugged inline tags are expanded.

JS strings and imports use single quotes. HTML and Astro template attributes use double quotes (`jsxSingleQuote: false`).

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig({
  astro: true,
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

Astro formatting is added only when `astro: true`. Override with `options.formatters`.
