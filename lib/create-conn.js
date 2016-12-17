'use strict';

const pgp = require('pg-promise')();

/**
 * Create connection details
 *
 * @param {Object} cnDetails - Database connection details
 *        @prop {String} host
 *        @prop {Integer} port
 *        @prop {String} database
 *        @prop {String} user
 *        @prop {String} password
 *
 * @return {Object}
 *
 * @public
 */
module.exports = function (cnDetails) {
  return pgp(cnDetails);
};
