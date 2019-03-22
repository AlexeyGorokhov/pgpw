'use strict';

const buildTransactionMode = require('./build-transaction-mode');

/**
 * Process incoming arguments
 *
 * @param {Object} [transactionMode]
 * @param {Function} implementor
 * @param {Object} [options]
 *
 * @return {Object}
 *     @prop {TransactionMode|null} mode TransactionMode type is defined by pg-promise
 *     @prop {Function} transactionImplementor
 *     @prop {Object} executionOptions
 *
 * @throws {TypeError} transaction implementor is not a function
 */
module.exports = function processArgs (transactionMode, implementor, options) {
  if (typeof transactionMode === 'function') {
    options = implementor || {};
    implementor = transactionMode;
    transactionMode = null;
  }

  if (typeof implementor !== 'function') {
    throw new TypeError('parameter "implementor" must be a function');
  }

  return {
    mode: transactionMode == null ? null : buildTransactionMode(transactionMode),
    transactionImplementor: implementor,
    executionOptions: options || {}
  };
};
