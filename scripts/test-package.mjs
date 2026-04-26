import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const workspaceDir = mkdtempSync("/tmp/js-bytes-package-");
const cacheDir = join(workspaceDir, "bun-cache");

mkdirSync(cacheDir);

// Packs the current package version from this checkout, then tests the installed tarball.
const packageTarball = execFileSync("bun", ["pm", "pack", "--destination", workspaceDir, "--quiet"], {
  cwd: rootDir,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
}).trim();

writeFileSync(
  join(workspaceDir, "package.json"),
  `${JSON.stringify({ name: "js-bytes-package-smoke-test", private: true, type: "commonjs" }, null, 2)}\n`,
);

execFileSync("bun", ["install", "--cache-dir", cacheDir, packageTarball], {
  cwd: workspaceDir,
  stdio: "inherit",
});

// Bun ESM consumer.
execFileSync(
  "bun",
  [
    "--cwd",
    workspaceDir,
    "--eval",
    "import { Bytes } from '@batou.dev/bytes'; if (Bytes.fromBytes(1024).toFormat('%V') !== '1\xa0KiB') throw new Error('Invalid Bun ESM output');",
  ],
  {
    cwd: rootDir,
    stdio: "inherit",
  },
);

// Node.js ESM consumer.
execFileSync(
  "node",
  [
    "--input-type=module",
    "-e",
    "import { Bytes } from '@batou.dev/bytes'; if (Bytes.fromBytes(1024).toFormat('%V') !== '1\xa0KiB') throw new Error('Invalid Node.js ESM output');",
  ],
  {
    cwd: workspaceDir,
    stdio: "inherit",
  },
);

// Node.js CommonJS consumer.
execFileSync(
  "node",
  [
    "-e",
    "const { Bytes } = require('@batou.dev/bytes'); if (Bytes.fromBytes(1024).toFormat('%V') !== '1\\u00a0KiB') throw new Error('Invalid Node.js CommonJS output');",
  ],
  {
    cwd: workspaceDir,
    stdio: "inherit",
  },
);

// TypeScript consumer.
writeFileSync(
  join(workspaceDir, "index.ts"),
  `import { Bytes, type FormatUnit } from "@batou.dev/bytes";
const unit: FormatUnit = "kibibytes";
Bytes.fromBytes(1024).as(unit);
`,
);

execFileSync(
  resolve(rootDir, "node_modules/.bin/tsc"),
  [
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2023",
    "--strict",
    "--noEmit",
    "index.ts",
  ],
  {
    cwd: workspaceDir,
    stdio: "inherit",
  },
);
