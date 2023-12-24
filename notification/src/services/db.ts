import pg from 'pg';
//const pg = require('pg');

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

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

export default pool;