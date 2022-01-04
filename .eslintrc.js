module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["@batou.dev/eslint-config-typescript"],
    overrides: [
        {
            files: ["**/*.test.ts"],
            env: {
                mocha: true,
            },
        },
    ],
};
