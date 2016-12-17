'use strict';

const VError = require('verror');

/**
 * Execute a single database function in a separate db connection
 *
 * @param {String} name - Function name
 * @param {Array<Any>} params - Function parameters
 *
 * @return {Promise<Any>} - Data returned by the function
 *         Rejects with:
 *             {DatabaseUnavailable} - If connecting to database fails
 *                 address - Database address
 *                 port - Database port
 *             {UnexpectedError}
 * @public
 */
module.exports = function execFunc (name, params) {
  return new Promise((resolve, reject) => {
    if (typeof name !== 'string' || name.length === 0) {
      reject(new TypeError('parameter "name" must be a non-empty string'));
    }

    if (!Array.isArray(params)) {
      reject(new TypeError('parameter "params" must be an Array'));
    }

    if (this._db == null) {
      reject(new Error('database is not initialized with connection details'));
    }

    return Promise.resolve(this._db.func(name, params))
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
        `an error occurred while executing function "${name}"`
      ));
    });
  });
};
