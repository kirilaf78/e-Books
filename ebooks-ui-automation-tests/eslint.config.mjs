import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:playwright/recommended"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": simpleImportSort,
      prettier
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },

    rules: {
      "no-console": [
        "warn",
        {
          allow: ["error", "info"]
        }
      ],

      "playwright/no-skipped-test": [
        "error",
        {
          allowConditional: true
        }
      ],

      "playwright/no-conditional-in-test": "off",
      "playwright/no-conditional-expect": "off",
      "playwright/no-useless-await": "warn",
      "playwright/prefer-to-be": "warn",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-expressions": "off"
    }
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],

    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            [
              "^@playwright",
              "@axe",
              "^@faker-js/faker",
              "^\\w",
              "^@constants",
              "^@fixtures",
              "^@helpers",
              "^@components",
              "^@pages"
            ]
          ]
        }
      ]
    }
  }
];
