import type { ESLintConfigOptions } from './types.js';

const DEFAULT_FORMATTERS: ESLintConfigOptions['formatters'] = {
  html: true,
  markdown: 'prettier',
  css: true,
};

function getUserFormatters(options: ESLintConfigOptions) {
  return typeof options.formatters === 'object' ? options.formatters : undefined;
}

function getStylistic(options: ESLintConfigOptions) {
  const stylistic = typeof options.stylistic === 'object' ? options.stylistic : undefined;

  return {
    indent: stylistic?.indent ?? 2,
    quotes: stylistic?.quotes ?? 'single',
    semi: stylistic?.semi ?? true,
  };
}

export function getFormatters(options: ESLintConfigOptions): ESLintConfigOptions['formatters'] {
  const userFormatters = getUserFormatters(options);
  const { indent, quotes, semi } = getStylistic(options);
  const prettierOptions = {
    ...(options.astro
      ? {
          htmlWhitespaceSensitivity: 'ignore' as const,
          jsxSingleQuote: false,
          semi: typeof semi === 'boolean' ? semi : true,
          singleQuote: quotes === 'single',
          tabWidth: typeof indent === 'number' ? indent : 2,
          useTabs: indent === 'tab',
        }
      : {}),
    ...userFormatters?.prettierOptions,
  };

  return {
    ...DEFAULT_FORMATTERS as object,
    ...(options.astro ? { astro: true } : {}),
    ...userFormatters,
    ...(Object.keys(prettierOptions).length > 0 ? { prettierOptions } : {}),
  };
}

/** True when Prettier owns `*.astro` formatting. */
export function isAstroFormatterEnabled(options: ESLintConfigOptions): boolean {
  const formatters = getFormatters(options);
  return typeof formatters === 'object' && Boolean(formatters?.astro);
}

/**
 * Prettier owns Astro layout. `antfu/reasonable-newline` only inserts bare newlines
 * (no indent) and circular-fixes against Prettier on short complex ternaries, so turn
 * it off for Astro files when the formatter is on.
 */
export function getAstroFormatterDisables() {
  return {
    name: 'maxigarcia/formatter/astro/disables',
    files: ['**/*.astro', '**/*.astro/*.ts'],
    rules: {
      'antfu/reasonable-newline': 'off',
    },
  };
}
