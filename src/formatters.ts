import type { ESLintConfigOptions } from './types.js';
import { getPrettierExtras } from './prettier-options.js';

const DEFAULT_FORMATTERS: ESLintConfigOptions['formatters'] = {
  html: true,
  markdown: 'prettier',
  css: true,
};

function getUserFormatters(options: ESLintConfigOptions) {
  return typeof options.formatters === 'object'
    ? options.formatters
    : undefined;
}

export function getFormatters(options: ESLintConfigOptions): ESLintConfigOptions['formatters'] {
  const userFormatters = getUserFormatters(options);
  const prettierOptions = {
    ...getPrettierExtras(),
    ...userFormatters?.prettierOptions,
  };

  return {
    ...DEFAULT_FORMATTERS as object,
    ...(options.astro
      ? { astro: true }
      : {}),
    ...userFormatters,
    prettierOptions,
  };
}

export function isAstroFormatterEnabled(options: ESLintConfigOptions): boolean {
  const formatters = getFormatters(options);
  return typeof formatters === 'object' && Boolean(formatters?.astro);
}

export function getAstroFormatterDisables() {
  return {
    name: 'maxigarcia/formatter/astro/disables',
    files: ['**/*.astro', '**/*.astro/*.ts'],
    rules: {
      'antfu/reasonable-newline': 'off',
    },
  };
}
