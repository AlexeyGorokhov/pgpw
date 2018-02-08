# pgpw

Opinionated wrapper around the [pg-promise](https://www.npmjs.com/package/pg-promise) library.

This module provides the following features:

* connection pool singleton for the entire application;
* multiple database objects managed in one place;
* normalization to the native Promise;
* extended error handling with the use of [verror](https://www.npmjs.com/package/verror);
* stubs API to be used in unit testing.

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

Then in a module, you have access to initialized database objects by their names

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



## Stubs API

Stubs API provides for an unified way to stub the methods exposed by the module.

### `pgpw.stubs([{Object} customStubs])`

Returns function to be used in place of "required" `pgpw` module.

Generally, you don't need to call this function directly - it will be called by the require proxy you use in you test suit (think of [proxyquire](https://www.npmjs.com/package/proxyquire)). When called returns an object with the following keys:

* `{Function} execFunc()` - default or custom stub for `db.execFunc(...)` method;
* `{Function} transaction()` - default or custom stub for `db.transaction(...)` method.

You can pass your custom stubs through the optional parameter `customStubs` which accepts an object with keys `execFunc` and `transaction`. All keys are optional. For every key that is not provided, the default stub is returned. Default stub returns `Promise` that resolves with `null`.


### Usage Example

Say you want to unit test the following module:

```js
const db = require('pgpw')('my_db_name');

module.exports = async function retrieveDataFromDb () {
  const queryResult = await db.execFunc('func_name', ['param1', 'param2']);

  // Logic to test
  if (queryResult.length) {
    return 'foo';
  } else {
    return 'bar';
  }
};
```

Test file:

```js
const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache();
const dbStub = require('pgpw').stubs;

const getSelf = ({
  execFuncStub = () => Promise.resolve([])
} = {}) => proxyquire('./my-module', {
  'pgpw': dbStub({ execFunc: execFuncStub })
});

test('query returns data', async t => {
  try {
    const execFuncStub = () => Promise.resolve(['item1', 'item2']);
    const self = getSelf({ execFuncStub });

    const result = await self();

    t.equal(result, 'foo', 'should return foo');
    t.end();
  } catch (err) {
    t.end(err);
  }
});
```
