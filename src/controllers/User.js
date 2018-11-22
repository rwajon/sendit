import bcrypt from 'bcryptjs';

class User {
  constructor(users) {
    this.user = {};
    this.users = users || {};
    this.error = '';
  }

  signup(form) {
    if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {
      const id = Math.random().toString().substr(2, 3);

      this.users[`user${id}`] = {
        id,
        fname: form.fname,
        lname: form.lname,
        uname: form.uname,
        password: bcrypt.hashSync(form.password, 8),
        phone: form.phone,
        email: form.email,
        country: form.country,
        city: form.city,
        address: form.address,
      };

      this.user = {
        id,
        fname: form.fname,
        lname: form.lname,
        uname: form.uname,
        phone: form.phone,
        email: form.email,
        country: form.country,
        city: form.city,
        address: form.address,
      };

      return this.user;
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  signin(form) {
    if (form.uname !== '' && form.password !== '') {
      Object.keys(this.users).forEach((key) => {
        if (this.users[key].uname === form.uname
          && bcrypt.compareSync(form.password, this.users[key].password)) {
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
