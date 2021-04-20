Bytes
=====

Bytes is a library for working with byte sizes in JavaScript with native Intl
support.

```js
Bytes.fromBytes(1024).toString() // = 1 KiB

Bytes.fromString("1,234.56 GiB", {locale: "en"}).toDecimal({locale: "fr"}) // = 1,33 TB

Bytes.fromString("1234.56kB").toFormat("%.3m") // = 1.235 MB

Bytes.fromString("1234.56 GiB").valueOf() // = 1325598706237

Bytes.fromString("123.45 MB").add("1.23 MiB").toBinary() // = 118.96 MiB
```

Install
-------

To get started using Bytes, add the dependency via npm:

```
npm install @batou.dev/bytes
```

ES6:
```js
import {Bytes} from "@batou.dev/bytes";
```

Node.js:
```js
const {Bytes} = require("@batou.dev/bytes");
```

Note
----

⚠️ IMPORTANT: this library is at an early stage, thus breaking changes might
still occur as its development evolves.

Links
-----

* [Documentation](https://js-bytes.batou.dev/)
* [Changelog](https://github.com/vbatoufflet/js-bytes/blob/master/CHANGELOG.md)
* [npm package](https://www.npmjs.com/package/@batou.dev/bytes)

License
-------

This code is licensed and distributed under the term of the
[MIT](https://opensource.org/licenses/MIT) license.
