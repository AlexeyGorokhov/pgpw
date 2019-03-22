'use strict';

const validateRetryOptionsComponents = require('./validate-retry-options-components');

/**
 * Validate global retry options
 *
 * @param {Any} retryOptions
 *
 * @return {Object|null} Retry options or null if there are no of them
 *
 * @throws {TypeError} <- validateRetryOptionsComponents
 *
 * @private
 */
module.exports = function validateGlobalRetryOptions (retryOptions) {
  if (!retryOptions) return null;

  validateRetryOptionsComponents(retryOptions);

  return retryOptions;
};
