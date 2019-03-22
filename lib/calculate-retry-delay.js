'use strict';

/**
 * Calculate retry attempt delay from given retry options and attempt number
 *
 * @prop {Object} retryOptions
 *     @prop {Integer} initialDelayMs
 *     @prop {Number} exponent
 * @prop {Integer} attemptNum
 *
 * @return {Integer}
 */
module.exports = function calculateRetryDelay (retryOptions, attemptNum) {
  const { initialDelayMs, exponent } = retryOptions;

  return attemptNum === 0
    ? 0
    : Math.floor(initialDelayMs * exponent ** (attemptNum - 1));
};
