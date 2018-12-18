import bcrypt from 'bcryptjs';
import db from '../models/index';
import Validate from '../helpers/Validate';

class User {
  constructor() {
    this.user = {};
    this.users = [];
    this.error = '';
  }

  async signup(form) {
    if (form.firstName
      && form.lastName
      && form.userName
      && Validate.email(form.email)
      && form.password
      && form.phone) {
      
      const text = `INSERT INTO
            users("firstName", "lastName", "userName", password, phone, email, country, city, address)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning id, "firstName", "lastName", "userName", phone, email, country, city, address`;

      const values = [
        form.firstName,
        form.lastName,
        form.userName,
        bcrypt.hashSync(form.password, 8),
        form.phone,
        form.email,
        form.country,
        form.city,
        form.address,
      ];

      try {
        const checkUser = await db.query('SELECT * FROM users WHERE "userName"=$1 OR email=$2', [form.userName, form.email]);

        if (checkUser.rows.length) {
          for (let i = 0; i < checkUser.rows.length; i += 1) {
            if (bcrypt.compareSync(form.password, checkUser.rows[i].password)) {
              this.error = 'Sorry, this account already exists';
              return {};
            }
          }
        }

        const { rows } = await db.query(text, values);

        return rows[0];
      } catch (error) {
        console.log(error);
      }
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  async login(form) {
    if (form.userName !== '' && form.password !== '') {
      try {
        const checkUser = await db.query('SELECT * FROM users WHERE "userName"=$1', [form.userName]);

        if (checkUser.rows.length > 0) {
          for (let i = 0; i < checkUser.rows.length; i += 1) {
            if (bcrypt.compareSync(form.password, checkUser.rows[i].password)) {
              this.user = {
                id: checkUser.rows[i].id,
                firstName: checkUser.rows[i].firstName,
                lastName: checkUser.rows[i].lastName,
                userName: checkUser.rows[i].userName,
                phone: checkUser.rows[i].phone,
                email: checkUser.rows[i].email,
                country: checkUser.rows[i].country,
                city: checkUser.rows[i].city,
                address: checkUser.rows[i].address,
              };

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
    }
    this.error = 'Please, enter your username and your password!';
    return {};
  } // end of login method
} // end of User class


export default User;
