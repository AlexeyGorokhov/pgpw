'use strict';

/**
 * Make an attempt of transaction execution with provided delay
 *
 * @param {Object}
 *     @prop {Object} db Database object
 *     @prop {Object} mode Transaction mode
 *     @prop {Function} transactionImplementor
 *     @prop {Integer} delayMs Execution delay in milliseconds
 *
 * @return {Promise<Any>} Resolves with data returned by the transaction
 *
 * @throws {*} Rejects with the original database operation error
 *
 * @private
 */
module.exports = function makeAttempt (opts) {
  const {
    db,
    mode,
    transactionImplementor,
    delayMs
  } = opts;

  return new Promise((resolve, reject) => {
    if (delayMs === 0) {
      makeDbRequest();
    } else {
      setTimeout(makeDbRequest, delayMs);
    }

    function makeDbRequest () {
      Promise.resolve(db.tx({ mode }, transactionImplementor))
        .then(resolve)
        .catch(reject);
    }
  });
};
