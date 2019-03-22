'use strict';

const test = require('tape');

const self = require('../../../lib/identify-db-unavailable-error');

const mn = 'lib/identify-db-unavailable-error';

test(`${mn} > database error`, t => {
  const errorStubs = [
    { code: 'ECONNREFUSED' },
    { code: 'ETIMEDOUT' },
    { code: '3D000' },
    { code: '57P03' },
    { message: 'connection terminated unexpectedly' }
  ];

  const results = errorStubs.map(self);

  t.equal(
    results.every(result => result === true),
    true,
    'should return true'
  );

  t.end();
});

test(`${mn} > another error`, t => {
  const errorStub = new Error('');

  const result = self(errorStub);

  t.equal(result, false, 'should return false');

  t.end();
});
