import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: `${process.env.DB_NAME}_${process.env.NODE_ENV}`,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const dropTables = () => {
  const usersTable = `DROP TABLE IF EXISTS users`;

  const adminsTable = `DROP TABLE IF EXISTS admins`;

  const ordersTable = `DROP TABLE IF EXISTS orders`;

  const dropTablesQueries = `${usersTable}; ${adminsTable}; ${ordersTable}`;   

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
        fname VARCHAR(50) NOT NULL,
        lname VARCHAR(50) NOT NULL,
        uname VARCHAR(50) NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) NULL,
        country VARCHAR(50) NOT NULL,
        city VARCHAR(50) NULL,
        address VARCHAR(100) NULL
      )`;

  const adminsTable = `CREATE TABLE IF NOT EXISTS
      admins(
        id SERIAL PRIMARY KEY,
        fname VARCHAR(50) NOT NULL,
        lname VARCHAR(50) NOT NULL,
        uname VARCHAR(50) NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100) NULL,
        country VARCHAR(50) NOT NULL,
        city VARCHAR(50) NULL,
        address VARCHAR(100) NULL
      )`;

  const ordersTable = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_name VARCHAR(100) NOT NULL,
        receiver_phone VARCHAR(15) NOT NULL,
        receiver_email VARCHAR(100) NULL,
        receiver_country VARCHAR(50) NOT NULL,
        receiver_city VARCHAR(50) NULL,
        receiver_address VARCHAR(100) NULL,
        product VARCHAR(100) NOT NULL,
        weight VARCHAR(10) NULL,
        qty INT NOT NULL,
        price DECIMAL(12,3) NOT NULL,
        status VARCHAR(20) NULL,
        presentLocation TEXT NULL
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