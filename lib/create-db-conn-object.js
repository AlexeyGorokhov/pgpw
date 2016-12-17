'use strict';

const pgp = require('pg-promise')();
const execFunc = require('./exec-func');
const transaction = require('./transaction');

/**
 * Create a database object initialized or uninitialized with connection details
 *
 * @param {Object} [cnDetails] - Database connection details. If not provided, an
 *                               uninitialized database object is returned.
 *        @prop {String} host
 *        @prop {Integer} port
 *        @prop {String} database
 *        @prop {String} user
 *        @prop {String} password
 *
 * @return {Object}
 *         @prop {Object | null} _db
 *         @prop {Function} execFunc
 *         @prop {Function} transaction
 *
 * @public
 */
module.exports = function createDbConnObject (cnDetails) {
  return Object.create(null, {
    '_db': {
      value: cnDetails ? pgp(cnDetails) : null,
      writable: true
    },
    'execFunc': {
      value: execFunc
    },
    'transaction': {
      value: transaction
    }
  });
};
