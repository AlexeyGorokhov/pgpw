'use strict';

/**
 * Validate components of retry options
 *
 * @param {Any} retryOptions
 *
 * @return {Void}
 *
 * @throws {TypeError}
 *
 * @private
 */
module.exports = function validateRetryOptionsComponents (retryOptions) {
  const {
    initialDelayMs,
    maxAttempts,
    exponent
  } = retryOptions;

  if (Number.parseInt(initialDelayMs, 10) !== initialDelayMs || initialDelayMs < 0) {
    throw new TypeError('"retryOptions.initialDelayMs" value must be a non-negative integer');
  }

  if (Number.parseInt(maxAttempts, 10) !== maxAttempts || maxAttempts < 0) {
    throw new TypeError('"retryOptions.maxAttempts" value must be a a non-negative integer');
  }

  if (Number(exponent) !== exponent || exponent <= 0) {
    throw new TypeError('"retryOptions.exponent" value must be a positive number');
  }
};
