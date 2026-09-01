import type { ESLintConfigOptions, RestParams } from './types.js';
import antfu from '@antfu/eslint-config';
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

      rules: {
      // Devs should know what they are doing
        'react/exhaustive-deps': 'off',
        'react/set-state-in-effect': 'off',

        // Style
        'style/brace-style': ['error', '1tbs'],
        'style/arrow-parens': ['error', 'always'],
        'style/no-multiple-empty-lines': [
          'error',
          {
            max: 1,
            maxBOF: 0,
            maxEOF: 0,
          },
        ],

        // Prevent deep parent-relative imports
        'no-restricted-imports': [
          'error',
          {
            patterns: [{
              group: ['../../**'],
              message: 'Avoid deep parent-relative imports (../../ and deeper). Use the @/ alias instead.',
            }],
          },
        ],

        ...(options?.rules ?? {}),
      },

      formatters: {
        html: true,
        markdown: 'prettier',
        css: true,
        ...((options?.formatters ?? {}) as object),
      },
    },
    ...(options.tailwindcss ? tailwindConfig() as unknown as RestParams : []),
    ...restParams,
  );
}
