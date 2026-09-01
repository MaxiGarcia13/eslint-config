import type { ESLintConfigOptions, RestParams } from './types.js';
import antfu from '@antfu/eslint-config';
import { CUSTOM_RULES, getCustomRules } from './custom-rules.js';
import { getFormatters } from './formatters.js';
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
    ...(options.tailwindcss ? tailwindConfig() as unknown as RestParams : []),
    ...restParams,
  );
}
