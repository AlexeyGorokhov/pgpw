# Change Log

## [2.2.0] - 2018-02-08

* Allow to pass an array of stubs

## [2.1.0] - 2018-02-08

* Add testing stubs
* Dependency updates

## [2.0.2] - 2017-04-22

### Fixes

* Fix handling custom errors coming in from `pg-promise` in `transaction` method.

## [2.0.1] - 2017-04-05

### Fixes

* Fix handling an array of errors coming in from `pg-promise` in `transaction` method.

## [2.0.0] - 2017-01-02

### Breaking changes

* `DatabaseUnavailable` error extra properties (`address` and `port`) have been moved to the VError's `info` constructor option, so it can be accessed via the static method `VError.info(err)`.

## [1.0.0] - 2016-12-17

Initial release.
