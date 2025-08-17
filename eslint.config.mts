// eslint.config.mts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

// Angular ESLint (plugins + parser de templates)
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";

export default defineConfig([
  // Ignorar pastas comuns
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },

  // Regras JS (caso tenha arquivos .js)
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Regras TS base + type-aware (typescript-eslint)
  ...tseslint.configs.recommendedTypeChecked,
  // (Opcional) um pouco de estilo para TS:
  // ...tseslint.configs.stylisticTypeChecked,

  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Usa o serviço de projeto automático (dispensa apontar tsconfig a mão)
        projectService: true,
        // Se estiver em monorepo e precisar, descomente a linha abaixo:
        // tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      "@angular-eslint": angular,
      "@typescript-eslint": tseslint.plugin,
    },
    // Preset recomendado do @angular-eslint para código TS
    rules: {
      ...angular.configs.recommended.rules,

      // --- Ajuste de prefixo do projeto ---
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["app"], // <--- TROQUE AQUI se precisar
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app"], // <--- TROQUE AQUI se precisar
          style: "camelCase",
        },
      ],

      // Exemplo de ajustes TS comuns:
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },

  // Templates HTML (arquivos .html)
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      // Exemplos úteis (opcionais):
      // '@angular-eslint/template/eqeqeq': 'error',
      // '@angular-eslint/template/no-negated-async': 'warn',
    },
  },

  // Processa templates inline (template: `...`) dentro de arquivos .ts
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: { "@angular-eslint/template": angularTemplate },
    // Usa o processor oficial para extrair HTML inline e validar com as regras acima
    processor: angularTemplate.processors["extract-inline-html"],
  },
]);
