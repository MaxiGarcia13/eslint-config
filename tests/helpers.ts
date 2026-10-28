import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import { eslintConfig } from '../src/index.js';

export type EslintConfigOptions = Parameters<typeof eslintConfig>[0];

export async function createLinter(options: EslintConfigOptions = {}, fix = false) {
  const config = await eslintConfig({
    typescript: false,
    ...options,
  });

  return new ESLint({
    fix,
    overrideConfigFile: true,
    overrideConfig: config,
  });
}

export function asConfigs(config: Awaited<ReturnType<typeof eslintConfig>>) {
  return config as Linter.Config[];
}

export async function lintFixed(
  code: string,
  filePath: string,
  options: EslintConfigOptions = {},
) {
  const eslint = await createLinter(options, true);
  const [result] = await eslint.lintText(code, { filePath });
  return result.output;
}
