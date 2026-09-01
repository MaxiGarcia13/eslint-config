import type antfu from '@antfu/eslint-config';

type AntFu = typeof antfu;
type AntfuOptions = Parameters<AntFu>[0];
export type ESLintConfigOptions = AntfuOptions & { tailwindcss?: boolean };
export type RestParams = Parameters<AntFu> extends [any?, ...infer T] ? T : never;
