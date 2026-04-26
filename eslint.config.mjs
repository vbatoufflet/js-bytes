import batou from "@batou.dev/eslint-config";
import ts from "typescript-eslint";

export default ts.config(
  batou.gitignore(import.meta.url),
  ...batou.configs.javascript,
  ...batou.configs.typescript,
  {
    rules: {
      "@typescript-eslint/no-use-before-define": "off",
    },
  },
  {
    files: ["*.config.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.test.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
      },
    },
  },
);
