import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react'; // Import the plugin itself
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    // Global ignores
    ignores: ['node_modules/', '.next/'],
  },
  // Base configuration for all relevant files
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      prettier: prettierPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin, // Register the React plugin
    },
    languageOptions: {
      globals: {
        ...globals.browser, // Default to browser globals
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules, // Apply React recommended rules (this should still work)
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...prettierConfig.rules, // Disables ESLint rules that conflict with Prettier
      'prettier/prettier': 'error', // Enables the Prettier rule
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ new JSX transform
    },
  },
  // TypeScript specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    // tseslint.configs.recommended already includes the plugin and parser.
    // So, spreading its configs should be enough.
    // If we need to add tseslint.plugin to the plugins object explicitly,
    // it would be like:
    // plugins: { '@typescript-eslint': tseslint.plugin },
    // But usually, the configs array handles this.
    // Let's rely on tseslint.configs.recommended for now.
    // The previous version had '...tseslint.plugin' which might be incorrect for flat config.
    // tseslint.configs.recommended is an array of configs.
    languageOptions: {
      // This should be part of the spread from tseslint.configs.recommended
      // parser: tseslint.parser, // This is usually set by tseslint.configs.recommended
      // parserOptions: { // This is also usually set by tseslint.configs.recommended
      //   project: './tsconfig.json',
      // },
    },
    rules: {
      // These rules are merged with those from tseslint.configs.recommended
      // ...tseslint.configs.recommended.rules, // This is redundant if spreading the config array
      // You can override or add TS specific rules here
    },
  },
  // We need to spread the tseslint.configs.recommended array into the main export
  // Let's restructure slightly to correctly incorporate tseslint configs.
  // The main export default array starts here and continues to the end of the file.
  // Global ignores
  {
    ignores: ['node_modules/', '.next/'],
  },
  // Base configuration for all relevant files (JS, JSX, MJS, CJS)
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      prettier: prettierPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },
  // TypeScript specific configurations (TS, TSX)
  // This applies the tseslint recommended configs and then layers customizations.
  ...tseslint.configs.recommended.map((config) => ({
    ...config, // Spread each config object from tseslint.configs.recommended
    files: ['**/*.{ts,tsx}'], // Ensure it applies only to TS/TSX files
    // Ensure TS specific parser & plugin from tseslint are active for these files
    // The 'config' object from tseslint.configs.recommended should already contain
    // necessary parser and plugin setups. We are just overriding/merging file patterns and rules.
    settings: { react: { version: 'detect' } }, // Ensure React settings are also here for TSX
    rules: {
      // Merge custom rules or overrides for TS/TSX files
      ...(config.rules || {}), // Base rules from tseslint config object
      'prettier/prettier': 'error', // Ensure prettier runs on TS files too
      'react/react-in-jsx-scope': 'off',
      // Add any TS-specific overrides here, e.g.
      // '@typescript-eslint/no-explicit-any': 'warn',
      // Ensure Next.js specific rules are also applied to TSX files if needed
      ...nextPlugin.configs.recommended.rules, // if next-plugin rules should also apply to tsx
      ...nextPlugin.configs['core-web-vitals'].rules, // if next-plugin rules should also apply to tsx
    },
  })),
  // Configuration for API routes (Node.js environment)
  // This should come AFTER the general JS/TS configs to override `globals.browser`
  {
    files: ['src/app/api/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js globals
      },
    },
    // If API routes use Next.js specific features that are linted by @next/next,
    // ensure those are not disabled or overridden unintentionally.
    // The base config for @next/next should cover them if API routes are JS/MJS.
    // If API routes are TS, ensure tseslint mapping above also includes next rules if necessary.
  },
  // Configuration for non-API server-side code if any (e.g. next.config.mjs itself)
  {
    files: [
      'next.config.mjs',
      'postcss.config.mjs',
      'tailwind.config.js',
      '*.config.js',
    ], // Add other server-side JS/MJS files if any
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
