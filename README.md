# pgpw

Opinionated wrapper around the [pg-promise](https://www.npmjs.com/package/pg-promise) library.

The module provides the following features:

* connection pool singletone for the entire application;
* multiple database objects managed in one place;
* normalization to the native Promise;
* extended error handling with the use of [verror](https://www.npmjs.com/package/verror).

## v2 Breaking Changes

* `DatabaseUnavailable` error extra properties (`address` and `port`) have been moved to the VError's `info` constructor option, so it can be accessed via the static method `VError.info(err)`.

V1 documentation is available [here](https://github.com/AlexeyGorokhov/pgpw/blob/master/docs_archive/v1.md).

## Installation

```bash
$ npm install pgpw --save
```

## Usage

You should initialize database object(s) once per application (e.g., in your application's main function):

```javascript
const pgpw = require('pgpw');

// If your application works with two databases, you can initialize them both here

pgpw.init('db_one', {
  host: 'localhost',
  port: 5432,
  database: 'db_1',
  user: 'app',
  password: ''
});

pgpw.init('db_two', {
  host: process.env.DB2_HOST,
  port: process.env.DB2_PORT,
  database: process.env.DB2_NAME,
  user: process.env.DB2_USER,
  password: process.env.DB2_PSW
});
```

Then in a module, you have access to initialized database objects by its names

```javascript
// module.js
const dbOne = require('pgpw')('db_one');

// And use it
dbOne.execFunc(...)
.then(...)
.catch(...);
```

## API Reference

### `{Function} pgpw.init(name, cnDetails)`

Initialize a database object. You can initialize only one database object with a given name per application. Otherwise an Error is thrown.

Parameters:

* `{String} name` - Name of database object for further reference

* `{Object} cnDetails` - Database connection details
  * `{String} host` - Database host. Might be `localhost` or a valid IPv4/IPv6 address;
  * `{Integer} port` - Database port;
  * `{String} database` - Database name;
  * `{String} user` - Database role/user name;
  * `{String} password` - User password.

Returns: `void`.

### `{Function} pgpw(name)`

Returns database object by name.

Parameter:

* `{String} name` - Database object name.

Returns: `{Object}`.

### Database object (db)

#### `{Function} db.execFunc(name, params)`

Execute a single database function in a separate database connection.

Parameters:

* `{String} name` - Database function name.
* `{Array<Any>} params` - Database function parameters.

Returns: `{Promise<Any>}` - Data returned by the function.

#### `{Function} db.transaction(implementor)`

Parameter:

* `{Function} implementor(t)` - Function that is called to execute tasks. Whithin the function, it is possible to use any type of task provided by the pg-promise library (i.e., t.func(), t.query(), t.task(), etc) including nested transactions (t.tx()). The function must return either

  * `t.batch([task1, task2, ...])` - for parallel task execution, or
  * `t.sequence(source)` - for serial task execution.

Returns: `{Promise<Any>}` - Result of executing the tasks.

### Error handling

The Promise returned by `execFunc` and `transaction` methods rejects with the following VErrors:

* `DatabaseUnavailable` - when connecting to database fails. The error provides the following `info` properties:
  * `address {String}` - Database host;
  * `port {Number}` - Database port.

* `UnexpectedError` - when any other error occurred.
