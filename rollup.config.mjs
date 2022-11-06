import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

import pkg from "./package.json" assert {type: "json"};

export default {
    input: "src/index.ts",
    output: [
        {
            exports: "named",
            file: pkg.main,
            format: "cjs",
        },
        {
            file: pkg.module,
            format: "es",
        },
    ],
    plugins: [
        commonjs(),
        esbuild({
            minify: process.env.NODE_ENV === "production",
            target: "es6",
        }),
    ],
};
