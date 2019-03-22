'use strict';

const errorCodes = [
  /**
   * There is no db cluster on the host/port provided
   */
  'ECONNREFUSED',

  /**
   * Timeout of an operation
   */
  'ETIMEDOUT',

  /**
   * There is no target database in the cluster
   */
  '3D000',

  /**
   * The database system is starting up
   */
  '57P03'
];

/**
 * Identify if passed error is related to database unabailability
 *
 * @param {Error} err
 *
 * @return {Boolean} Returns true if the error is related to database unabailability
 *
 * @private
 */
module.exports = function identifyDbUnavailableError (err) {
  return (err.code && errorCodes.includes(err.code)) ||
    err.message.toLowerCase() === 'connection terminated unexpectedly';
};
