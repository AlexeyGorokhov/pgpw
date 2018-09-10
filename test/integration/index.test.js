'use strict';

const test = require('tape');

const pgpw = require('../../index.js');

pgpw.init('pgpw_test', {
  host: 'localhost',
  port: 5432,
  database: 'pgpw_test',
  user: 'postgres',
  password: ''
});

const db = pgpw('pgpw_test');

test('basic function call', async t => {
  try {
    const recordset = await db.execFunc(
      'pgpw_test.get_one_by_id',
      ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']
    );

    t.equal(
      recordset.length,
      1,
      'should return data'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('basic transaction call', async t => {
  try {
    const recordsets = await db.transaction(tx => tx.batch([
      tx.func('pgpw_test.get_one_by_id', ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']),
      tx.func('pgpw_test.get_one_by_id', ['0ce04190-ca8f-4cfd-a167-f4906d56942a'])
    ]));

    t.equal(
      recordsets[0].length === 1 && recordsets[1].length === 1,
      true,
      'should return data'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('transaction rollback', async t => {
  try {
    await db.transaction(tx => tx.batch([
      tx.func('pgpw_test.pgpw_test.add_two', [
        '27fd1dda-9aec-45a5-b70c-dfef30644ac2',
        '5db1e0ba-6342-463f-bdbb-ebb4b9551e54', // This ID exists
        'foo'
      ]),
      tx.func('pgpw_test.pgpw_test.add_two', [
        '974de72a-b672-41a7-a6fb-f530a4cc89b2',
        '5db1e0ba-6342-463f-bdbb-ebb4b9551e58', // This ID doesn't exist
        'foo'
      ])
    ]));

    t.end(new Error('should throw'));
  } catch (_err) {
    try {
      const recordset = await db.execFunc(
        'pgpw_test.get_one_by_id',
        ['27fd1dda-9aec-45a5-b70c-dfef30644ac2']
      );

      t.equal(
        recordset.length,
        0,
        'should rollback transaction'
      );

      t.end();
    } catch (err) {
      t.end(err);
    }
  }
});

test('transaction call with full mode configuration', async t => {
  try {
    const implementor = tx => tx.batch([
      tx.func('pgpw_test.get_one_by_id', ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']),
      tx.func('pgpw_test.get_one_by_id', ['0ce04190-ca8f-4cfd-a167-f4906d56942a'])
    ]);
    const transactionMode = {
      isolationLevel: db.isolationLevel.serializable,
      isReadOnly: true,
      isDeferrable: true
    };

    const recordsets = await db.transaction(transactionMode, implementor);

    t.equal(
      recordsets[0].length === 1 && recordsets[1].length === 1,
      true,
      'should return data'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('transaction call with partial mode configuration', async t => {
  try {
    const implementor = tx => tx.batch([
      tx.func('pgpw_test.get_one_by_id', ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']),
      tx.func('pgpw_test.get_one_by_id', ['0ce04190-ca8f-4cfd-a167-f4906d56942a'])
    ]);
    const transactionMode = {
      isolationLevel: db.isolationLevel.repeatableRead,
      isReadOnly: false
    };

    const recordsets = await db.transaction(transactionMode, implementor);

    t.equal(
      recordsets[0].length === 1 && recordsets[1].length === 1,
      true,
      'should return data'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('exit', t => {
  t.end();
  process.exit(0);
});
