module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    overrides: [
        {
            files: ["**/*.test.ts"],
            env: {
                mocha: true,
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
    },
    plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
    rules: {
        "@typescript-eslint/array-type": ["error", {default: "array"}],
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        curly: ["error", "all"],
        eqeqeq: ["error", "always"],
        "lines-between-class-members": ["error", "always", {exceptAfterSingleLine: true}],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-duplicate-imports": "error",
        "no-empty": ["error", {allowEmptyCatch: true}],
        "object-shorthand": "error",
        "prefer-template": "error",
        "prettier/prettier": [
            process.env.NODE_ENV === "production" ? "error" : "warn",
            {
                arrowParens: "avoid",
                bracketSpacing: false,
                printWidth: 100,
                quoteProps: "as-needed",
                tabWidth: 4,
                trailingComma: "all",
            },
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },
};
