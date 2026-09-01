import type { ESLintConfigOptions } from './types.js';

const CUSTOM_RULES: ESLintConfigOptions['rules'] = {
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
};

export function getCustomRules(options: ESLintConfigOptions): ESLintConfigOptions['rules'] {
  return {
    ...CUSTOM_RULES,
    ...(options?.rules ?? {}),
  };
}
