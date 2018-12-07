import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') ? `_${process.env.NODE_ENV}` : '';

const config = {
  host: process.env[`DB_HOST${env}`],
  user: process.env[`DB_USER${env}`],
  database: process.env[`DB_NAME${env}`],
  password: process.env[`DB_PASSWORD${env}`],
  port: process.env[`PORT${env}`],
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const dropTables = () => {
  const ordersTable = 'DROP TABLE IF EXISTS orders';

  const usersTable = 'DROP TABLE IF EXISTS users';

  const adminsTable = 'DROP TABLE IF EXISTS admins';

  const dropTablesQueries = `${ordersTable}; ${usersTable}; ${adminsTable}`;

  pool.query(dropTablesQueries)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

const createTables = () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(50) NOT NULL,
        "lastName" VARCHAR(50) NOT NULL,
        "userName" VARCHAR(50) NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) NULL,
        country VARCHAR(50) NOT NULL,
        city VARCHAR(50) NULL,
        address VARCHAR(100) NULL,
        "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

  const adminsTable = `CREATE TABLE IF NOT EXISTS
      admins(
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(50) NOT NULL,
        "lastName" VARCHAR(50) NOT NULL,
        "userName" VARCHAR(50) NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) NULL,
        country VARCHAR(50) NOT NULL,
        city VARCHAR(50) NULL,
        address VARCHAR(100) NULL,
        "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

  const ordersTable = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL REFERENCES users(id),
        "receiverName" VARCHAR(100) NOT NULL,
        "receiverPhone" VARCHAR(15) NOT NULL,
        "receiverEmail" VARCHAR(100) NULL,
        "receiverCountry" VARCHAR(50) NOT NULL,
        "receiverCity" VARCHAR(50) NULL,
        "receiverAddress" VARCHAR(100) NULL,
        product VARCHAR(100) NOT NULL,
        weight VARCHAR(10) NULL,
        qty INT NOT NULL,
        price DECIMAL(12,3) NOT NULL,
        status VARCHAR(20) NULL,
        location TEXT NULL,
        "createdDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

  const createTablesQueries = `${usersTable}; ${adminsTable}; ${ordersTable}`;

  pool.query(createTablesQueries)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

export { dropTables, createTables, pool };

require('make-runnable');
