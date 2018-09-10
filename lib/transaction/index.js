'use strict';

const VError = require('verror');

const processArgs = require('./process-args');

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
 * @param {Function} implementor(t) Function that is called to execute tasks
 *     Whithin the function, it is possible to use any type of task provided by
 *     the pg-promise library (i.e., t.func(), t.query(), t.task(), etc) including
 *     nested transactions (t.tx()).
 *
 *     The function must return either
 *            t.batch([task1, task2, ...]) - for parallel task execution,
 *        or
 *            t.sequence(source) - for serial task execution
 *
 * @return {Promise<Any>} Resolves with the result of executing the tasks
 *
 * @throws {DatabaseUnavailable} Connecting to database fails
 *     @prop {Object} info
 *         @prop {String} address Database address
 *         @prop {Integer} port Database port
 * @throws {UnexpectedError}
 */
module.exports = async function transaction (transactionMode, implementor) {
  const { mode, transactionImplementor } = processArgs(transactionMode, implementor);

  if (this._db == null) {
    throw new Error('database is not initialized with connection details');
  }

  try {
    const data = await Promise.resolve(this._db.tx({ mode }, transactionImplementor));
    return data;
  } catch (error) {
    const err = typeof error.getErrors === 'function' ? error.getErrors()[0] : error;

    if (err instanceof VError) {
      throw err;
    }

    if (err.errno && ['ECONNREFUSED', 'ETIMEDOUT'].includes(err.errno)) {
      throw new VError(
        {
          name: 'DatabaseUnavailable',
          info: {
            address: err.address,
            port: err.port
          }
        },
        'failed connecting to database'
      );
    }

    throw new VError(
      {
        name: 'UnexpectedError',
        cause: err
      },
      `An error occurred while executing transaction`
    );
  }
};
