import { eslintConfig } from './dist/src/index.js';

export default eslintConfig(
  {
    rules: {
      'antfu/no-import-dist': 'off',
    },
  },
);
