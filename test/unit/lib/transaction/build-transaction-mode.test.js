'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const mn = 'lib/transaction/build-transaction-mode';

const ISOLATION_LEVEL_NAME = Symbol('');
const ISOLATION_LEVEL_VAL = Symbol('');

const getSelf = (
  pgpStub = {
    txMode: {
      isolationLevel: { [ISOLATION_LEVEL_NAME]: ISOLATION_LEVEL_VAL },
      TransactionMode: function (a) { return a; }
    }
  }
) => proxyquire('../../../../lib/transaction/build-transaction-mode', {
  'pg-promise': pgpStub
});

test(`${mn} > user passed existing isolation level`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with user defined value'
  );

  t.end();
});

test(`${mn} > user passed non-existing isolation level`, t => {
  const ISOLATION_LEVEL_VAL = Symbol('');
  const pgpStub = {
    txMode: {
      isolationLevel: { none: ISOLATION_LEVEL_VAL },
      TransactionMode: function (a) { return a; }
    }
  };
  const self = getSelf(pgpStub);
  const transactionModeStub = {
    isolationLevel: 'value_that_does_not_exist'
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with default value'
  );

  t.end();
});

test(`${mn} > isReadOnly prop is set to true`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isReadOnly: true
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL,
    readOnly: true
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with readOnly prop set to true'
  );

  t.end();
});

test(`${mn} > isReadOnly prop is set to false`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isReadOnly: false
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL,
    readOnly: false
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with readOnly prop set to false'
  );

  t.end();
});

test(`${mn} > isReadOnly prop is set to a truthy value but not true`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isReadOnly: {}
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor without readOnly prop'
  );

  t.end();
});

test(`${mn} > isReadOnly prop is set to a falsey value but not false`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isReadOnly: ''
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor without readOnly prop'
  );

  t.end();
});

test(`${mn} > isDeferrable prop is set to true`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isDeferrable: true
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL,
    deferrable: true
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with deferrable prop set to true'
  );

  t.end();
});

test(`${mn} > isDeferrable prop is set to false`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isDeferrable: false
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL,
    deferrable: false
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor with deferrable prop set to false'
  );

  t.end();
});

test(`${mn} > isDeferrable prop is set a truthy value but not true`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isDeferrable: {}
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor without deferrable prop'
  );

  t.end();
});

test(`${mn} > isDeferrable prop is set a falsey value but not false`, t => {
  const self = getSelf();
  const transactionModeStub = {
    isolationLevel: ISOLATION_LEVEL_NAME,
    isDeferrable: ''
  };

  const result = self(transactionModeStub);

  const expectedResult = {
    tiLevel: ISOLATION_LEVEL_VAL
  };

  t.deepEqual(
    result,
    expectedResult,
    'should call constructor without deferrable prop'
  );

  t.end();
});
