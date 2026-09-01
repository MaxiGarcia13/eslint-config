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
          jsxSingleQuote: quotes === 'single',
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
