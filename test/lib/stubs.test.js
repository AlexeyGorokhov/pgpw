'use strict';

const test = require('tape');

const self = require('../../lib/stubs');

test('passed no params', async t => {
  try {
    const returnedStubs = self()();

    t.equal(
      'execFunc' in returnedStubs,
      true,
      'should include "execFunc"'
    );
    t.equal(
      'transaction' in returnedStubs,
      true,
      'should include "transaction"'
    );

    let resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      null,
      'should include default stub for "execFunc"'
    );

    resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      null,
      'should include default stub for "transaction"'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed single custom "execFunc" stub', async t => {
  try {
    const expectedResolvedVal = Symbol('');
    const execFuncStub = () => Promise.resolve(expectedResolvedVal);

    const returnedStubs = self({ execFunc: execFuncStub })();

    t.equal(
      'execFunc' in returnedStubs,
      true,
      'should include "execFunc"'
    );
    t.equal(
      'transaction' in returnedStubs,
      true,
      'should include "transaction"'
    );

    let resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      expectedResolvedVal,
      'should include custom stub for "execFunc"'
    );

    resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      expectedResolvedVal,
      'should invoke the same stub on subsequent calls'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed an array of custom "execFunc" stubs', async t => {
  try {
    const expectedResolvedVal1 = Symbol('');
    const expectedResolvedVal2 = Symbol('');
    const execFuncStub = [
      () => Promise.resolve(expectedResolvedVal1),
      () => Promise.resolve(expectedResolvedVal2)
    ];

    const returnedStubs = self({ execFunc: execFuncStub })();

    let resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      expectedResolvedVal1,
      'should invoke the first "execFunc" stub on first call'
    );

    resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      expectedResolvedVal2,
      'should invoke the second "execFunc" stub on second call'
    );

    resolvedValue = await returnedStubs.execFunc();

    t.equal(
      resolvedValue,
      expectedResolvedVal2,
      'should invoke the second "execFunc" stub on subsequent calls'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed single custom "transaction" stub', async t => {
  try {
    const expectedResolvedVal = Symbol('');
    const transactionStub = () => Promise.resolve(expectedResolvedVal);

    const returnedStubs = self({ transaction: transactionStub })();

    t.equal(
      'execFunc' in returnedStubs,
      true,
      'should include "execFunc"'
    );
    t.equal(
      'transaction' in returnedStubs,
      true,
      'should include "transaction"'
    );

    let resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      expectedResolvedVal,
      'should include custom stub for "transaction"'
    );

    resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      expectedResolvedVal,
      'should invoke the same stub on subsequent calls'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('passed an array of custom "transaction" stubs', async t => {
  try {
    const expectedResolvedVal1 = Symbol('');
    const expectedResolvedVal2 = Symbol('');
    const transactionStub = [
      () => Promise.resolve(expectedResolvedVal1),
      () => Promise.resolve(expectedResolvedVal2)
    ];

    const returnedStubs = self({ transaction: transactionStub })();

    let resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      expectedResolvedVal1,
      'should invoke the first "transaction" stub on first call'
    );

    resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      expectedResolvedVal2,
      'should invoke the second "transaction" stub on second call'
    );

    resolvedValue = await returnedStubs.transaction();

    t.equal(
      resolvedValue,
      expectedResolvedVal2,
      'should invoke the second "transaction" stub on subsequent calls'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});
