'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/transaction/execute';

const getSelf = (opts = {}) => {
  const {
    calculateRetryDelayStub = () => 0,
    makeAttemptStub = () => Promise.resolve(),
    identifyDbUnavailableErrorStub = () => false
  } = opts;

  return proxyquire('../../../../lib/transaction/execute', {
    '../calculate-retry-delay': calculateRetryDelayStub,
    './make-attempt': makeAttemptStub,
    '../identify-db-unavailable-error': identifyDbUnavailableErrorStub
  });
};

test(`${mn} > ideal scenario`, async t => {
  try {
    const stubs = {
      makeAttemptStub: sinon.spy(() => Promise.resolve())
    };
    const self = getSelf(stubs);
    const optsStub = {};

    await self(optsStub);

    t.equal(
      stubs.makeAttemptStub.calledOnce,
      true,
      'should make only one execution attempt'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > database unavailable`, async t => {
  try {
    const getMakeAttempStub = () => {
      let counter = 0;

      return () => {
        if (++counter === 1) {
          return Promise.reject(new Error(''));
        }

        return Promise.resolve();
      };
    };
    const makeAttemptStub = sinon.spy(getMakeAttempStub());
    const stubs = {
      makeAttemptStub,
      identifyDbUnavailableErrorStub: () => true
    };
    const self = getSelf(stubs);
    const optsStub = {
      retryOpts: {
        maxAttempts: 5
      }
    };

    await self(optsStub);

    t.equal(
      stubs.makeAttemptStub.calledTwice,
      true,
      'should make two execution attempts'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > database unavailable error happens more than max attempts setting`, async t => {
  try {
    const stubs = {
      makeAttemptStub: () => Promise.reject(new Error('')),
      identifyDbUnavailableErrorStub: () => true
    };
    const self = getSelf(stubs);
    const optsStub = {
      retryOpts: {
        maxAttempts: 1
      }
    };

    await self(optsStub);

    t.end('should not resolve');
  } catch (err) {
    t.equal(
      err.name,
      'DatabaseUnavailable',
      'should reject with a DatabaseUnavailable error'
    );

    t.end();
  }
});

test(`${mn} > not a database unavailable error`, async t => {
  try {
    const stubs = {
      makeAttemptStub: () => Promise.reject(new Error('')),
      identifyDbUnavailableErrorStub: () => false
    };
    const self = getSelf(stubs);
    const optsStub = {};

    await self(optsStub);

    t.end('should not resolve');
  } catch (err) {
    t.equal(
      err.name,
      'UnexpectedError',
      'should reject with an UnexpectedError error'
    );

    t.end();
  }
});
