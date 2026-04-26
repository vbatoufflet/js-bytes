# Bytes

Bytes is a JavaScript library for parsing, formatting, converting, and
calculating byte sizes with native Intl support.

## Install

With Bun:

```sh
bun add @batou.dev/bytes
```

With npm:

```sh
npm install @batou.dev/bytes
```

Bytes supports Node.js 22 and later, works with ES modules and CommonJS, and
includes TypeScript declarations.

ES modules:

```js
import { Bytes } from "@batou.dev/bytes";
```

CommonJS:

```js
const { Bytes } = require("@batou.dev/bytes");
```

## Usage

Format byte values:

```js
Bytes.fromBytes(1024).toString(); // 1 KiB
Bytes.fromString("1234.56kB").toFormat("%.3m"); // 1.235 MB
```

Parse localized values:

```js
Bytes.fromString("1,234.56 GiB", { locale: "en" }).toDecimal({ locale: "fr" }); // 1,33 TB
```

Convert to numeric values:

```js
Bytes.fromString("1234.56 GiB").valueOf(); // 1325598706237
Bytes.fromString("12.345 MiB").as("kilobytes"); // 12944.67072
```

Calculate with byte sizes:

```js
Bytes.fromString("123.45 MB").add("1.23 MiB").toBinary(); // 118.96 MiB
```

## Development

This project uses Bun.

```sh
bun install
```

Run the full verification suite with:

```sh
bun run lint
bun run typecheck
bun run build
bun run test
bun run test:package
```

Generate documentation locally:

```sh
bun run docs
```

## Links

- [Documentation](https://js-bytes.batou.dev/)
- [Changelog](https://github.com/vbatoufflet/js-bytes/blob/main/CHANGELOG.md)
- [npm package](https://www.npmjs.com/package/@batou.dev/bytes)

## License

This code is licensed and distributed under the terms of the
[MIT](https://opensource.org/licenses/MIT) license.
