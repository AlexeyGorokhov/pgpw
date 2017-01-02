# Change Log

## [1.0.0] - 2016-12-17

Initial release.

## [2.0.0] - 2017-01-02

* __Breaking.__ `DatabaseUnavailable` error extra properties (`address` and `port`) have been moved to the VError's `info` constructor option, so it can be accessed via the static method `VError.info(err)`.
