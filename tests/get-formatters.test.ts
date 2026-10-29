import { describe, expect, it } from 'vitest';
import { getFormatters, isAstroFormatterEnabled } from '../src/formatters.js';
import { getPrettierExtras } from '../src/prettier-options.js';

describe('getFormatters', () => {
  it('keeps default html, markdown, and css formatters with prettier extras', () => {
    expect(getFormatters({})).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
      prettierOptions: getPrettierExtras(),
    });
  });

  it('enables astro formatting and keeps prettier extras for antfu to merge', () => {
    expect(getFormatters({ astro: true })).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
      astro: true,
      prettierOptions: getPrettierExtras(),
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

  it('merges user prettierOptions over our extras', () => {
    expect(getFormatters({
      formatters: {
        prettierOptions: {
          printWidth: 100,
          singleQuote: false,
        },
      },
    })).toMatchObject({
      prettierOptions: {
        htmlWhitespaceSensitivity: 'ignore',
        jsxSingleQuote: false,
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
