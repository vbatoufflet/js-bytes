# @batou.dev/bytes

Bytes is an all-in-one toolkit to parse, format, convert, and compute data sizes (kB, MB, GiB) in JavaScript and TypeScript.

It provides a consistent API to parse user input, convert between units and combine values, and produce localized output, with SI/IEC units and native `Intl` support.

Avoid juggling multiple utilities for parsing, formatting, and conversion.

## Quick examples

```js
import { Bytes } from "@batou.dev/bytes";

Bytes.fromString("1.5 GB").valueOf();
// 1500000000

Bytes.fromBytes(1024).toString();
// "1 KiB"

Bytes.fromString("12.345 MiB").as("kilobytes");
// 12944.67072

Bytes.fromString("1 GB").add("500 MB").toString();
// "1.5 GB"

Bytes.fromString("1,234.56 GiB", { locale: "en" }).toDecimal({ locale: "fr" });
// "1,33 TB"
```

Explore the full API: <https://js-bytes.batou.dev/>

## Install

```sh
bun add @batou.dev/bytes
# or
npm install @batou.dev/bytes
```

Requires Node.js 22 or later.

## Usage

### Parse user input

```js
Bytes.fromString("1.5 GB").valueOf();
// 1500000000
```

### Format values for display

```js
Bytes.fromBytes(1024).toString();
// "1 KiB"

Bytes.fromString("1234.56kB").toFormat("%.3m");
// "1.235 MB"
```

### Convert between units

```js
Bytes.fromString("12.345 MiB").as("kilobytes");
// 12944.67072
```

### Combine sizes

```js
Bytes.fromString("1 GB").add("500 MB").toString();
// "1.5 GB"
```

### Localize output

```js
Bytes.fromString("1,234.56 GiB", { locale: "en" }).toDecimal({ locale: "fr" });
// "1,33 TB"
```

## Comparison

| Feature | `@batou.dev/bytes` | `bytes` | `filesize` |
|---|---|---|---|
| Parse | ✅ | ✅ | ❌ |
| Format | ✅ | ✅ | ✅ |
| Convert units | ✅ | ❌ | ❌ |
| Arithmetic | ✅ | ❌ | ❌ |
| i18n | ✅ | ❌ | ⚠️ |

> ⚠️ _`filesize` supports localized formatting but does not use native `Intl` APIs or integrate i18n across parsing and conversion._

## Links

* 📘 Documentation: [js-bytes.batou.dev](https://js-bytes.batou.dev/)
* 📝 Changelog: [CHANGELOG.md](https://github.com/vbatoufflet/js-bytes/blob/main/CHANGELOG.md)
* 📦 npm: [@batou.dev/bytes](https://www.npmjs.com/package/@batou.dev/bytes)

## License

MIT — see [LICENSE](https://github.com/vbatoufflet/js-bytes/blob/main/LICENSE) for details.
