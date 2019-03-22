'use strict';

const pgp = require('pg-promise');

const execFunc = require('./exec-func');
const transaction = require('./transaction');

/**
 * Create a database object initialized or uninitialized with connection details
 *
 * @param {Object} [cnDetails] Database connection details. If not provided, an uninitialized
 *        database object is returned.
 * @param {Object} [retryOptions] Must not be passed if cnDetails is not passed
 *
 * @return {Object}
 *     @prop {Object|null} _db
 *     @prop {Object|null} retryOptions
 *     @prop {Object} isolationLevel
 *     @prop {Function} execFunc
 *     @prop {Function} transaction
 *
 * @private
 */
module.exports = function createDbConnObject (cnDetails, retryOptions) {
  return Object.create(null, {
    '_db': {
      value: cnDetails ? pgp()(cnDetails) : null,
      writable: true
    },
    'retryOptions': {
      value: retryOptions || null
    },
    'isolationLevel': {
      value: {
        serializable: 'serializable',
        repeatableRead: 'repeatableRead',
        readCommitted: 'readCommitted'
      }
    },
    'execFunc': {
      value: execFunc
    },
    'transaction': {
      value: transaction
    }
  });
};
