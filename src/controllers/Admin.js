import bcrypt from 'bcryptjs';
import db from '../models/index';

class Admin {
  constructor(admins) {
    this.admin = {};
    this.admins = admins || {};
    this.error = '';
  }

  async signup(form) {
    if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {

      const text = `INSERT INTO
            admins(fname, lname, uname, password, phone, email, country, city, address)
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
        const checkAdmin = await db.query('SELECT * FROM admins WHERE uname=$1', [form.uname]);

        if (checkAdmin.rows.length) {
          for (let i = 0; i < checkAdmin.rows.length; i++) {
            if (bcrypt.compareSync(form.password, checkAdmin.rows[i].password)) {
              this.error = 'Sorry, this account already exists';
              return {};
            }
          }
        }

        const { rows } = await db.query(text, values);

        this.admin = {
          id: rows[0].id,
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

      return this.admin;
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  signin(form) {
    if (form.uname !== '' && form.password !== '') {
      Object.keys(this.admins).forEach((key) => {
        if (this.admins[key].uname === form.uname && this.admins[key].password === form.password) {
          this.admin = {
            id: this.admins[key].id,
            uname: this.admins[key].uname,
          };
        }
      });

      if (Object.keys(this.admin).length > 0) {
        return this.admin;
      }

      this.error = 'Sorry, your username or password is incorrect';
      return this.error;
    }

    this.error = 'Please, enter your username and your password!';
    return this.error;
  } // end of signin method
} // end of Admin class


export default Admin;