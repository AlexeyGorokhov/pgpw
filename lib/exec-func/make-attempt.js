'use strict';

/**
 * Make an attempt of database function execution with provided delay
 *
 * @param {Object}
 *     @prop {Object} db Database object
 *     @prop {String} name Database function name
 *     @prop {Array<Any>} params Database function parameters
 *     @prop {Integer} delayMs Execution delay in milliseconds
 *
 * @return {Promise<Any>} Resolves with data returned by the database function
 *
 * @throws {*} Rejects with the original database operation error
 *
 * @private
 */
module.exports = function makeAttempt (opts) {
  const {
    db,
    name,
    params,
    delayMs
  } = opts;

  return new Promise((resolve, reject) => {
    if (delayMs === 0) {
      makeDbRequest();
    } else {
      setTimeout(makeDbRequest, delayMs);
    }

    function makeDbRequest () {
      Promise.resolve(db.func(name, params))
        .then(resolve)
        .catch(reject);
    }
  });
};
