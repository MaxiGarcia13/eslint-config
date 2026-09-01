---
name: eslint-plugin-configs
description: Generate or update an ESLint plugin that exports rules and configs for ESLint v9 (flat) and v8 (eslintrc). Use when creating, repairing, or documenting plugin configs, recommended/strict presets, or consumer eslint.config.js / .eslintrc examples.
---

# ESLint plugin configs

Export one ESM plugin object. Output source (or diffs) plus matching consumer examples.

## Plugin shape

```js
const plugin = {
  meta: { name: PACKAGE_NAME, version, namespace: NAMESPACE },
  rules: RULES,
  configs: {},
}

plugin.configs = {
  'flat/recommended': [/* ... */],
  'legacy-recommended': { /* ... */ },
}

export default plugin
```

- `meta.namespace` prefixes rules, configs, and plugin registration.
- Rule keys in configs: `"${NAMESPACE}/${ruleId}"`.
- If configs reference `plugin`, create it with empty `configs` first, then assign. Never reference `plugin` before it exists.

## Config keys — pick one strategy

**A (new plugin):** `flat/<name>` and `legacy-<name>`.

**B (existing plugin):** keep legacy `<name>`; add `flat/<name>`. Never rename or drop a public legacy key.

Do not mix flat and legacy shapes in the same key. No colliding names.

## Flat (`flat/<name>`) — ESLint v9

Array of config objects. Register the plugin as an object:

```js
plugin.configs['flat/recommended'] = [{
  plugins: { [NAMESPACE]: plugin },
  rules: { [`${NAMESPACE}/some-rule`]: 'error' },
}]
```

Consumer extends `"${NAMESPACE}/recommended"` — drop the `flat/` prefix.

```js
import { defineConfig } from 'eslint/config'
import plugin from PACKAGE_NAME

export default defineConfig({
  plugins: { [NAMESPACE]: plugin },
  extends: [`${NAMESPACE}/recommended`],
})
```

## Legacy (`legacy-<name>` or `<name>`) — ESLint v8

Plain eslintrc object. Register the plugin as an array:

```js
plugin.configs['legacy-recommended'] = {
  plugins: [NAMESPACE],
  rules: { [`${NAMESPACE}/some-rule`]: 'error' },
}
```

Consumer: `"${NAMESPACE}/legacy-recommended"` (strategy A) or `"${NAMESPACE}/recommended"` (strategy B).

```json
{
  "plugins": ["<namespace>"],
  "extends": ["<namespace>/legacy-recommended"]
}
```

## ESLint semantics (do not misstate)

- v9: flat is default; `.eslintrc*` is deprecated; legacy only if `ESLINT_USE_FLAT_CONFIG=false`.
- v8: `.eslintrc*` is the common default; flat is opt-in via `eslint.config.js` or `ESLINT_USE_FLAT_CONFIG=true`.
- The plugin cannot force consumers to use a config.

## Repair

- Legacy only → add `flat/<name>` if dual support is required.
- Flat only → add `legacy-<name>` if v8 support is required.
- Missing `meta.namespace` → add it and realign every rule prefix.
- Wrong consumer examples → regenerate to match config keys.

## Checklist

- [ ] `meta.namespace` matches every rule prefix
- [ ] Flat configs are arrays and register the plugin as an object
- [ ] Legacy configs are eslintrc objects and register the plugin as an array
- [ ] No config key collisions; public names unchanged
- [ ] Flat + legacy consumer examples match the chosen strategy
