import { describe, expect, it } from 'vitest';
import { asConfigs, lintFixed } from './helpers.js';
import { eslintConfig } from '../src/index.js';

describe('html formatter', () => {
  it('registers the html formatter by default', async () => {
    const config = asConfigs(await eslintConfig({ typescript: false }));

    expect(config.some((item) => item.name === 'antfu/formatter/html')).toBe(true);
  });

  it('rewrites single-quoted attributes to double quotes', async () => {
    await expect(
      lintFixed(
        '<a class=\'font-medium\' href=\'https://example.com\'></a>\n',
        'file.html',
      ),
    ).resolves.toBe('<a class="font-medium" href="https://example.com"></a>\n');
  });
});
