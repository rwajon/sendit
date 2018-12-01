import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV === 'test' ? `_${process.env.NODE_ENV}` : '';

const pool = new pg.Pool({
  connectionString: process.env[`DATABASE_URL${env}`],
});

pool.on('connect', () => {
  console.log('connected to the Database');
});

// https://www.codementor.io/olawalealadeusi896
export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
