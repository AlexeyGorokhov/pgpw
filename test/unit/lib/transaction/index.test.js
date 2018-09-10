'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const getSelf = ({
  processArgsStub = () => ({ mode: null, transactionImplementor: () => {} })
} = {}) => proxyquire('../../../../lib/transaction', {
  './process-args': processArgsStub
});

const mn = 'lib/transaction/index.js';

const getDefaultProtoStub = () => ({
  _db: {
    tx: () => Promise.resolve()
  }
});

test(`${mn} > normal scenario`, async t => {
  try {
    const resultStub = Symbol('');
    const txStub = sinon.spy(() => Promise.resolve(resultStub));
    const protoStub = {
      ...getDefaultProtoStub(),
      _db: { tx: txStub }
    };
    const transactionModeStub = Symbol('');
    const implementorStub = () => {};
    const processArgsStub = () => ({
      mode: transactionModeStub,
      transactionImplementor: implementorStub
    });
    const self = getSelf({ processArgsStub });

    const result = await self.bind(protoStub)();

    t.equal(
      result,
      resultStub,
      'should return expected result'
    );

    const expectedFirstArg = {
      mode: transactionModeStub
    };

    t.deepEqual(
      txStub.getCall(0).args[0],
      expectedFirstArg,
      'should pass transaction mode as first arg to libary tx method'
    );

    t.equal(
      txStub.getCall(0).args[1],
      implementorStub,
      'should pass transaction implementor as second arg to library tx method'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > db object is not initialized yet`, async t => {
  try {
    const protoStub = {
      ...getDefaultProtoStub(),
      _db: null
    };
    const self = getSelf();

    await self.bind(protoStub)();

    t.end(new Error('should not resolve'));
  } catch (err) {
    t.equal(
      err instanceof Error,
      true,
      'should throw an Error'
    );

    t.end();
  }
});

test(`${mn} > the library call rejects with its custom error`, async t => {
  const ERR_1 = new Error('error1');
  const ERR_2 = new Error('error2');

  try {
    const e = new Error('');
    e.getErrors = () => [ERR_1, ERR_2];
    const protoStub = {
      _db: {
        tx: () => Promise.reject(e)
      }
    };
    const self = getSelf();

    await self.bind(protoStub)();

    t.end(new Error('should not resolve'));
  } catch (err) {
    t.equal(
      err.cause(),
      ERR_1,
      'should take the first error'
    );

    t.end();
  }
});

test(`${mn} > connection to database fails`, async t => {
  try {
    const e = new Error('');
    e.errno = 'ECONNREFUSED';
    const protoStub = {
      _db: {
        tx: () => Promise.reject(e)
      }
    };
    const self = getSelf();

    await self.bind(protoStub)();

    t.end(new Error('should not resolve'));
  } catch (err) {
    t.equal(
      err.name,
      'DatabaseUnavailable',
      'should reject with a DatabaseUnavailable error'
    );

    t.end();
  }
});

test(`${mn} > connection to database timeouts`, async t => {
  try {
    const e = new Error('');
    e.errno = 'ETIMEDOUT';
    const protoStub = {
      _db: {
        tx: () => Promise.reject(e)
      }
    };
    const self = getSelf();

    await self.bind(protoStub)();

    t.end(new Error('should not resolve'));
  } catch (err) {
    t.equal(
      err.name,
      'DatabaseUnavailable',
      'should reject with a DatabaseUnavailable error'
    );

    t.end();
  }
});

test(`${mn} > any other error occurs`, async t => {
  try {
    const protoStub = {
      _db: {
        tx: () => Promise.reject(new Error('msg'))
      }
    };
    const self = getSelf();

    await self.bind(protoStub)();

    t.end(new Error('should not resolve'));
  } catch (err) {
    t.equal(
      err.name,
      'UnexpectedError',
      'should reject with a UnexpectedError error'
    );

    t.end();
  }
});
