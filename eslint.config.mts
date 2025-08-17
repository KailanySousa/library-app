// eslint.config.mts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";

export default defineConfig([
  // Ignorar pastas comuns
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },

  // Regras para JavaScript (se houver .js)
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Presets TypeScript com checagem de tipos
  ...tseslint.configs.recommendedTypeChecked,
  // (Opcional) estilo adicional:
  // ...tseslint.configs.stylisticTypeChecked,

  // Regras para arquivos TS + Angular
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true, // usa tsconfig automaticamente
        // tsconfigRootDir: import.meta.dirname, // descomente em monorepo
      },
      globals: globals.browser,
    },
    plugins: {
      "@angular-eslint": angular,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...angular.configs.recommended.rules,

      // Ajuste seu prefixo de componentes/diretivas aqui
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: ["app"], style: "kebab-case" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: ["app"], style: "camelCase" },
      ],

      // Exemplos úteis (opcionais):
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },

  // Templates em arquivos .html
  {
    files: ["**/*.html"],
    languageOptions: { parser: angularTemplateParser },
    plugins: { "@angular-eslint/template": angularTemplate },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },

  // Templates inline (template: `...`) dentro dos .ts
  {
    files: ["**/*.{ts,mts,cts}"],
    plugins: { "@angular-eslint/template": angularTemplate },
    processor: angularTemplate.processors["extract-inline-html"],
  },
]);
