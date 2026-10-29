import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createLinter } from './helpers.js';

const fixtureDir = fileURLToPath(new URL('./fixtures/smoke', import.meta.url));

async function smokeFiles() {
  const names = await readdir(fixtureDir);
  return names
    .filter((name) => !name.startsWith('.'))
    .map((name) => join(fixtureDir, name))
    .sort();
}

describe('smoke fixtures', () => {
  it('reports no issues across real files', async () => {
    const files = await smokeFiles();
    const eslint = await createLinter({ typescript: true });
    const results = await eslint.lintFiles(files);

    expect(results.map((result) => result.filePath).sort()).toEqual(files);

    for (const result of results) {
      expect(result.messages, result.filePath).toEqual([]);
    }
  });

  it('needs no --fix changes across real files', async () => {
    const files = await smokeFiles();
    const eslint = await createLinter({ typescript: true }, true);
    const results = await eslint.lintFiles(files);

    for (const result of results) {
      expect(result.output, result.filePath).toBeUndefined();
    }
  });
});
