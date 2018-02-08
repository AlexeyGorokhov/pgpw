'use strict';

const test = require('tape');

const self = require('../../lib/transaction');

const getDefaultProtoStub = () => ({
  _db: {
    tx: () => Promise.resolve()
  }
});

test('transaction > called without param', t => {
  self.bind(getDefaultProtoStub())()
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
      t.end();
    });
});

test('transaction > called with param that is not a function', t => {
  self.bind(getDefaultProtoStub())('not_a_function')
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
      t.end();
    });
});

test('transaction > db object is not initialized yet', t => {
  const proto = {
    _db: null
  };

  self.bind(proto)('some_name', [])
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof Error, true, 'should reject with a Error');
      t.end();
    });
});

test('transaction > the library call rejects with its custom error', t => {
  const ERR_1 = new Error('error1');
  const ERR_2 = new Error('error2');
  const e = new Error('');
  e.getErrors = () => [ERR_1, ERR_2];
  const proto = {
    _db: {
      tx: () => Promise.reject(e)
    }
  };

  self.bind(proto)(() => {})
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.cause(), ERR_1, 'should take the first error');
      t.end();
    });
});

test('transaction > connection to database fails', t => {
  const e = new Error('');
  e.errno = 'ECONNREFUSED';
  const proto = {
    _db: {
      tx: () => Promise.reject(e)
    }
  };

  self.bind(proto)(() => {})
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
      t.end();
    });
});

test('transaction > connection to database timeouts', t => {
  const e = new Error('');
  e.errno = 'ETIMEDOUT';
  const proto = {
    _db: {
      tx: () => Promise.reject(e)
    }
  };

  self.bind(proto)(() => {})
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
      t.end();
    });
});

test('transaction > any other error occurs', t => {
  const proto = {
    _db: {
      tx: () => Promise.reject(new Error('msg'))
    }
  };

  self.bind(proto)(() => {})
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'UnexpectedError', 'should reject with an UnexpectedError error');
      t.end();
    });
});
