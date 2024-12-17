import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "coverage/**",
      "playwright-report/**",
      "node_modules/**",
      "dist/**",
    ],
  },
  {
    // Configuration pour les fichiers en ES Modules
    files: ["**/*.mjs", "**/*.js"], // Ajuste si nécessaire
    languageOptions: {
      sourceType: "module", // Définit le mode ES Modules
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    // Configuration pour les fichiers CommonJS
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs", // Définit le mode CommonJS pour les fichiers .cjs
      globals: {
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
];
