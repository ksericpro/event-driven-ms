//import pg from 'pg';
const pg = require('pg');

const config = {
  user: 'event-driven-user', //this is the db user credential
  database: 'event-driven_db',
  password: 'S3cret',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const createTables = () => {
  const auditLogTable = `CREATE TABLE IF NOT EXISTS
      audit_logs(
        id SERIAL PRIMARY KEY,
        action VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        transaction_date VARCHAR(128) NOT NULL
      )`;
  pool.query(auditLogTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


//export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool,
};

require('make-runnable');