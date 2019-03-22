'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache();

const DEFAULT_RETRY_OPTIONS = require('../../../lib/default-retry-options');

const mn = 'lib/validate-local-retry-options';

const getSelf = (stubs = {}) => {
  const {
    validateRetryOptionsComponentsStub = () => {}
  } = stubs;

  return proxyquire('../../../lib/validate-local-retry-options', {
    './validate-retry-options-components': validateRetryOptionsComponentsStub
  });
};

test(`${mn} > options do not contain retry settings`, t => {
  const self = getSelf();
  const optionsStub = {};

  const result = self(optionsStub);

  t.equal(
    result,
    null,
    'should return null'
  );

  t.end();
});

test(`${mn} > passed false value`, t => {
  const self = getSelf();
  const optionsStub = { retry: false };

  const result = self(optionsStub);

  t.deepEqual(
    result,
    DEFAULT_RETRY_OPTIONS,
    'should return default retry options'
  );

  t.end();
});

test(`${mn} > passed a non-false value > validation passes`, t => {
  const self = getSelf({
    validateRetryOptionsComponentsStub: () => {}
  });
  const RETRY_OPTIONS = {};
  const optionsStub = { retry: RETRY_OPTIONS };

  const result = self(optionsStub);

  t.equal(
    result,
    RETRY_OPTIONS,
    'should return passed retry options'
  );

  t.end();
});

test(`${mn} > passed a truthy value > validation fails`, t => {
  const self = getSelf({
    validateRetryOptionsComponentsStub: () => { throw new Error(''); }
  });
  const RETRY_OPTIONS = {};
  const optionsStub = { retry: RETRY_OPTIONS };
  const fn = () => self(optionsStub);

  t.throws(fn, Error, 'should throw an Error');

  t.end();
});
