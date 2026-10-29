import type { Config } from 'prettier';
import type { PrettierStylistic } from './types.js';
import { getPrettierOptions } from './prettier-options.js';

export type PrettierConfigOptions = {
  stylistic?: PrettierStylistic;
} & Config;

export function prettierConfig(options: PrettierConfigOptions = {}): Config {
  const { stylistic, ...rest } = options;

  return {
    ...getPrettierOptions(stylistic),
    plugins: ['prettier-plugin-astro'],
    overrides: [
      {
        files: '*.astro',
        options: {
          parser: 'astro',
        },
      },
    ],
    ...rest,
  };
}

export { getPrettierExtras, getPrettierOptions } from './prettier-options.js';
