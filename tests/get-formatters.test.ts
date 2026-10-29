import { describe, expect, it } from 'vitest';
import { getFormatters, isAstroFormatterEnabled } from '../src/formatters.js';

describe('getFormatters', () => {
  it('keeps default html, markdown, and css formatters', () => {
    expect(getFormatters({})).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
    });
  });

  it('does not add prettierOptions unless astro is enabled', () => {
    expect(getFormatters({})).not.toHaveProperty('prettierOptions');
  });

  it('enables astro formatting with stylistic prettier options', () => {
    expect(getFormatters({ astro: true })).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
      astro: true,
      prettierOptions: {
        htmlWhitespaceSensitivity: 'ignore',
        jsxSingleQuote: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
      },
    });
  });

  it('maps stylistic quotes, semi, and indent onto astro prettier options', () => {
    expect(getFormatters({
      astro: true,
      stylistic: {
        indent: 'tab',
        quotes: 'double',
        semi: false,
      },
    })).toMatchObject({
      prettierOptions: {
        jsxSingleQuote: false,
        semi: false,
        singleQuote: false,
        useTabs: true,
      },
    });
  });

  it('lets options.formatters override the astro defaults', () => {
    expect(getFormatters({
      astro: true,
      formatters: {
        astro: false,
      },
    })).toMatchObject({
      astro: false,
    });
  });

  it('merges user prettierOptions over the astro defaults', () => {
    expect(getFormatters({
      astro: true,
      formatters: {
        prettierOptions: {
          printWidth: 100,
          singleQuote: false,
        },
      },
    })).toMatchObject({
      prettierOptions: {
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 100,
        singleQuote: false,
      },
    });
  });

  it('reports when the astro formatter is effectively enabled', () => {
    expect(isAstroFormatterEnabled({})).toBe(false);
    expect(isAstroFormatterEnabled({ astro: true })).toBe(true);
    expect(isAstroFormatterEnabled({
      astro: true,
      formatters: { astro: false },
    })).toBe(false);
  });
});
