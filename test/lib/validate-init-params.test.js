'use strict';

const test = require('tape');

const self = require('../../lib/validate-init-params');
const moduleName = 'lib/validate-init-params.js';

const getDefaultCnDetailsStub = () => ({
  host: '192.168.1.0',
  port: 5432,
  database: 'db_name',
  user: 'user_name',
  password: 'psw'
});

test(`${moduleName} > missing "name" param`, t => {
  const fn = () => self();

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "name" param is not a string`, t => {
  const fn = () => self(['not_a_string']);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "name" param is an empty string`, t => {
  const fn = () => self('');

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > missing "cnDetails" param`, t => {
  const fn = () => self('a_string');

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > missing "cnDetails.host" prop`, t => {
  const cnStub = getDefaultCnDetailsStub();
  delete cnStub.host;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is not a correct IPv4 address format`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.host = '123.234.2';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is not a correct IPv4 address`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.host = '145.342.345.2';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is not a correct IPv6 address format`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.host = '1:2:t:4';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is a correct IPv4 address`, t => {
  const cnStub = getDefaultCnDetailsStub();
  const fn = () => self('a_string', cnStub);

  t.doesNotThrow(fn, TypeError, 'Should not throw');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is a correct IPv6 address`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.host = '1:2:3:4';
  const fn = () => self('a_string', cnStub);

  t.doesNotThrow(fn, TypeError, 'Should not throw');
  t.end();
});

test(`${moduleName} > "cnDetails.host" is "localhost"`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.host = 'localhost';
  const fn = () => self('a_string', cnStub);

  t.doesNotThrow(fn, TypeError, 'Should not throw');
  t.end();
});

test(`${moduleName} > missing "cnDetails.port" prop`, t => {
  const cnStub = getDefaultCnDetailsStub();
  delete cnStub.port;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.port" is not a number`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.port = 'not_a_number';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.port" < 0`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.port = -1;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, RangeError, 'Should throw a RangeError');
  t.end();
});

test(`${moduleName} > "cnDetails.port" > 65535`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.port = 65536;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, RangeError, 'Should throw a RangeError');
  t.end();
});

test(`${moduleName} > missing "cnDetails.database" prop`, t => {
  const cnStub = getDefaultCnDetailsStub();
  delete cnStub.database;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.database" value is an empty string`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.database = '';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > missing "cnDetails.user" prop`, t => {
  const cnStub = getDefaultCnDetailsStub();
  delete cnStub.user;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.user" value is an empty string`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.user = '';
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > missing "cnDetails.password" prop`, t => {
  const cnStub = getDefaultCnDetailsStub();
  delete cnStub.password;
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.password" value is not a string`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.password = [];
  const fn = () => self('a_string', cnStub);

  t.throws(fn, TypeError, 'Should throw a TypeError');
  t.end();
});

test(`${moduleName} > "cnDetails.password" is an empty string`, t => {
  const cnStub = getDefaultCnDetailsStub();
  cnStub.password = '';
  const fn = () => self('a_string', cnStub);

  t.doesNotThrow(fn, TypeError, 'Should not throw');
  t.end();
});

test(`${moduleName} > all correct data`, t => {
  const cnStub = getDefaultCnDetailsStub();
  const fn = () => self('a_string', cnStub);

  t.doesNotThrow(fn, 'Should not throw');
  t.end();
});
