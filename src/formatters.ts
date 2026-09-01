import type { ESLintConfigOptions } from './types.js';

const DEFAULT_FORMATTERS: ESLintConfigOptions['formatters'] = {
  html: true,
  markdown: 'prettier',
  css: true,
};

const ASTRO_FORMATTERS: ESLintConfigOptions['formatters'] = {
  astro: true,
  prettierOptions: {
    htmlWhitespaceSensitivity: 'ignore',
  },
};

export function getFormatters(options: ESLintConfigOptions): ESLintConfigOptions['formatters'] {
  return {
    ...DEFAULT_FORMATTERS as object,
    ...(options.astro ? ASTRO_FORMATTERS as object : {}),
    ...((options?.formatters ?? {}) as object),
  };
}
