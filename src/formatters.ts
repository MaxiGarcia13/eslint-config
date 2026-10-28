import type { ESLintConfigOptions } from './types.js';

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

function getStylistic(options: ESLintConfigOptions) {
  const stylistic = typeof options.stylistic === 'object'
    ? options.stylistic
    : undefined;

  return {
    indent: stylistic?.indent ?? 2,
    quotes: stylistic?.quotes ?? 'single',
    semi: stylistic?.semi ?? true,
  };
}

/**
 * Keep `antfu/reasonable-newline` able to fix Astro JS.
 *
 * Prettier on `*.astro` reformats `<script>` / frontmatter and collapses short complex
 * ternaries, which circular-fixes against that rule. So Astro Prettier is opt-in via
 * `formatters.astro` (not tied to `astro: true`). When enabled, `astroSkipFrontmatter`
 * leaves frontmatter to ESLint; `<script>` can still conflict if both are on.
 */
export function getFormatters(options: ESLintConfigOptions): ESLintConfigOptions['formatters'] {
  const userFormatters = getUserFormatters(options);
  const { indent, quotes, semi } = getStylistic(options);
  const astroFormatter = Boolean(userFormatters?.astro);
  const prettierOptions = {
    ...(astroFormatter
      ? {
          astroSkipFrontmatter: true,
          htmlWhitespaceSensitivity: 'ignore' as const,
          jsxSingleQuote: false,
          semi: typeof semi === 'boolean'
            ? semi
            : true,
          singleQuote: quotes === 'single',
          tabWidth: typeof indent === 'number'
            ? indent
            : 2,
          useTabs: indent === 'tab',
        }
      : {}),
    ...userFormatters?.prettierOptions,
  };

  return {
    ...DEFAULT_FORMATTERS as object,
    ...userFormatters,
    ...(Object.keys(prettierOptions).length > 0
      ? { prettierOptions }
      : {}),
  };
}
