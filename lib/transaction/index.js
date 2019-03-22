'use strict';

const processArgs = require('./process-args');
const validateLocalRetryOptions = require('../validate-local-retry-options');
const defaultRetryOptions = require('../default-retry-options');
const execute = require('./execute');

/**
 * Execute tasks withing a transaction in one db connection
 *
 * @param {Object} [transactionMode] Transaction mode settings
 *     @prop {db.isolationLevel} isolationLevel Optional. Transaction isolation level.
 *         If not provided, or the provided value doesn't match `db.isolationLevel` enumeration,
 *         defaults to having no effect on transaction mode
 *     @prop {Boolean} isReadOnly Optional. Sets transaction access mode.
 *         The exact value `true` adds `BEGIN READ ONLY`.
 *         The exact value `false` adds `BEGIN READ WRITE`.
 *         Any other value (including `undefined`, i.e. the property is not provided)
 *         adds nothing to the `BEGIN` command
 *     @prop {Boolean} isDeferrable Optional. Sets transaction deferrable mode.
 *         The exact value `true` adds `BEGIN DEFERRABLE`.
 *         The exact value `false` adds `BEGIN NOT DEFERRABLE`.
 *         Any other value (including `undefined`, i.e. the property is not provided)
 *         adds nothing to the `BEGIN` command.
 *         This setting has effect only when `isolationLevel = db.isolationLevel.serializable`
 *         and `isReadOnly = true`, or else it is ignored
 * @param {Function} implementor(t) Function that is called to execute tasks.
 *     Whithin the function, it is possible to use any type of task provided by
 *     the pg-promise library (i.e., t.func(), t.query(), t.task(), etc) including
 *     nested transactions (t.tx()).
 *
 *     The function must return either
 *            t.batch([task1, task2, ...]) - for parallel task execution,
 *        or
 *            t.sequence(source) - for serial task execution
 * @param {Object} [options] For details see JSDoc for exec-func
 *     @prop {Object|Boolean} [retry]
 *         @prop {Integer} initialDelayMs
 *         @prop {Integer} maxAttempts
 *         @prop {Number} exponent
 *
 * @this {Object} Database object
 *
 * @return {Promise<Any>} Resolves with the result of executing the tasks
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
module.exports = async function transaction (transactionMode, implementor, options) {
  const {
    mode,
    transactionImplementor,
    executionOptions
  } = processArgs(transactionMode, implementor, options);

  if (this._db == null) {
    throw new Error('database is not initialized with connection details');
  }

  const retryOpts =
    validateLocalRetryOptions(executionOptions) ||
    this.retryOptions ||
    defaultRetryOptions;

  const data = await execute({
    db: this._db,
    mode,
    transactionImplementor,
    retryOpts
  });

  return data;
};
