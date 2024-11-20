import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['client/src/**/*.{js,jsx,ts,tsx}', 'server/src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Enable JSX support
        },
        project: ["./tsconfig.json", "./client/tsconfig.json", "./server/tsconfig.json"], // Ensure proper TypeScript integration
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      import: importPlugin, // Add the import plugin
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/prop-types": "off", // Disable prop-types for TypeScript

      // General rules
      "import/order": ["warn", { groups: [["builtin", "external", "internal"]] }],
    },
  },
];
