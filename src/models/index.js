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

// https://www.codementor.io/olawalealadeusi896
export default {
  query(text, params){
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
    })
  }
}