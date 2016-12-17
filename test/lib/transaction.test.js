'use strict';

const test = require('tape');

const self = require('../../lib/transaction');

const getDefaultProtoStub = () => ({
  _db: {
    tx: () => Promise.resolve()
  }
});

test('transaction >> called without param', t => {
  self.bind(getDefaultProtoStub())()
  .then(() => t.end('should not resolve'))
  .catch(err => {
    t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
    t.end();
  });
});

test('transaction >> called with param that is not a function', t => {
  self.bind(getDefaultProtoStub())('not_a_function')
  .then(() => t.end('should not resolve'))
  .catch(err => {
    t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
    t.end();
  });
});

test('exec-func >> db object is not initialized yet', t => {
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

test('transaction >> connection to database fails', t => {
  const proto = {
    _db: {
      tx: () => Promise.reject({ errno: 'ECONNREFUSED' })
    }
  };

  self.bind(proto)(() => {})
  .then(() => t.end('should not resolve'))
  .catch(err => {
    t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
    t.end();
  });
});

test('transaction >> connection to database timeouts', t => {
  const proto = {
    _db: {
      tx: () => Promise.reject({ errno: 'ETIMEDOUT' })
    }
  };

  self.bind(proto)(() => {})
  .then(() => t.end('should not resolve'))
  .catch(err => {
    t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
    t.end();
  });
});

test('transaction >> any other error occurs', t => {
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
