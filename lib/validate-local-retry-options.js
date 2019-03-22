'use strict';

const defaultRetryOptions = require('./default-retry-options');
const validateRetryOptionsComponents = require('./validate-retry-options-components');

/**
 * Validate local retry options
 *
 * @param {Object} options
 *
 * @return {Object|null} Retry options or null if there are no of them
 *
 * @throws {TypeError} <- validateRetryOptionsComponents
 *
 * @private
 */
module.exports = function validateLocalRetryOptions (options) {
  if (!('retry' in options)) return null;

  const { retry: retryOptions } = options;

  if (retryOptions === false) return defaultRetryOptions;

  validateRetryOptionsComponents(retryOptions);

  return retryOptions;
};
