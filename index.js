'use strict';

const validateInitParams = require('./lib/validate-init-params');
const createDbConnObject = require('./lib/create-db-conn-object');
const createConn = require('./lib/create-conn');
const stubs = require('./lib/stubs');

const _databases = new Map();

module.exports = pgpw;

/**
 * Return database object by name
 *
 * @param {String} name
 *
 * @return {Object}
 *
 * @public
 */
function pgpw (name) {
  if (!_databases.has(name)) {
    _databases.set(name, createDbConnObject());
  }

  return _databases.get(name);
}

/**
 * Initialize a database object
 *
 * @param {String} name - Name of database object for further reference
 * @param {Object} cnDetails - Database connection details
 *        @prop {String} host
 *        @prop {Integer} port
 *        @prop {String} database - Database name
 *        @prop {String} user
 *        @prop {String} password
 *
 * @return {Void}
 *
 * @public
 */
pgpw.init = function (name, cnDetails) {
  if (_databases.has(name) && _databases.get(name)._db != null) {
    throw new Error(`database connection "${name}" is already initialized`);
  }

  validateInitParams(name, cnDetails);

  if (_databases.has(name) && _databases.get(name)._db == null) {
    _databases.get(name)._db = createConn(cnDetails);
  } else {
    _databases.set(name, createDbConnObject(cnDetails));
  }
};

pgpw.stubs = stubs;
