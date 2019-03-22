'use strict';

const test = require('tape');

const self = require('../../../lib/calculate-retry-delay');

const mn = 'lib/calculate-retry-delay';

test(`${mn} > this is the first attempt`, t => {
  const retryOptionsStub = {};
  const attemptNumStub = 0;

  const result = self(retryOptionsStub, attemptNumStub);

  t.equal(
    result,
    0,
    'should return 0'
  );

  t.end();
});

test(`${mn} > exponent is not an integer`, t => {
  const retryOptionsStub = {
    initialDelayMs: 300,
    exponent: 2.75
  };
  const attemptNumStub = 5;

  const result = self(retryOptionsStub, attemptNumStub);

  t.equal(
    Number.parseInt(String(result), 10),
    result,
    'should always return an integer'
  );

  t.end();
});
