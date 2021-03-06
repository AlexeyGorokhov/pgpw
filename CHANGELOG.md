# Change Log

## [5.0.0] - 2021-02-18

* Upgrade underlying `pg-promise` library to v10





## [4.0.0] - 2019-03-22

### New Features

V4 comes with both `execFunc` and `transaction` methods implementing user-defined retry strategy. Adding this functionality has involved significant changes to the codebase. Although this module is thoroughly covered with tests, the author has decided to bump the major version in order for providing smoother experience for those who still believe in the idea of semver and don't lock their dependencies.

### Other changes

* Upgrade dev dependencies





## [3.0.0] - 2018-09-10

### Breaking Changes

#### Upgrade underlying `pg-promise` library to v8

In v8, `pg-promise` library no longer supports callback function modifications for transactions and tasks. In its method `db.transaction(implementor)`, `pgpw` allowed `implementor` to use original `pg-promise`'s methods `t.tx()` and `t.task()` which now have changed their signatures. So, we have been forced to bump the major version of `pgpw`.

### New Features

* Add transaction mode settings as an optional parameter to `db.transaction()`.





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
