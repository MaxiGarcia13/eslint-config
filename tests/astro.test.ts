import { describe, expect, it } from 'vitest';
import { getFormatters } from '../src/formatters.js';
import { eslintConfig } from '../src/index.js';
import { asConfigs, lintFixed } from './helpers.js';

/** Opt in to the Astro Prettier formatter without loading eslint-plugin-astro. */
function withAstroFormatter(stylistic?: Parameters<typeof getFormatters>[0]['stylistic']) {
  return {
    formatters: getFormatters({
      stylistic,
      formatters: { astro: true },
    }),
  };
}

const unformattedAstro = [
  '---',
  'const href = "https://example.com";',
  '---',
  '',
  '<a href={href} class="link">example</a',
  '>',
  '',
].join('\n');

const formattedAstro = [
  '---',
  'const href = "https://example.com";',
  '---',
  '',
  '<a href={href} class="link">',
  '  example',
  '</a>',
  '',
].join('\n');

describe('astro formatter', () => {
  it('does not register the astro formatter by default', async () => {
    const config = asConfigs(await eslintConfig({ typescript: false }));

    expect(config.some((item) => item.name === 'antfu/formatter/astro')).toBe(false);
  });

  it('does not register the astro formatter from astro: true alone', async () => {
    const config = asConfigs(await eslintConfig({
      typescript: false,
      // Avoid loading eslint-plugin-astro; only assert formatter registration.
      formatters: getFormatters({ astro: true }),
    }));

    expect(config.some((item) => item.name === 'antfu/formatter/astro')).toBe(false);
  });

  it('registers prettier-plugin-astro when formatters.astro is enabled', async () => {
    const config = asConfigs(await eslintConfig({
      typescript: false,
      ...withAstroFormatter(),
    }));
    const astroFormatter = config.find((item) => item.name === 'antfu/formatter/astro');

    expect(astroFormatter?.rules?.['format/prettier']).toEqual(expect.arrayContaining([
      'error',
      expect.objectContaining({
        parser: 'astro',
        astroSkipFrontmatter: true,
        htmlWhitespaceSensitivity: 'ignore',
        jsxSingleQuote: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        plugins: expect.arrayContaining(['prettier-plugin-astro']),
      }),
    ]));
  });

  it('formats the template while leaving frontmatter verbatim', async () => {
    await expect(lintFixed(unformattedAstro, 'file.astro', withAstroFormatter()))
      .resolves
      .toBe(formattedAstro);
  });

  it('respects stylistic quote and semi overrides for template formatting options', async () => {
    const config = asConfigs(await eslintConfig({
      typescript: false,
      ...withAstroFormatter({
        quotes: 'double',
        semi: false,
      }),
    }));
    const astroFormatter = config.find((item) => item.name === 'antfu/formatter/astro');

    expect(astroFormatter?.rules?.['format/prettier']).toEqual(expect.arrayContaining([
      'error',
      expect.objectContaining({
        semi: false,
        singleQuote: false,
      }),
    ]));
  });
});
