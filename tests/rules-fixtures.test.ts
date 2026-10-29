import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { hasRule, lintFixture } from './helpers.js';

function fixture(name: string) {
  return fileURLToPath(new URL(`./fixtures/rules/${name}`, import.meta.url));
}

describe('rules fixtures', () => {
  it.each([
    ['brace-style.js', 'style/brace-style'],
    ['arrow-parens.js', 'style/arrow-parens'],
    ['empty-lines.js', 'style/no-multiple-empty-lines'],
    ['restricted-imports.js', 'no-restricted-imports'],
    ['quotes.js', 'style/quotes'],
    ['attributes.html', 'format/prettier'],
    ['style.css', 'format/prettier'],
    ['doc.md', 'format/prettier'],
    ['data.json', 'jsonc/object-curly-spacing'],
    ['data.yml', 'yaml/plain-scalar'],
  ] as const)('reports %s via %s', async (name, ruleId) => {
    const result = await lintFixture(fixture(name));

    expect(hasRule(result.messages, ruleId)).toBe(true);
  });

  it.each([
    ['attributes.html', '<a class="font-medium" href="https://example.com"></a>\n'],
    ['style.css', '.smoke {\n  color: red;\n  display: flex;\n}\n'],
    ['doc.md', '# Smoke\n\nHello from the smoke fixture.\n'],
    ['data.json', '{ "name": "smoke", "items": ["one", "two"] }\n'],
    ['data.yml', 'name: smoke\nitems:\n  - one\n  - two\n'],
    ['quotes.js', 'export const name = \'smoke\';\n'],
    ['arrow-parens.js', 'export const double = (x) => x * 2;\n'],
  ] as const)('fixes %s', async (name, expected) => {
    const result = await lintFixture(fixture(name), {}, true);

    expect(result.output ?? await readFile(fixture(name), 'utf8')).toBe(expected);
  });
});
