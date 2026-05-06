import { eslintConfig } from './dist/index.js';

export default eslintConfig(
  {
    typescript: true,
    rules: {
      'antfu/no-import-dist': 'off',
    },
  },
);
