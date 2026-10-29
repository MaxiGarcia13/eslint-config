import { describe, expect, it } from 'vitest';
import { getAstroFormatterDisables, getFormatters } from '../src/formatters.js';
import { eslintConfig } from '../src/index.js';
import { asConfigs, createLinter, lintFixed } from './helpers.js';

/** Enable the Astro Prettier formatter without loading eslint-plugin-astro. */
function withAstroFormatter(stylistic?: Parameters<typeof getFormatters>[0]['stylistic']) {
  return {
    formatters: getFormatters({
      astro: true,
      stylistic,
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
  'const href = \'https://example.com\';',
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
    expect(config.some((item) => item.name === 'maxigarcia/formatter/astro/disables')).toBe(false);
  });

  it('disables antfu/reasonable-newline when the astro formatter is enabled', async () => {
    const config = asConfigs(await eslintConfig({
      typescript: false,
      ...withAstroFormatter(),
    }));
    const disables = config.find((item) => item.name === 'maxigarcia/formatter/astro/disables');

    expect(disables).toMatchObject(getAstroFormatterDisables());
  });

  it('registers prettier-plugin-astro when the astro formatter is enabled', async () => {
    const config = asConfigs(await eslintConfig({
      typescript: false,
      ...withAstroFormatter(),
    }));
    const astroFormatter = config.find((item) => item.name === 'antfu/formatter/astro');

    expect(astroFormatter?.rules?.['format/prettier']).toEqual(expect.arrayContaining([
      'error',
      expect.objectContaining({
        parser: 'astro',
        htmlWhitespaceSensitivity: 'ignore',
        jsxSingleQuote: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        plugins: expect.arrayContaining(['prettier-plugin-astro']),
      }),
    ]));
  });

  it('formats JS with single quotes and HTML attributes with double quotes', async () => {
    await expect(lintFixed(unformattedAstro, 'file.astro', withAstroFormatter()))
      .resolves
      .toBe(formattedAstro);
  });

  it('respects stylistic quote and semi overrides when formatting', async () => {
    const eslint = await createLinter(withAstroFormatter({
      quotes: 'double',
      semi: false,
    }), true);

    const [result] = await eslint.lintText(
      [
        '---',
        'const href = \'https://example.com\'',
        '---',
        '',
        '<a href={href}>ok</a>',
        '',
      ].join('\n'),
      { filePath: 'file.astro' },
    );

    expect(result.output).toContain('const href = "https://example.com"');
    expect(result.output).not.toMatch(/";/);
  });
});
