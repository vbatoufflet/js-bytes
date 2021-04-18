Bytes
=====

Bytes is a library to parse and format byte sizes in JavaScript with native
Intl support.

```typescript
Bytes.fromBytes(1024).toString() // = 1 KiB

Bytes.fromString("1,234.56 GiB", {locale: "en"}).toDecimal({locale: "fr"}) // = 1,33 TB

Bytes.fromString("1234.56kB").toFormat("%.3m") // = 1.235 MB

Bytes.fromString("1234.56 GiB").valueOf() // = 1325598706237
```

Note
----

⚠️ IMPORTANT: this library is at an early stage, thus breaking changes might
still occur as its development evolves.

Resources
---------

* [Documentation](https://js-bytes.batou.dev/)
* [Changelog](https://github.com/vbatoufflet/js-bytes/blob/master/CHANGELOG.md)

License
-------

This code is licensed and distributed under the term of the
[MIT](https://opensource.org/licenses/MIT) license.
