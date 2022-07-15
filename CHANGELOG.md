Changelog
=========

0.5.1 - (2022-07-15)
--------------------

* Fix exception with null and undefined values in isBytes

0.5.0 - (2022-01-05)
--------------------

* Add support for unit conversion

0.4.0 - (2021-04-19)
--------------------

* Add methods to add/subtract an amount of bytes to/from the current value
* Add `%v` and `%V` verbs support to format specifier
* Fix missing type guard on isBytes() method

Breaking changes:

* Rename toBytes() into valueOf() to use as primitive value

0.3.0 - (2021-04-18)
--------------------

* Add options to handle sign printing, output unit and printing width
* Add support for printf-like formatting
* Make formatting options parameters optional

0.2.0 - (2021-04-16)
--------------------

* Add support for negative values
* Add handling of common Unicode space separators
* New `space` and `suffix` formatting options

0.1.2 - (2021-04-14)
--------------------

* Update documentation generation script
* Add missing typings

0.1.1 - (2021-04-14)
--------------------

* Add keywords and repository to package.json

0.1.0 - (2021-04-14)
--------------------

Initial release
