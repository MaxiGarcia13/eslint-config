import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { getFormatters } from '../src/formatters.js';
import { eslintConfig } from '../src/index.js';

const huggedAnchor = [
  '---',
  'const href = "https://mixamo.com";',
  '---',
  '',
  '<a',
  '  href={href}',
  '  class="font-medium text-white underline decoration-2 underline-offset-4 hover:opacity-80"',
  '  data-analytics="hero-primary-cta-mixamo"',
  '  data-source="homepage-hero-banner"',
  '  rel="noopener noreferrer"',
  '  target="_blank"',
  '>mixamo.com</a',
  '>',
  '',
].join('\n');

const expandedAnchor = [
  '---',
  'const href = \'https://mixamo.com\';',
  '---',
  '',
  '<a',
  '  href={href}',
  '  class=\'font-medium text-white underline decoration-2 underline-offset-4 hover:opacity-80\'',
  '  data-analytics=\'hero-primary-cta-mixamo\'',
  '  data-source=\'homepage-hero-banner\'',
  '  rel=\'noopener noreferrer\'',
  '  target=\'_blank\'',
  '>',
  '  mixamo.com',
  '</a>',
  '',
].join('\n');

async function createLinter(options: Parameters<typeof eslintConfig>[0] = {}) {
  const config = await eslintConfig({
    typescript: false,
    ...options,
  });

  return new ESLint({
    fix: true,
    overrideConfigFile: true,
    overrideConfig: config,
  });
}

function configs(config: Awaited<ReturnType<typeof eslintConfig>>) {
  return config as Linter.Config[];
}

describe('formatters', () => {
  describe('getFormatters', () => {
    it('keeps default html, markdown, and css formatters', () => {
      expect(getFormatters({})).toEqual({
        html: true,
        markdown: 'prettier',
        css: true,
      });
    });

    it('enables astro formatting with stylistic prettier options', () => {
      expect(getFormatters({ astro: true })).toEqual({
        html: true,
        markdown: 'prettier',
        css: true,
        astro: true,
        prettierOptions: {
          htmlWhitespaceSensitivity: 'ignore',
          jsxSingleQuote: true,
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
  });

  describe('astro', () => {
    it('does not register the astro formatter by default', async () => {
      const config = configs(await eslintConfig({ typescript: false }));

      expect(config.some((item) => item.name === 'antfu/formatter/astro')).toBe(false);
    });

    it('registers prettier-plugin-astro with single quotes and htmlWhitespaceSensitivity ignore', async () => {
      const config = configs(await eslintConfig({
        typescript: false,
        formatters: getFormatters({ astro: true }),
      }));
      const astroFormatter = config.find((item) => item.name === 'antfu/formatter/astro');

      expect(astroFormatter?.rules?.['format/prettier']).toEqual(expect.arrayContaining([
        'error',
        expect.objectContaining({
          parser: 'astro',
          htmlWhitespaceSensitivity: 'ignore',
          jsxSingleQuote: true,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          plugins: expect.arrayContaining(['prettier-plugin-astro']),
        }),
      ]));
    });

    it('expands hugged inline tags and uses single quotes in .astro files', async () => {
      const eslint = await createLinter({
        formatters: getFormatters({ astro: true }),
      });
      const [result] = await eslint.lintText(huggedAnchor, { filePath: 'file.astro' });

      expect(result.output).toBe(expandedAnchor);
    });
  });
});
