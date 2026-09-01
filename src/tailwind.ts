import tailwind from 'eslint-plugin-tailwindcss';

export function tailwindConfig() {
  if ('flat/recommended' in tailwind.configs) {
    return tailwind.configs['flat/recommended'];
  }

  return (
    Array.isArray(tailwind.configs.recommended)
      ? tailwind.configs.recommended
      : [tailwind.configs.recommended]
  ).flat();
}
