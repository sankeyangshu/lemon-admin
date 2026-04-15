import defineConfig from '@lemon/eslint-config/create-config';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginRouter from '@tanstack/eslint-plugin-router';
import pluginTailwindcss from 'eslint-plugin-better-tailwindcss';

export default defineConfig(
  {
    react: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    ignores: ['**/routeTree.gen.ts'],
    isInEditor: false,
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'ts/no-misused-promises': ['error', {
        checksVoidReturn: {
          attributes: false,
        },
      }],
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'better-tailwindcss': pluginTailwindcss,
    },
    rules: {
      // enable all recommended rules to report an error
      ...pluginTailwindcss.configs['recommended-error'].rules,

      // or configure rules individually
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 100 }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
      },
    },
  },
  {
    plugins: {
      '@tanstack/router': pluginRouter,
      '@tanstack/query': pluginQuery,
    },
    rules: {
      ...pluginRouter.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,
    },
  },
);
