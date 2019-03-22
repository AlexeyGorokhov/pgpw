'use strict';

const test = require('tape');

const self = require('../../../lib/validate-retry-options-components');
const mn = 'lib/validate-retry-options-components';

const getCorrectOptions = () => ({
  initialDelayMs: 200,
  maxAttempts: 3,
  exponent: 2
});

test(`${mn} > passed a fully correct options object`, t => {
  const opts = getCorrectOptions();
  const fn = () => self(opts);

  t.doesNotThrow(fn, 'should not throw');
  t.end();
});

test(`${mn} > initialDelayMs is not an integer`, t => {
  const opts = {
    ...getCorrectOptions(),
    initialDelayMs: 123.45
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > initialDelayMs is not a Number`, t => {
  const opts = {
    ...getCorrectOptions(),
    initialDelayMs: '123'
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > initialDelayMs is a negative integer`, t => {
  const opts = {
    ...getCorrectOptions(),
    initialDelayMs: -1
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > initialDelayMs is 0`, t => {
  const opts = {
    ...getCorrectOptions(),
    initialDelayMs: 0
  };
  const fn = () => self(opts);

  t.doesNotThrow(fn, 'should not throw');
  t.end();
});

test(`${mn} > maxAttempts is not an integer`, t => {
  const opts = {
    ...getCorrectOptions(),
    maxAttempts: 1.4
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > maxAttempts is not a Number`, t => {
  const opts = {
    ...getCorrectOptions(),
    maxAttempts: '3'
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > maxAttempts is a negative integer`, t => {
  const opts = {
    ...getCorrectOptions(),
    maxAttempts: -1
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > maxAttempts is 0`, t => {
  const opts = {
    ...getCorrectOptions(),
    maxAttempts: 0
  };
  const fn = () => self(opts);

  t.doesNotThrow(fn, TypeError, 'should not throw');
  t.end();
});

test(`${mn} > exponent is not a Number`, t => {
  const opts = {
    ...getCorrectOptions(),
    exponent: '3'
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > exponent is a negative number`, t => {
  const opts = {
    ...getCorrectOptions(),
    exponent: -2
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});

test(`${mn} > exponent is 0`, t => {
  const opts = {
    ...getCorrectOptions(),
    exponent: 0
  };
  const fn = () => self(opts);

  t.throws(fn, TypeError, 'should throw a TypeError');
  t.end();
});
