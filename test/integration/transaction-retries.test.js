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

test('transaction call with retries', async t => {
  try {
    try {
      await db.transaction(tx => tx.batch([
        tx.func('pgpw_test.get_one_by_id', ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']),
        tx.func('pgpw_test.get_one_by_id', ['0ce04190-ca8f-4cfd-a167-f4906d56942a'])
      ]));

      t.end('not expected to resolve');
    } catch (err) {
      t.equal(
        err.name,
        'DatabaseUnavailable',
        'should reject with DatabaseUnavailable error'
      );
    }

    const recordsets = await db.transaction(
      tx => tx.batch([
        tx.func('pgpw_test.get_one_by_id', ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']),
        tx.func('pgpw_test.get_one_by_id', ['0ce04190-ca8f-4cfd-a167-f4906d56942a'])
      ]),
      {
        retry: {
          initialDelayMs: 3000,
          maxAttempts: 10,
          exponent: 1
        }
      }
    );

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
