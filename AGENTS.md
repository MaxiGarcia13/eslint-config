# Agent instructions

This repo is `@maxigarcia/eslint-config`, a shareable ESLint **config** package (linter configuration), not an ESLint plugin. It wraps `@antfu/eslint-config` and exports `eslintConfig()` for consumers' `eslint.config.js`.

Keep the public API stable: `eslintConfig(options, ...restParams)` forwards to antfu. Defaults in `src/index.ts` (stylistic, style rules, React offs, formatters, `no-restricted-imports`) must remain overridable via `options`. Tailwind stays opt-in (`options.tailwindcss`).

Build with `npm run build` before linting this repo (`eslint.config.mjs` imports `./dist/index.js`).
