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

        if (checkUser.rows[0]) {
          for (let i = 0; i < checkUser.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkUser.rows[0].password)) {
              this.error = 'Sorry, this account already exists';
              return {};
            }
          }
        }

        const { rows } = await db.query(text, values);
        this.user = rows[0];

      } catch (error) {
        console.log(error);
      }

      return this.user;
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  signin(form) {
    if (form.uname !== '' && form.password !== '') {
      Object.keys(this.users).forEach((key) => {
        if (this.users[key].uname === form.uname &&
          bcrypt.compareSync(form.password, this.users[key].password)) {
          this.user = {
            id: this.users[key].id,
            fname: this.users[key].fname,
            lname: this.users[key].lname,
            uname: this.users[key].uname,
            phone: this.users[key].phone,
            email: this.users[key].email,
            country: this.users[key].country,
            city: this.users[key].city,
            address: this.users[key].address,
          };
        }
      });

      if (Object.keys(this.user).length > 0) {
        return this.user;
      }

      this.error = 'Sorry, your username or password is incorrect';
      return {};
    }

    this.error = 'Please, enter your username and your password!';
    return {};
  } // end of signin method
} // end of User class


export default User;