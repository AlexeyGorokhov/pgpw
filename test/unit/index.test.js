'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'index.js';

const getDefaultStubs = () => ({
  validateInitParamsStub: sinon.spy(),
  validateGlobalRetryOptionsStub: sinon.spy(() => ({})),
  createDbConnObjectStub: sinon.spy(() => ({ _db: {} })),
  createConnStub: sinon.spy(),
  stubsStub: () => {}
});

const getSelf = ({
  validateInitParamsStub,
  validateGlobalRetryOptionsStub,
  createDbConnObjectStub,
  createConnStub,
  stubsStub
}) => {
  const self = proxyquire('../../index', {
    './lib/validate-init-params': validateInitParamsStub,
    './lib/validate-global-retry-options': validateGlobalRetryOptionsStub,
    './lib/create-db-conn-object': createDbConnObjectStub,
    './lib/create-conn': createConnStub,
    './lib/stubs': stubsStub
  });

  return self;
};

const getCnDetailsStub = () => ({
  host: 'localhost',
  port: 5432,
  database: 'db_name',
  user: 'userName',
  password: ''
});

test(`${mn} > called with db name that does not exist`, t => {
  const stubs = getDefaultStubs();
  stubs.createDbConnObjectStub = sinon.spy(() => ({ _db: null }));
  const self = getSelf(stubs);

  const result = self('db1');

  t.equal(
    stubs.createDbConnObjectStub.called,
    true,
    'should create a new object'
  );
  t.equal(
    stubs.createDbConnObjectStub.getCall(0).args.length,
    0,
    'should call for creating an uninitialized database object'
  );
  t.equal(result._db, null, 'should return uninitialized database object');
  t.end();
});

test(`${mn} > called with existing db name`, t => {
  const stubs = getDefaultStubs();
  stubs.createDbConnObjectStub = sinon.spy(() => ({ _db: {} }));
  const self = getSelf(stubs);

  self('db1');
  const result = self('db1');

  t.equal(
    stubs.createDbConnObjectStub.calledOnce,
    true,
    'should not create a new object when called the second time'
  );
  t.equal(typeof result._db, 'object', 'should return initialized database object');
  t.end();
});

test(`${mn} > init > called with a name of none-existing db object`, t => {
  const stubs = getDefaultStubs();
  const self = getSelf(stubs);
  const cnDetailsStub = getCnDetailsStub();

  self.init('some_name', cnDetailsStub);

  t.equal(
    stubs.validateInitParamsStub.called,
    true,
    'should call parameters validator'
  );

  t.equal(
    stubs.validateGlobalRetryOptionsStub.called,
    true,
    'should call retry options validator'
  );

  t.deepEqual(
    stubs.createDbConnObjectStub.getCall(0).args[0],
    cnDetailsStub,
    'should call for db object creation with connection details'
  );

  t.end();
});

test(`${mn} > init > called with a name of existing and initialized db name`, t => {
  const stubs = getDefaultStubs();
  const self = getSelf(stubs);
  const cnDetailsStub = getCnDetailsStub();
  const DB_NAME = 'some_val';

  self.init(DB_NAME, cnDetailsStub);

  const fn = () => self.init(DB_NAME, cnDetailsStub);

  t.throws(fn, Error, 'should throw Error');
  t.end();
});

test(`${mn} > init > called with a name of existing but uninitialized db name`, t => {
  const stubs = getDefaultStubs();
  stubs.createDbConnObjectStub = sinon.spy(() => ({ _db: null }));
  const self = getSelf(stubs);
  const cnDetailsStub = getCnDetailsStub();
  const DB_NAME = 'some_val';

  self.init(DB_NAME, cnDetailsStub);
  self.init(DB_NAME, cnDetailsStub);

  t.equal(
    stubs.validateInitParamsStub.called,
    true,
    'should call parameters validator'
  );

  t.equal(
    stubs.validateGlobalRetryOptionsStub.called,
    true,
    'should call retry options validator'
  );

  t.equal(
    stubs.createDbConnObjectStub.calledOnce,
    true,
    'should not call for db object creation at the second invocation'
  );

  t.deepEqual(
    stubs.createConnStub.getCall(0).args[0],
    cnDetailsStub,
    'should call for connection creation with connection details'
  );

  t.end();
});
