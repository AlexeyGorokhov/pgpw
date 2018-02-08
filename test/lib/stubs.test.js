'use strict';

const test = require('tape');

const self = require('../../lib/stubs');

test('passed no params', async t => {
  try {
    const returnedStubs = self()();

    t.equal('execFunc' in returnedStubs, true, 'should include "execFunc"');
    t.equal('transaction' in returnedStubs, true, 'should include "transaction"');

    let resolvedValue = await returnedStubs.execFunc();
    t.equal(resolvedValue, null, 'should include default stub for "execFunc"');

    resolvedValue = await returnedStubs.transaction();
    t.equal(resolvedValue, null, 'should include default stub for "transaction"');

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed custom "execFunc" stub', async t => {
  try {
    const expectedResolvedVal = Symbol('');
    const execFuncStub = () => Promise.resolve(expectedResolvedVal);

    const returnedStubs = self({ execFunc: execFuncStub })();

    t.equal('execFunc' in returnedStubs, true, 'should include "execFunc"');
    t.equal('transaction' in returnedStubs, true, 'should include "transaction"');

    let resolvedValue = await returnedStubs.execFunc();
    t.equal(resolvedValue, expectedResolvedVal, 'should include custom stub for "execFunc"');

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed custom "transaction" stub', async t => {
  try {
    const expectedResolvedVal = Symbol('');
    const transactionStub = () => Promise.resolve(expectedResolvedVal);

    const returnedStubs = self({ transaction: transactionStub })();

    t.equal('execFunc' in returnedStubs, true, 'should include "execFunc"');
    t.equal('transaction' in returnedStubs, true, 'should include "transaction"');

    let resolvedValue = await returnedStubs.transaction();
    t.equal(resolvedValue, expectedResolvedVal, 'should include custom stub for "transaction"');

    t.end();
  } catch (err) {
    t.end(err);
  }
});
