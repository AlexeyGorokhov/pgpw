'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/transaction/process-args';

const getSelf = (stubs = {}) => {
  const {
    buildTransactionModeStub = () => {}
  } = stubs;

  return proxyquire('../../../../lib/transaction/process-args', {
    './build-transaction-mode': buildTransactionModeStub
  });
};

test(`${mn} > call with all arguments present`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const transactionModeStub = {};
  const implementorStub = () => {};
  const optionsStub = {};

  const result = self(transactionModeStub, implementorStub, optionsStub);

  t.equal(
    stubs.buildTransactionModeStub.calledWith(transactionModeStub),
    true,
    'should not swap transaction mode and implementor'
  );

  t.equal(
    result.executionOptions,
    optionsStub,
    'should return options'
  );

  t.end();
});

test(`${mn} > call without transaction mode settings`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const implementorStub = () => {};
  const optionsStub = {};

  const result = self(implementorStub, optionsStub);

  t.equal(
    stubs.buildTransactionModeStub.called,
    false,
    'should not invoke transaction mode builder'
  );

  t.equal(
    result.executionOptions,
    optionsStub,
    'should return options'
  );

  t.end();
});

test(`${mn} > implementor is not a function`, t => {
  try {
    const self = getSelf();
    const implementorStub = 'not_a_function';

    self(implementorStub);

    t.end(new Error('expected to throw'));
  } catch (err) {
    t.equal(
      err instanceof TypeError,
      true,
      'should throw a TypeError'
    );

    t.end();
  }
});

test(`${mn} > call without options`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const transactionModeStub = {};
  const implementorStub = () => {};

  const result = self(transactionModeStub, implementorStub);

  t.equal(
    stubs.buildTransactionModeStub.calledWith(transactionModeStub),
    true,
    'should not swap transaction mode and implementor'
  );

  t.deepEqual(
    result.executionOptions,
    {},
    'should return empty options object'
  );

  t.end();
});

test(`${mn} > call without transaction mode and options`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const implementorStub = () => {};

  const result = self(implementorStub);

  t.equal(
    stubs.buildTransactionModeStub.called,
    false,
    'should not invoke transaction mode builder'
  );

  t.equal(
    typeof result.transactionImplementor,
    'function',
    'should return implementor as a function'
  );

  t.deepEqual(
    result.executionOptions,
    {},
    'should return empty options object'
  );

  t.end();
});
