import type { ESLintConfigOptions, RestParams } from './types.js';
import antfu, { toArray } from '@antfu/eslint-config';
import { getCustomRules } from './custom-rules.js';
import { getAstroFormatterDisables, getFormatters, isAstroFormatterEnabled } from './formatters.js';
import { tailwindConfig } from './tailwind.js';

export function eslintConfig(options: ESLintConfigOptions = {}, ...restParams: RestParams) {
  return antfu(
    {
      ...options,

      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
        ...((options?.stylistic ?? {}) as object),
      },

      rules: getCustomRules(options),

      formatters: getFormatters(options),
    },
    ...(isAstroFormatterEnabled(options)
      ? [getAstroFormatterDisables()] as unknown as RestParams
      : []),
    ...(options.tailwindcss ? toArray(tailwindConfig()) as unknown as RestParams : []),
    ...restParams,
  );
}
