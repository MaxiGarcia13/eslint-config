# @maxigarcia/eslint-config

ESLint config for JavaScript and TypeScript projects.

This package is a wrapper around [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) with a small set of default style overrides.

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

### Tailwind CSS option

Enable Tailwind CSS linting by setting `tailwindcss: true`:

```js
import { eslintConfig } from '@maxigarcia/eslint-config';

export default eslintConfig({
  tailwindcss: true,
});
```

## What this wrapper adds by default

- `stylistic.indent: 2`
- `stylistic.semi: true`
- `stylistic.quotes: 'single'`
- `style/brace-style: ['error', '1tbs']`
- `style/arrow-parens: ['error', 'always']`
- `style/no-multiple-empty-lines` with max 1 line
- Formatters enabled for HTML and Markdown (`prettier`)
