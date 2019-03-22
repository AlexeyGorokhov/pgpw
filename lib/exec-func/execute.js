'use strict';

const VError = require('verror');

const calculateRetryDelay = require('../calculate-retry-delay');
const makeAttempt = require('./make-attempt');
const identifyDbUnavailableError = require('../identify-db-unavailable-error');

/**
 * Execute database function with provided retry strategy
 *
 * Calls itself recursively
 *
 * @param {Object} opts
 *     @prop {Object} db Database object
 *     @prop {String} name Database function name
 *     @prop {Array<Any>} params Database function parameters
 *     @prop {Object} retryOpts Retry options
 *     @prop {Integer} [attemptNum] Number of retry attempt. Defaults to 0 for initial call
 *
 * @return {Promise<Any>} Data returned by the database function
 *
 * @throws {DatabaseUnavailable} Connecting to database fails
 *     @prop {Object} info
 *         @prop {String} address Database address
 *         @prop {Integer} port Database port
 * @throws {UnexpectedError}
 *     @prop {Error} cause
 *
 * @private
 */
module.exports = async function execute (opts) {
  const {
    db,
    name,
    params,
    retryOpts,
    attemptNum = 0
  } = opts;

  const delayMs = calculateRetryDelay(retryOpts, attemptNum);

  try {
    const data = await makeAttempt({
      db,
      name,
      params,
      delayMs
    });

    return data;
  } catch (err) {
    if (identifyDbUnavailableError(err)) {
      const { maxAttempts } = retryOpts;

      if (attemptNum < maxAttempts) {
        return execute({
          db,
          name,
          params,
          retryOpts,
          attemptNum: attemptNum + 1
        });
      }

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
      `an error occurred while executing function "${name}"`
    );
  }
};
