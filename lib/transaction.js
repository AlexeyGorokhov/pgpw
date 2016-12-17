'use strict';

const VError = require('verror');

/**
 * Execute tasks withing a transaction in one db connection
 *
 * @param {Function} implementor(t) - Function that is called to execute tasks.
 *
 *        Whithin the function, it is possible to use any type of task provided by
 *        the pg-promise library (i.e., t.func(), t.query(), t.task(), etc) including
 *        nested transactions (t.tx()).
 *
 *        The function must return either
 *            t.batch([task1, task2, ...]) - for parallel task execution,
 *        or
 *            t.sequence(source) - for serial task execution
 *
 * @return {Promise<Any>} - Resolves with the result of executing the tasks
 *         Rejects with:
 *             {DatabaseUnavailable} - If connecting to database fails
 *                 address - Database address
 *                 port - Database port
 *             {UnexpectedError}
 *
 * @public
 */
module.exports = function transaction (implementor) {
  return new Promise((resolve, reject) => {
    if (typeof implementor !== 'function') {
      reject(new TypeError('Parameter "implementor" parameter must be a function'));
    }

    if (this._db == null) {
      reject(new Error('database is not initialized with connection details'));
    }

    return Promise.resolve(this._db.tx(implementor))
    .then(data => resolve(data))
    .catch(err => {
      if (
        err.errno &&
        ['ECONNREFUSED', 'ETIMEDOUT'].includes(err.errno)
      ) {
        const e = new VError(err, 'failed connecting to database');
        e.name = 'DatabaseUnavailable';
        e.address = err.address;
        e.port = err.port;

        reject(e);
        return;
      }

      reject(new VError(
        {
          name: 'UnexpectedError',
          cause: err
        },
        `An error occurred while executing transaction`
      ));
    });
  });
};