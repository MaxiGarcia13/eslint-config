import { describe, expect, it } from 'vitest';
import { getFormatters } from '../src/formatters.js';

describe('getFormatters', () => {
  it('keeps default html, markdown, and css formatters', () => {
    expect(getFormatters({})).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
    });
  });

  it('does not enable astro formatting from astro: true alone', () => {
    expect(getFormatters({ astro: true })).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
    });
  });

  it('enables astro formatting when formatters.astro is set', () => {
    expect(getFormatters({
      formatters: { astro: true },
    })).toEqual({
      html: true,
      markdown: 'prettier',
      css: true,
      astro: true,
      prettierOptions: {
        astroSkipFrontmatter: true,
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
      stylistic: {
        indent: 'tab',
        quotes: 'double',
        semi: false,
      },
      formatters: { astro: true },
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
      formatters: {
        astro: false,
      },
    })).toMatchObject({
      astro: false,
    });
  });

  it('merges user prettierOptions over the astro defaults', () => {
    expect(getFormatters({
      formatters: {
        astro: true,
        prettierOptions: {
          printWidth: 100,
          singleQuote: false,
        },
      },
    })).toMatchObject({
      prettierOptions: {
        astroSkipFrontmatter: true,
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 100,
        singleQuote: false,
      },
    });
  });
});
