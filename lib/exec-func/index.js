'use strict';

const validateLocalRetryOptions = require('../validate-local-retry-options');
const defaultRetryOptions = require('../default-retry-options');
const execute = require('./execute');

/**
 * Execute a single database function in a separate db connection
 *
 * @param {String} name Database function name
 * @param {Array<Any>} params Database function parameters
 * @param {Object} [options] Additional options for execution
 *     @prop {Object|Boolean} [retry] Retry options which override, for this execution,
 *         default retry strategy the database object has been initialised with.
 *         @prop {Integer} initialDelayMs Initial delay in milliseconds for first retry
 *         @prop {Integer} maxAttempts Maximum amount of retry attempts
 *         @prop {Number} exponent Multiplicator for calculation of delay for next attempt
 *
 * @this {Object} Database object
 *
 * @return {Promise<Any>} Data returned by the function
 *
 * @throws {DatabaseUnavailable} Connecting to database fails <- execute
 *     @prop {Object} info
 *         @prop {String} address Database address
 *         @prop {Integer} port Database port
 * @throws {UnexpectedError} <- execute
 *     @prop {Error} cause
 *
 * @public
 */
module.exports = async function execFunc (name, params, options = {}) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('parameter "name" must be a non-empty string');
  }

  if (!Array.isArray(params)) {
    throw new TypeError('parameter "params" must be an Array');
  }

  if (this._db == null) {
    throw new Error('database is not initialized with connection details');
  }

  const retryOpts =
    validateLocalRetryOptions(options) ||
    this.retryOptions ||
    defaultRetryOptions;

  const data = await execute({
    db: this._db,
    name,
    params,
    retryOpts
  });

  return data;
};
