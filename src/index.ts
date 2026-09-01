import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';

type ESLintConfigOptions = Parameters<typeof antfu>[0] & { tailwindcss?: boolean };
type RestParams = Parameters<typeof antfu> extends [any?, ...infer T] ? T : never;

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
        ...(options?.rules ?? {}),
      },

      formatters: {
        html: true,
        markdown: 'prettier',
        css: true,
        ...((options?.formatters ?? {}) as object),
      },
    },
    ...(options.tailwindcss
      ? [
          ...(Array.isArray(tailwind.configs.recommended)
            ? tailwind.configs.recommended
            : [tailwind.configs.recommended]),
        ].flat() as RestParams
      : []),
    ...restParams,
  );
}
