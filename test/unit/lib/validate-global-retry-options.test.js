'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const mn = 'lib/validate-global-retry-options';

const getSelf = (stubs = {}) => {
  const {
    validateRetryOptionsComponentsStub = () => {}
  } = stubs;

  return proxyquire('../../../lib/validate-global-retry-options', {
    './validate-retry-options-components': validateRetryOptionsComponentsStub
  });
};

test(`${mn} > passed a falsey value`, t => {
  const self = getSelf();
  const results = [undefined, null, 0, false, ''].map(self);

  t.equal(
    results.every(result => result === null),
    true,
    'should return null'
  );

  t.end();
});

test(`${mn} > passed a truthy value > validation passes`, t => {
  const self = getSelf({
    validateRetryOptionsComponentsStub: () => {}
  });
  const RETRY_OPTIONS = {};

  const result = self(RETRY_OPTIONS);

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
  const fn = () => self(RETRY_OPTIONS);

  t.throws(fn, Error, 'should throw an Error');

  t.end();
});
