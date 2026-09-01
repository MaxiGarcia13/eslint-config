import { eslintConfig } from './dist/index.js';

export default eslintConfig(
  {
    typescript: true,
    yaml: true,
    rules: {
      'antfu/no-import-dist': 'off',
    },
  },
);
