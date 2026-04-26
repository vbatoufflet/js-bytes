import { createRequire } from "node:module";

import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

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
