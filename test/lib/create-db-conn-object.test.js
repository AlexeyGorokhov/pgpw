'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const getDefaultStubs = () => ({
  pgpStub: () => () => ({}),
  execFuncStub: function () { return this; },
  transactionStub: function () { return this; }
});

const getSelf = ({
  pgpStub,
  execFuncStub,
  transactionStub
}) => {
  const self = proxyquire('../../lib/create-db-conn-object', {
    'pg-promise': pgpStub,
    './exec-func': execFuncStub,
    './transaction': transactionStub
  });

  return self;
};

test('lib/create-db-conn-object > Called with connection details', t => {
  const stubs = getDefaultStubs();
  const self = getSelf(stubs);

  const result = self({});

  t.equal(typeof result, 'object', 'should return object');
  t.equal(typeof result._db, 'object', 'should have initialized property _db');
  t.equal(typeof result.execFunc, 'function', 'should have method execFunc');
  t.equal(typeof result.transaction, 'function', 'should have method transaction');
  t.end();
});

test('lib/create-db-conn-object > Called without connection details', t => {
  const stubs = getDefaultStubs();
  const self = getSelf(stubs);

  const result = self();

  t.equal(typeof result, 'object', 'should return object');
  t.equal(result._db, null, 'should have uninitialized property _db');
  t.equal(typeof result.execFunc, 'function', 'should have method execFunc');
  t.equal(typeof result.transaction, 'function', 'should have method transaction');
  t.end();
});
