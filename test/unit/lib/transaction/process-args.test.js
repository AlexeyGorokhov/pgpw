'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/transaction/process-args';

const getSelf = ({
  buildTransactionModeStub = () => {}
} = {}) => proxyquire('../../../../lib/transaction/process-args', {
  './build-transaction-mode': buildTransactionModeStub
});

test(`${mn} > normal call with transaction mode settings`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const transactionModeStub = {};
  const implementorStub = () => {};

  self(transactionModeStub, implementorStub);

  t.equal(
    stubs.buildTransactionModeStub.calledWith(transactionModeStub),
    true,
    'should not swap arguments'
  );

  t.end();
});

test(`${mn} > normal call without transaction mode settings`, t => {
  const stubs = {
    buildTransactionModeStub: sinon.spy()
  };
  const self = getSelf(stubs);
  const implementorStub = () => {};

  self(implementorStub);

  t.equal(
    stubs.buildTransactionModeStub.called,
    false,
    'should not invoke transaction mode builder'
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
