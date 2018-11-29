import bcrypt from 'bcryptjs';
import db from '../models/index';

class Admin {
  constructor() {
    this.admin = {};
    this.admins = [];
    this.error = '';
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async signup(form) {
    if (form.fname && form.lname && form.uname && this.validateEmail(form.email) && form.password && form.phone && form.country) {

      const text = `INSERT INTO
            admins(fname, lname, uname, password, phone, email, country, city, address)
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
        const checkAdmin = await db.query('SELECT * FROM admins WHERE uname=$1 OR email=$2', [form.uname, form.email]);

        if (checkAdmin.rows.length) {
          for (let i = 0; i < checkAdmin.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkAdmin.rows[i].password)) {
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
    if (form.uname !== '' && form.password !== '') {
      try {
        const checkAdmin = await db.query('SELECT * FROM admins WHERE uname=$1', [form.uname]);

        if (checkAdmin.rows.length > 0) {
          for (let i = 0; i < checkAdmin.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkAdmin.rows[i].password)) {
              this.admin = {
                id: checkAdmin.rows[i].id,
                fname: checkAdmin.rows[i].fname,
                lname: checkAdmin.rows[i].lname,
                uname: checkAdmin.rows[i].uname,
                phone: checkAdmin.rows[i].phone,
                email: checkAdmin.rows[i].email,
                country: checkAdmin.rows[i].country,
                city: checkAdmin.rows[i].city,
                address: checkAdmin.rows[i].address,
              }

              return this.admin;
            }
          }
        }

        if (Object.keys(this.admin).length <= 0) {
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
} // end of Admin class


export default Admin;