import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { eslintConfig } from '../src/index.js';

const fixtureDir = fileURLToPath(new URL('./fixtures/tailwind', import.meta.url));

async function lint(code: string, options: { tailwindcss?: boolean } = {}) {
  const config = await eslintConfig({
    tailwindcss: options.tailwindcss,
    typescript: false,
  });

  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: true,
    overrideConfig: config,
  });

  const [result] = await eslint.lintText(code, { filePath: 'component.jsx' });
  return result.messages;
}

describe('tailwind', () => {
  it('sort classes correctly', async () => {
    const messages = await lint(
      'export function App() { return <div className="text-white bg-red-500" />; }',
      { tailwindcss: true },
    );

    expect(messages.some((m) => m.ruleId === 'tailwindcss/classnames-order')).toBe(true);
  });
});
