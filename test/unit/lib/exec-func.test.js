'use strict';

const test = require('tape');

const self = require('../../../lib/exec-func');

const getDefaultProtoStub = () => ({
  _db: {
    func: () => Promise.resolve()
  }
});

test('exec-func >> called without params', t => {
  self.bind(getDefaultProtoStub())()
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
      t.end();
    });
});

test('exec-func >> called with "name" param that is not a string', t => {
  self.bind(getDefaultProtoStub())(['not_a_string'])
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
      t.end();
    });
});

test('exec-func >> called with "name" param that is an empty string', t => {
  self.bind(getDefaultProtoStub())('')
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err instanceof TypeError, true, 'should reject with a TypeError');
      t.end();
    });
});

test('exec-func >> called with "params" param that is not an Array', t => {
  self.bind(getDefaultProtoStub())('some_name', 'not_an_array')
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

test('exec-func >> connection to database fails', t => {
  const e = new Error('');
  e.errno = 'ECONNREFUSED';
  const proto = {
    _db: {
      func: () => Promise.reject(e)
    }
  };

  self.bind(proto)('some_name', [])
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
      t.end();
    });
});

test('exec-func >> connection to database timeouts', t => {
  const e = new Error('');
  e.errno = 'ETIMEDOUT';
  const proto = {
    _db: {
      func: () => Promise.reject(e)
    }
  };

  self.bind(proto)('some_name', [])
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'DatabaseUnavailable', 'should reject with a DatabaseUnavailable error');
      t.end();
    });
});

test('exec-func >> any other error occurs', t => {
  const proto = {
    _db: {
      func: () => Promise.reject(new Error('msg'))
    }
  };

  self.bind(proto)('some_name', [])
    .then(() => t.end('should not resolve'))
    .catch(err => {
      t.equal(err.name, 'UnexpectedError', 'should reject with an UnexpectedError error');
      t.end();
    });
});
