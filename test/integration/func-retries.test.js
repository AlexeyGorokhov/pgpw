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

test('function call with retries', async t => {
  try {
    try {
      await db.execFunc(
        'pgpw_test.get_one_by_id',
        ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54']
      );

      t.end('not expected to resolve');
    } catch (err) {
      t.equal(
        err.name,
        'DatabaseUnavailable',
        'should reject with DatabaseUnavailable error'
      );
    }

    const recordset = await db.execFunc(
      'pgpw_test.get_one_by_id',
      ['5db1e0ba-6342-463f-bdbb-ebb4b9551e54'],
      {
        retry: {
          initialDelayMs: 3000,
          maxAttempts: 10,
          exponent: 1
        }
      }
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
