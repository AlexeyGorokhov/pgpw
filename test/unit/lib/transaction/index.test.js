'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/transaction/index.js';

const getSelf = (stubs = {}) => {
  const {
    processArgsStub = () => ({}),
    validateLocalRetryOptionsStub = () => ({}),
    defaultRetryOptionsStub = {},
    executeStub = () => Promise.resolve()
  } = stubs;

  return proxyquire('../../../../lib/transaction', {
    './process-args': processArgsStub,
    '../validate-local-retry-options': validateLocalRetryOptionsStub,
    '../default-retry-options': defaultRetryOptionsStub,
    './execute': executeStub
  });
};

const getDefaultProtoStub = () => ({
  _db: {},
  retryOptions: {}
});

test(`${mn} > normal scenario`, async t => {
  try {
    const protoStub = getDefaultProtoStub();
    const stubs = {
      executeStub: sinon.spy(() => Promise.resolve())
    };

    await getSelf(stubs).bind(protoStub)();

    t.equal(
      stubs.executeStub.called,
      true,
      'should call execution'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > db object is not initialized yet`, async t => {
  try {
    const proto = {
      ...getDefaultProtoStub(),
      _db: null
    };

    await getSelf().bind(proto)('some_name', []);

    t.end('should not resolve');
  } catch (err) {
    t.equal(err instanceof Error, true, 'should reject with a Error');
    t.end();
  }
});

test(`${mn} > validation of local retry options fails`, async t => {
  const ERR_MSG = 'error message';

  try {
    const stubs = {
      validateLocalRetryOptionsStub: () => { throw new Error(ERR_MSG); }
    };

    await getSelf(stubs).bind(getDefaultProtoStub())('some_name', []);

    t.end('should not resolve');
  } catch (err) {
    t.equal(
      err.message,
      ERR_MSG,
      'should re-throw the error'
    );

    t.end();
  }
});

test(`${mn} > validation of local retry options returns a value`, async t => {
  const LOCAL_RETRY_OPTIONS = Symbol('');

  try {
    const stubs = {
      validateLocalRetryOptionsStub: () => LOCAL_RETRY_OPTIONS,
      executeStub: sinon.spy(() => Promise.resolve())
    };

    await getSelf(stubs).bind(getDefaultProtoStub())('some_name', []);

    const executeCallArgs = stubs.executeStub.getCall(0).args[0];

    t.equal(
      executeCallArgs.retryOpts,
      LOCAL_RETRY_OPTIONS,
      'should call execution with local retry options'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > there are no local retry options but there are global options`, async t => {
  try {
    const GLOBAL_RETRY_OPTS = Symbol('');
    const stubs = {
      validateLocalRetryOptionsStub: () => null,
      executeStub: sinon.spy(() => Promise.resolve())
    };
    const proto = {
      ...getDefaultProtoStub(),
      retryOptions: GLOBAL_RETRY_OPTS
    };

    await getSelf(stubs).bind(proto)('some_name', []);

    const executeCallArgs = stubs.executeStub.getCall(0).args[0];

    t.equal(
      executeCallArgs.retryOpts,
      GLOBAL_RETRY_OPTS,
      'should call execution with global retry options'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > there are neither local nor global retry options`, async t => {
  try {
    const DEFAULT_RETRY_OPTS = Symbol('');
    const stubs = {
      validateLocalRetryOptionsStub: () => null,
      defaultRetryOptionsStub: DEFAULT_RETRY_OPTS,
      executeStub: sinon.spy(() => Promise.resolve())
    };
    const proto = {
      ...getDefaultProtoStub(),
      retryOptions: null
    };

    await getSelf(stubs).bind(proto)('some_name', []);

    const executeCallArgs = stubs.executeStub.getCall(0).args[0];

    t.equal(
      executeCallArgs.retryOpts,
      DEFAULT_RETRY_OPTS,
      'should call execution with default retry options'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});
