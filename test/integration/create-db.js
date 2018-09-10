'use strict';

const pgp = require('pg-promise')();

function execSqlFile (filename) {
  return new pgp.QueryFile(filename, { minify: false });
}

const _db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: ''
});

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'pgpw_test',
  user: 'postgres',
  password: ''
});

(async function () {
  try {
    await _db.query(execSqlFile('./sql/1-create-db.sql'));
    await db.query(execSqlFile('./sql/2-schemas.sql'));
    await db.query(execSqlFile('./sql/3-tables.sql'));
    await db.query(execSqlFile('./sql/4-functions.sql'));
    await db.query(execSqlFile('./sql/5-data.sql'));

    console.log('Database created...');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
