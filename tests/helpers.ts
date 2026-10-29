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

export function hasRule(messages: Linter.LintMessage[], ruleId: string) {
  return messages.some((message) => message.ruleId === ruleId);
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

export async function lintFixture(
  filePath: string,
  options: EslintConfigOptions = {},
  fix = false,
) {
  const eslint = await createLinter(options, fix);
  const [result] = await eslint.lintFiles([filePath]);
  return result;
}
