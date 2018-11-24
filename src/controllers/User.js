import bcrypt from 'bcryptjs';
import db from '../models/index';

class User {
  constructor(users) {
    this.user = {};
    this.users = users || {};
    this.error = '';
  }

  async signup(form) {
    if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {

      const text = `INSERT INTO
            users(fname, lname, uname, password, phone, email, country, city, address)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning id, fname, uname, phone, email, country, city, address`;

      const values = [
        form.fname,
        form.lname,
        form.uname,
        bcrypt.hashSync(form.password, 8),
        form.phone,
        form.email,
        form.country,
        form.city,
        form.address
      ];

      try {
        const checkUser = await db.query('SELECT * FROM users WHERE uname=$1', [form.uname]);

        if (checkUser.rows.length) {
          for (let i = 0; i < checkUser.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkUser.rows[i].password)) {
              this.error = 'Sorry, this account already exists';
              return {};
            }
          }
        }

        const { rows } = await db.query(text, values);

        this.user = {
          fname: rows[0].fname,
          lname: rows[0].lname,
          uname: rows[0].uname,
          phone: rows[0].phone,
          email: rows[0].email,
          country: rows[0].country,
          city: rows[0].city,
          address: rows[0].address,
        };

      } catch (error) {
        console.log(error);
      }

      return this.user;
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  async signin(form) {
    if (form.uname !== '' && form.password !== '') {
      try {
        const checkUser = await db.query('SELECT * FROM users WHERE uname=$1', [form.uname]);

        if (checkUser.rows.length > 0) {
          for (let i = 0; i < checkUser.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkUser.rows[i].password)) {
              this.user = {
                id: checkUser.rows[i].id,
                fname: checkUser.rows[i].fname,
                lname: checkUser.rows[i].lname,
                uname: checkUser.rows[i].uname,
                phone: checkUser.rows[i].phone,
                email: checkUser.rows[i].email,
                country: checkUser.rows[i].country,
                city: checkUser.rows[i].city,
                address: checkUser.rows[i].address,
              }

              return this.user;
            }
          }
        }

        if (Object.keys(this.user).length <= 0) {
          this.error = 'Sorry, your username or password is incorrect';
          return {};
        }

      } catch (error) {
        console.log(error);
      }
    } else {
      this.error = 'Please, enter your username and your password!';
      return {};
    }
  } // end of signin method
} // end of User class


export default User;