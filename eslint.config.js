import { FlatCompat } from "@eslint/eslintrc";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
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
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      // Arrow function preference
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"],
      // Prettier
      "prettier/prettier": "error",
    },
  },
];
