import type { PrettierStylistic } from './types.js';
import { DEFAULT_STYLISTIC } from './stylistic.js';

export function getPrettierExtras() {
  return {
    htmlWhitespaceSensitivity: 'ignore' as const,
    jsxSingleQuote: false,
  };
}

export function getPrettierOptions(stylistic: PrettierStylistic = {}) {
  const { indent, quotes, semi } = {
    ...DEFAULT_STYLISTIC,
    ...stylistic,
  };

  return {
    endOfLine: 'auto' as const,
    printWidth: 120,
    semi,
    singleQuote: quotes === 'single',
    tabWidth: typeof indent === 'number' ? indent : 2,
    trailingComma: 'all' as const,
    useTabs: indent === 'tab',
    ...getPrettierExtras(),
  };
}
