import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';
import { eslintConfig } from '../src/index.js';

async function createLinter(options: Parameters<typeof eslintConfig>[0] = {}) {
  const config = await eslintConfig({
    typescript: false,
    ...options,
  });

  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
  });
}

function hasRule(messages: Linter.LintMessage[], ruleId: string) {
  return messages.some((message) => message.ruleId === ruleId);
}

describe('custom rules', () => {
  let eslint: ESLint;

  beforeAll(async () => {
    eslint = await createLinter();
  });

  async function lint(code: string) {
    const [result] = await eslint.lintText(code, { filePath: 'file.js' });
    return result.messages;
  }

  describe('style/brace-style (1tbs)', () => {
    it('reports else on its own line', async () => {
      const messages = await lint(
        [
          'export function foo(x) {',
          '  if (x) {',
          '    return 1;',
          '  }',
          '  else {',
          '    return 2;',
          '  }',
          '}',
          '',
        ].join('\n'),
      );

      expect(hasRule(messages, 'style/brace-style')).toBe(true);
    });

    it('allows 1tbs', async () => {
      const messages = await lint(
        [
          'export function foo(x) {',
          '  if (x) {',
          '    return 1;',
          '  } else {',
          '    return 2;',
          '  }',
          '}',
          '',
        ].join('\n'),
      );

      expect(hasRule(messages, 'style/brace-style')).toBe(false);
    });
  });

  describe('style/arrow-parens (always)', () => {
    it('reports a single parameter without parentheses', async () => {
      const messages = await lint('export const double = x => x * 2;\n');

      expect(hasRule(messages, 'style/arrow-parens')).toBe(true);
    });

    it('allows parentheses around a single parameter', async () => {
      const messages = await lint('export const double = (x) => x * 2;\n');

      expect(hasRule(messages, 'style/arrow-parens')).toBe(false);
    });
  });

  describe('style/no-multiple-empty-lines', () => {
    it('reports more than one consecutive empty line', async () => {
      const messages = await lint('export const a = 1;\n\n\nexport const b = 2;\n');

      expect(hasRule(messages, 'style/no-multiple-empty-lines')).toBe(true);
    });

    it('reports an empty line at the beginning of the file', async () => {
      const messages = await lint('\nexport const a = 1;\n');

      expect(hasRule(messages, 'style/no-multiple-empty-lines')).toBe(true);
    });

    it('reports an empty line at the end of the file', async () => {
      const messages = await lint('export const a = 1;\n\n');

      expect(hasRule(messages, 'style/no-multiple-empty-lines')).toBe(true);
    });

    it('allows a single empty line between statements', async () => {
      const messages = await lint('export const a = 1;\n\nexport const b = 2;\n');

      expect(hasRule(messages, 'style/no-multiple-empty-lines')).toBe(false);
    });
  });

  describe('no-restricted-imports', () => {
    it('reports imports from ../../ and deeper', async () => {
      const twoLevels = await lint(
        'import { foo } from \'../../utils\';\nexport { foo };\n',
      );
      const threeLevels = await lint(
        'import { foo } from \'../../../utils\';\nexport { foo };\n',
      );

      expect(hasRule(twoLevels, 'no-restricted-imports')).toBe(true);
      expect(hasRule(threeLevels, 'no-restricted-imports')).toBe(true);
    });

    it('allows one-level parent, sibling, and alias imports', async () => {
      const parent = await lint(
        'import { foo } from \'../utils\';\nexport { foo };\n',
      );
      const sibling = await lint(
        'import { foo } from \'./utils\';\nexport { foo };\n',
      );
      const alias = await lint(
        'import { foo } from \'@/utils\';\nexport { foo };\n',
      );

      expect(hasRule(parent, 'no-restricted-imports')).toBe(false);
      expect(hasRule(sibling, 'no-restricted-imports')).toBe(false);
      expect(hasRule(alias, 'no-restricted-imports')).toBe(false);
    });

    it('lets options.rules override the restriction', async () => {
      const eslint = await createLinter({
        rules: {
          'no-restricted-imports': 'off',
        },
      });
      const [result] = await eslint.lintText(
        'import { foo } from \'../../utils\';\nexport { foo };\n',
        { filePath: 'file.js' },
      );

      expect(hasRule(result.messages, 'no-restricted-imports')).toBe(false);
    });
  });
});
