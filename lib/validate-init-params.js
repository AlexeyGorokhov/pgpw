'use strict';

const isIp = require('is-ip');

/**
 * Validate the init method parameters
 *
 * @param {Any} name
 * @param {Any} cnDetails
 *
 * @return {Void}
 *
 * @throws {TypeError} In case of validation failure
 *
 * @public
 */
module.exports = function (name, cnDetails) {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError('parameter "name" must be a none-empty string');
  }

  if (!cnDetails) {
    throw new TypeError('parameter "cnDetails" must be an object');
  }

  if (!('host' in cnDetails)) {
    throw new TypeError('"cnDetails.host" parameter is missing');
  }

  if (cnDetails.host !== 'localhost' && !isIp(cnDetails.host)) {
    throw new TypeError('"cnDetails.host" value must be "localhost" or an IPv4/IPv6 address');
  }

  if (!('port' in cnDetails)) {
    throw new TypeError('"cnDetails.port" parameter is missing');
  }

  const port = parseInt(cnDetails.port, 10);

  if (isNaN(port)) {
    throw new TypeError('"cnDetails.port" value must be an integer');
  }

  if (port < 0 || port > 65535) {
    throw new RangeError('"cnDetails.port" value must be >= 0 and <= 65535');
  }

  if (typeof cnDetails.database !== 'string' || cnDetails.database === '') {
    throw new TypeError('"cnDetails.database" value must be a none-empty string');
  }

  if (typeof cnDetails.user !== 'string' || cnDetails.user === '') {
    throw new TypeError('"cnDetails.user" value must be a none-empty string');
  }

  if (typeof cnDetails.password !== 'string') {
    throw new TypeError('"cnDetails.password" value must be a string');
  }
};
