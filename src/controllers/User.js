import bcrypt from 'bcryptjs';
import db from '../models/index';

class User {
  constructor() {
    this.user = {};
    this.users = [];
    this.error = '';
  }

  async signup(form) {
    if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {

      const text = `INSERT INTO
            users(fname, lname, uname, password, phone, email, country, city, address)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning id, fname, lname, uname, phone, email, country, city, address`;

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

        return {
          id: rows[0].id,
          fname: form.fname,
          lname: form.lname,
          uname: form.uname,
          phone: form.phone,
          email: form.email,
          country: form.country,
          city: form.city,
          address: form.address,
        };
      } catch (error) {
        console.log(error);
      }
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  async login(form) {
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
  } // end of login method
} // end of User class


export default User;