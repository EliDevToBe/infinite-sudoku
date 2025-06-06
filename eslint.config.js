import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      "@typescript-eslint": "@typescript-eslint/eslint-plugin",
      prettier: "eslint-plugin-prettier",
    },
    rules: {
      // TypeScript
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      // Arrow function preference
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"],
      // Prettier
      "prettier/prettier": "error",
    },
  },
];

// {
//   "root": true,
//   "extends": ["eslint:recommended", "plugin:prettier/recommended"],
//   "parserOptions": {
//     "ecmaVersion": 2021,
//     "sourceType": "module"
//   },
//   "env": {
//     "node": true,
//     "es2021": true
//   },
//   "rules": {
//     "prettier/prettier": "error",
//     "quotes": ["error", "double"]
//   }
// }
