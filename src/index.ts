import antfu from '@antfu/eslint-config'; 
import tailwind from "eslint-plugin-tailwindcss";

type ESLintConfigOptions = Parameters<typeof antfu>[0] & { tailwindcss?: boolean };
type RestParams = Parameters<typeof antfu> extends [any?, ...infer T] ? T : never;

export function eslintConfig(options: ESLintConfigOptions = {}, ...restParams: RestParams) {
  const extendsList = [];

  if (options?.tailwindcss) {
    extendsList.push(tailwind.configs["flat/recommended"]);
  }

  return antfu({
    ...options,

    stylistic: {
      indent: 2,
      semi: true,
      quotes: 'single',
      ...((options?.stylistic ?? {}) as object),
    },

    extends:extendsList,

    rules: {
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
      ...((options?.formatters ?? {}) as object),
    },
  }, ...restParams);
}
