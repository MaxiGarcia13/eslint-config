import { describe, expect, it } from 'vitest';
import { getPrettierExtras, getPrettierOptions, prettierConfig } from '../src/prettier.js';

describe('prettierConfig', () => {
  it('returns antfu-aligned options plus our extras and astro wiring', () => {
    expect(prettierConfig()).toMatchObject({
      endOfLine: 'auto',
      htmlWhitespaceSensitivity: 'ignore',
      jsxSingleQuote: false,
      printWidth: 120,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
      useTabs: false,
      plugins: ['prettier-plugin-astro'],
      overrides: [
        {
          files: '*.astro',
          options: { parser: 'astro' },
        },
      ],
    });
  });

  it('maps stylistic overrides like eslintConfig', () => {
    expect(prettierConfig({
      stylistic: {
        indent: 'tab',
        quotes: 'double',
        semi: false,
      },
    })).toMatchObject({
      semi: false,
      singleQuote: false,
      useTabs: true,
    });
  });

  it('lets Prettier options override the defaults', () => {
    expect(prettierConfig({
      printWidth: 100,
      plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    })).toMatchObject({
      printWidth: 100,
      plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    });
  });

  it('exposes getPrettierOptions and getPrettierExtras', () => {
    expect(getPrettierExtras()).toEqual({
      htmlWhitespaceSensitivity: 'ignore',
      jsxSingleQuote: false,
    });
    expect(getPrettierOptions()).toEqual({
      endOfLine: 'auto',
      printWidth: 120,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
      useTabs: false,
      htmlWhitespaceSensitivity: 'ignore',
      jsxSingleQuote: false,
    });
  });
});
